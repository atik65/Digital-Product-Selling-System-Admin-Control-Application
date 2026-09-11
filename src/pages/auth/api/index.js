const endpoint = "/api/admin/auth";

const authApi = {
  login: {
    endpoint,
    path: "/login",
    method: "post",
  },

  // register: {
  //   endpoint,
  //   path: "/register",
  //   method: "post",
  // },
  // forgotPassword: {
  //   endpoint,
  //   path: "/forgot-password",
  //   method: "post",
  // },
  // verifyOtp: {
  //   endpoint,
  //   path: "/verify-otp",
  //   method: "post",
  // },
  // resetPassword: {
  //   endpoint,
  //   path: "/reset-password",
  //   method: "post",
  // },
  // resendOtp: {
  //   endpoint,
  //   path: "/resend-otp",
  //   method: "post",
  // },
};

export default authApi;
