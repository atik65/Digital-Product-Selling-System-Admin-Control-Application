import axios from "axios";

const instanceApi = axios.create({
  // baseURL: config.baseURL,
  baseURL: "/",
  withCredentials: true,
});

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
  let authHeader = "Bearer ok";

  return instanceApi({
    method: api.method,
    signal,
    url: api.endpoint + (api.path && api.path),
    data: data ? data : api.method === "post" ? filter : undefined,
    params,
    onUploadProgress,
    onDownloadProgress,
    responseType,
    headers: {
      Authorization: authHeader,
      ...headers,
    },
  });
}

export default axiosInstance;
