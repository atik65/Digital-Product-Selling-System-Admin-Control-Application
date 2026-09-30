import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import debounce from "./debounce";
import logout from "./logout";

const handleUnauthorized = async () => {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    await logout();
  }
};

const isAuthRequest = (error) => {
  const url = error?.config?.url || "";
  return (
    url.includes("/auth/admin/login") ||
    url.includes("/auth/login") ||
    url.includes("/auth/refresh")
  );
};

const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (
        (error?.response?.status === 401 ||
          error?.response?.data?.code === 401) &&
        !isAuthRequest(error)
      ) {
        handleUnauthorized();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (
        (error?.response?.status === 401 ||
          error?.response?.data?.code === 401) &&
        !isAuthRequest(error)
      ) {
        handleUnauthorized();
      }
    },
  }),
});

const revalidateCache = debounce(async (queryKey) => {
  await queryClientInstance.invalidateQueries({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
  });
}, 1000);

export { queryClientInstance, revalidateCache };
