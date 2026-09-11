import axios from "axios";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setCookie,
} from "./cookies";

const instanceApi = axios.create({
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

// Response Interceptor: Queue-Based 401 Token Refresh
instanceApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh on login or refresh endpoint failures
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/admin/login") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return instanceApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthCookies();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          "/api/v1/auth/refresh",
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.access_token;
        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        // Save new access token (60 min)
        setCookie("access_token", newAccessToken, { expires: 1 / 24 });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return instanceApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthCookies();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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
    data: data ? data : api.method === "post" ? filter : undefined,
    params,
    onUploadProgress,
    onDownloadProgress,
    responseType,
    headers: resolvedHeaders,
  });
}

export default axiosInstance;

