import axios from "axios";
import {
  clearAuthCookies,
  getAccessToken,
  getCookie,
  getRefreshToken,
  setCookie,
} from "./cookies";

// Ensure credentials (cookies) are sent with all requests globally
axios.defaults.withCredentials = true;

export const instanceApi = axios.create({
  baseURL: "/",
  withCredentials: true,
});

// Auto-refresh state and queue for concurrent 401 requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor setup function
const setupAuthInterceptor = (axiosClient) => {
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);

      // Skip refresh on auth endpoints (login, signup, refresh)
      const isAuthEndpoint =
        originalRequest?.url?.includes("/auth/admin/login") ||
        originalRequest?.url?.includes("/auth/login") ||
        originalRequest?.url?.includes("/auth/refresh");

      const hasActiveSession =
        typeof window !== "undefined" &&
        (getCookie("signedIn") === "true" ||
          getCookie("isSignedIn") === "true" ||
          !!getAccessToken() ||
          !!localStorage.getItem("admin_user"));

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isAuthEndpoint &&
        hasActiveSession
      ) {
        if (isRefreshing) {
          // Queue request until ongoing refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (token) {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const savedRefreshToken = getRefreshToken();

            // Make raw refresh request
            // If savedRefreshToken is available, pass in body;
            // otherwise pass empty body so browser automatically sends HttpOnly refresh_token cookie
            const refreshResponse = await axios.post(
              "/api/v1/auth/refresh",
              savedRefreshToken ? { refresh_token: savedRefreshToken } : {},
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
                _retry: true,
              }
            );

            const newAccessToken =
              refreshResponse.data?.data?.access_token ||
              refreshResponse.data?.access_token;

            if (!newAccessToken) {
              throw new Error("No access token in refresh response");
            }

            // 1. Persist new access token in Cookies & localStorage
            setCookie("access_token", newAccessToken, { expires: 1 / 24 });
            setCookie("auth_token", newAccessToken, { expires: 1 / 24 });
            setCookie("signedIn", "true", { expires: 7 });
            setCookie("isSignedIn", "true", { expires: 7 });

            if (typeof window !== "undefined") {
              localStorage.setItem("access_token", newAccessToken);
              localStorage.setItem("admin_access_token", newAccessToken);
              const newRefreshToken =
                refreshResponse.data?.data?.refresh_token ||
                refreshResponse.data?.refresh_token;
              if (newRefreshToken) {
                localStorage.setItem("refresh_token", newRefreshToken);
                localStorage.setItem("admin_refresh_token", newRefreshToken);
                setCookie("refresh_token", newRefreshToken, { expires: 7 });
              }
            }

            // 2. Update default Authorization headers for future requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            instanceApi.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

            // 3. Update headers on the failed request
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // 4. Release all pending requests waiting in queue
            processQueue(null, newAccessToken);

            // 5. Retry the original request
            resolve(axiosClient(originalRequest));
          } catch (refreshError) {
            processQueue(refreshError, null);
            clearAuthCookies();
            if (
              typeof window !== "undefined" &&
              window.location.pathname !== "/login"
            ) {
              window.location.href = "/login";
            }
            reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        });
      }

      return Promise.reject(error);
    }
  );
};

setupAuthInterceptor(instanceApi);
setupAuthInterceptor(axios);

async function axiosInstance({
  signal,
  api,
  params = {},
  filter = {},
  data,
  onUploadProgress,
  onDownloadProgress,
  headers = {},
  responseType,
}) {
  const token = getAccessToken();
  const authHeader = token ? `Bearer ${token}` : undefined;

  const resolvedHeaders = {
    ...(authHeader && { Authorization: authHeader }),
    ...headers,
  };

  return instanceApi({
    method: api.method,
    signal,
    url: api.endpoint + (api.path && api.path),
    data: data ? data : api.method?.toLowerCase() === "post" ? filter : undefined,
    params,
    onUploadProgress,
    onDownloadProgress,
    responseType,
    headers: resolvedHeaders,
  });
}

export default axiosInstance;

