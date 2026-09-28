import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * useRequest Hook - Handles API mutations (POST, PUT, DELETE) with automatic cache updates
 *
 * @returns {Object} - useMutation object with mutateAsync, isPending, etc.
 *
 * USAGE EXAMPLES:
 *
 * 1. CREATE (Add new item to list):
 * ```js
 * await mutateAsync({
 *   data: formData,
 *   api: documentTypeApi.create,
 *   form,                           // react-hook-form instance for 422 validation errors
 *   cacheKey: "documentTypes",      // Updates list/table cache
 *   id: null,                       // null = create operation
 *   sort: "desc",                   // "asc" or "desc" - where to insert in list
 *   handleDone: (res) => {},        // Success callback
 *   isToast: true,                  // Show success toast (default: true), nb: optional
 * });
 * ```
 *
 * 2. UPDATE (Edit existing item):
 * ```js
 * await mutateAsync({
 *   data: formData,
 *   api: documentTypeApi.update(itemId),
 *   form,
 *   cacheKey: "documentTypes",      // Updates list/table cache
 *   addEditCacheKey: "documentTypeDetail", // Updates detail page cache (if exists)
 *   id: itemId,                     // Item ID = update operation
 *   handleDone: (res) => {},
 *   isToast: true, 
 * });
 * ```
 *
 * 3. DELETE:
 * ```js
 * await mutateAsync({
 *   api: documentTypeApi.delete(itemId),
 *   cacheKey: "documentTypes",      // Updates list/table cache
 *   id: itemId,                     // Required for delete
 *   isToast: true,
 * });
 * ```
 *
 * WHEN TO USE EACH CACHE KEY:
 *
 * - `cacheKey`: Use for LIST/TABLE views
 *   Example: /document-type page with table
 *   Updates the array of items in the list
 *
 * - `addEditCacheKey`: Use for DETAIL/SINGLE ITEM views
 *   Example: /document-type/:id detail page
 *   Updates the single item object
 *
 * - Use BOTH when you have both list and detail pages
 *   This keeps both caches in sync
 *
 * AUTOMATIC FEATURES:
 * - 422 validation errors auto-wired to form.setError()
 * - Optimistic updates for instant UI feedback
 * - Success/error toasts
 * - Supports both pagination and infinite scroll
 */
export default function useRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const response = await axiosInstance(variables);
      return response.data;
    },
    onError: async (err, variables) => {
      const toastVariant = variables?.toastVariant ?? "error";
      if (err?.response?.data?.code === 422) {
        const errors = err.response?.data?.errors;
        errors.forEach(async (error) => {
          await variables?.form?.setError(
            error.field,
            { message: error.message },
            { shouldFocus: true }
          );
        });
      } else {
        toast.error(
          err?.response?.data?.errors?.common?.msg ||
          err?.response?.data?.message ||
          err?.message
        );
      }

      variables.handleError && (await variables.handleError(err?.response));
    },
    onSuccess: async (data, variables) => {
      const isToast = variables.isToast ?? true;
      try {
        variables?.addEditCacheKey &&
          queryClient.setQueryData([variables?.addEditCacheKey], (oldData) => {
            if (!oldData) return oldData;
            return { data: { ...oldData?.data?.data, ...data?.data } };
          });

        if (variables.cacheKey) {
          queryClient.setQueriesData(
            {
              queryKey: [variables.cacheKey],
            },
            (oldData) => {
              if (!oldData) return oldData;
              if (oldData.pages) {
                return infiniteCrud(oldData, data, variables);
              } else {
                return paginationCrud(oldData, data, variables);
              }
            }
          );
          // Invalidate to trigger background re-sync
          queryClient.invalidateQueries({
            queryKey: [variables.cacheKey],
          });
        }
      } catch (error) {
        console.error("Cache update error in useRequest:", error);
      }

      try {
        isToast && data?.message && toast.success(data?.message);
        variables.handleDone && (await variables.handleDone(data, variables));
      } catch (error) {
        console.error("handleDone error in useRequest:", error);
      }
    },
  });
}

const resolveListContainer = (oldData) => {
  if (!oldData) return null;
  if (Array.isArray(oldData?.data?.items)) {
    return {
      list: oldData.data.items,
      update: (newList) => ({
        ...oldData,
        data: { ...oldData.data, items: newList },
      }),
    };
  }
  if (Array.isArray(oldData?.data?.data)) {
    return {
      list: oldData.data.data,
      update: (newList) => ({
        ...oldData,
        data: { ...oldData.data, data: newList },
      }),
    };
  }
  if (Array.isArray(oldData?.data)) {
    return {
      list: oldData.data,
      update: (newList) => ({
        ...oldData,
        data: newList,
      }),
    };
  }
  if (Array.isArray(oldData)) {
    return {
      list: oldData,
      update: (newList) => newList,
    };
  }
  return null;
};

const paginationCrud = (oldData, data, variables) => {
  const container = resolveListContainer(oldData);
  if (!container) return oldData;

  const { list, update } = container;
  const newItem = data?.data ?? data;

  // create
  if (!variables?.id) {
    const updatedList =
      variables?.sort === "asc"
        ? [...list, newItem]
        : [newItem, ...list];
    return update(updatedList);
  }
  // update
  else if (variables?.id && variables.api?.method?.toLowerCase() !== "delete") {
    const updatedList = list.map((curr) => {
      if (curr?.id === variables.id) {
        return { ...curr, ...(newItem && typeof newItem === "object" ? newItem : {}) };
      }
      return curr;
    });
    return update(updatedList);
  }
  // delete
  else if (variables?.id && variables.api?.method?.toLowerCase() === "delete") {
    const updatedList = list.filter((curr) => curr?.id !== variables.id);
    return update(updatedList);
  }

  return oldData;
};

// oldData is previous data and data is new data
const infiniteCrud = (oldData, data, variables) => {
  // create
  if (!variables?.id) {
    return {
      ...oldData,
      pages: oldData.pages.map((page, index) => {
        if (index === 0) {
          return {
            ...page,
            data: {
              ...page.data,
              data:
                variables?.sort === "asc"
                  ? [...page.data.data, data.data]
                  : [data.data, ...page.data.data],
              total: page.data.total + 1,
            },
          };
        }
        return page;
      }),
    };
  }
  // update
  else if (variables?.id && variables.api.method.toLowerCase() !== "delete") {
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          data: page.data.data.map((curr) =>
            curr.id === variables.id ? { ...curr, ...data.data } : curr
          ),
        },
      })),
    };
  }
  // delete
  else if (variables?.id && variables.api.method.toLowerCase() === "delete") {
    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          data: page.data.data.filter((curr) => curr.id !== variables.id),
          total: page.data.total - 1,
        },
      })),
    };
  }
};
