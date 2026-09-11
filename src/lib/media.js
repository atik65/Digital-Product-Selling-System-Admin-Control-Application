import axiosInstance from "./axiosInstance";

const BACKEND_BASE = import.meta.env.VITE_MEDIA_BASE_URL || "http://localhost:8000";

/**
 * Returns full URL for a static media file path.
 * @param {string|null} path - Relative path like "/media/products/uuid.png"
 * @returns {string} Full URL or placeholder
 */
export const getImageUrl = (path) => {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  return `${BACKEND_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

/**
 * Uploads a file via multipart form data to FastAPI media upload endpoint.
 * @param {File} file - Browser File object
 * @param {string} folder - Target folder ("products", "categories", "banners", "popups", "settings")
 * @returns {Promise<string>} Uploaded file relative URL (e.g. "/media/products/...")
 */
export const uploadMedia = async (file, folder = "general") => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance({
    api: {
      endpoint: "/api/v1/media",
      path: `/upload?folder=${encodeURIComponent(folder)}`,
      method: "post",
    },
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.data?.file_url;
};

export default {
  getImageUrl,
  uploadMedia,
};
