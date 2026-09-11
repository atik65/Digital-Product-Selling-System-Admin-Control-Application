const bannersEndpoint = "/api/v1/admin/banners";
const popupsEndpoint = "/api/v1/admin/popups";

const marketingApi = {
  // Banners
  bannersCacheKey: "adminBanners",
  listBanners: {
    endpoint: bannersEndpoint,
    path: "",
    method: "get",
  },
  createBanner: {
    endpoint: bannersEndpoint,
    path: "",
    method: "post",
  },
  updateBanner: (id) => ({
    endpoint: bannersEndpoint,
    path: `/${id}`,
    method: "put",
  }),
  deleteBanner: (id) => ({
    endpoint: bannersEndpoint,
    path: `/${id}`,
    method: "delete",
  }),

  // Popups
  popupsCacheKey: "adminPopups",
  listPopups: {
    endpoint: popupsEndpoint,
    path: "",
    method: "get",
  },
  createPopup: {
    endpoint: popupsEndpoint,
    path: "",
    method: "post",
  },
  updatePopup: (id) => ({
    endpoint: popupsEndpoint,
    path: `/${id}`,
    method: "put",
  }),
  deletePopup: (id) => ({
    endpoint: popupsEndpoint,
    path: `/${id}`,
    method: "delete",
  }),
};

export default marketingApi;
