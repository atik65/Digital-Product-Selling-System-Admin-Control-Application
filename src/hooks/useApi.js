/* eslint-disable react-hooks/rules-of-hooks */
import axiosInstance from "@/lib/axiosInstance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export default function useApi({
  api,
  cacheKey,
  filter = {},
  params = {},
  trigger = true,
  staleTime = 800000,
  isInfinite = false,
  headers = {},
  commonCacheKey = "",
  ...props
}) {
  const queryKey = Array.isArray(cacheKey)
    ? cacheKey
    : [cacheKey, filter, params, trigger, commonCacheKey];

  const queryFn = async ({ signal, pageParam }) => {
    const queryParams = isInfinite
      ? {
          ...params,
          cursor: pageParam ? pageParam : undefined,
        }
      : params;
    const response = await axiosInstance({
      signal,
      api,
      filter,
      params: queryParams,
      headers,
    });
    return response.data;
  };

  const commonOptions = {
    enabled: !!trigger,
    queryKey,
    queryFn,
    staleTime,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  ...props,
  };

  if (isInfinite) {
    return useInfiniteQuery({
      ...commonOptions,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.data?.hasMore || !lastPage?.data?.items?.length)
          return undefined;
        return lastPage?.data?.nextCursor;
      },
    });
  }
  return useQuery(commonOptions);
}

// ==================== USAGE EXAMPLES ====================

// Example 1: Basic GET request
// const { data, isLoading, error } = useApi({
//   api: {
//     method: "get",
//     endpoint: "/api",
//     path: "/users"
//   },
//   cacheKey: "users"
// });

// Example 2: GET request with params and filter
// const { data, isLoading, refetch } = useApi({
//   api: {
//     method: "get",
//     endpoint: "/api",
//     path: "/products"
//   },
//   cacheKey: ["products", searchTerm],
//   params: { page: 1, limit: 10 },
//   filter: { category: "electronics", status: "active" }
// });

// Example 3: POST request with filter data
// const { data, isLoading, error } = useApi({
//   api: {
//     method: "post",
//     endpoint: "/api",
//     path: "/users/create"
//   },
//   cacheKey: "createUser",
//   filter: { name: "John Doe", email: "john@example.com" },
//   trigger: shouldCreate // Only run when this is true
// });

// Example 4: Conditional query with trigger
// const [userId, setUserId] = useState(null);
// const { data, isLoading } = useApi({
//   api: {
//     method: "get",
//     endpoint: "/api",
//     path: `/users/${userId}`
//   },
//   cacheKey: ["user", userId],
//   trigger: !!userId, // Only fetch when userId is available
//   staleTime: 60000 // Cache for 1 minute
// });

// Example 5: Infinite scroll/pagination
// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useApi({
//   api: {
//     method: "get",
//     endpoint: "/api",
//     path: "/posts"
//   },
//   cacheKey: "posts",
//   isInfinite: true,
//   params: { limit: 20 }
// });
// // Access data: data?.pages.flatMap(page => page.data.items)
// // Load more: <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>

// Example 6: With common cache key for related queries
// const { data } = useApi({
//   api: {
//     method: "get",
//     endpoint: "/api",
//     path: "/orders"
//   },
//   cacheKey: ["orders", filters],
//   commonCacheKey: "ordersList", // Share invalidation with related queries
//   staleTime: 300000 // Cache for 5 minutes
// });

// Example 7: Custom React Query options
// const { data, isLoading } = useApi({
//   api: {
//     method: "get",
//     endpoint: "/api",
//     path: "/dashboard/stats"
//   },
//   cacheKey: "dashboardStats",
//   staleTime: 600000, // 10 minutes
//   refetchOnWindowFocus: true, // Override default
//   refetchInterval: 30000, // Refetch every 30 seconds
//   onSuccess: (data) => {
//     console.log("Data fetched successfully:", data);
//   },
//   onError: (error) => {
//     console.error("Failed to fetch:", error);
//   }
// });
