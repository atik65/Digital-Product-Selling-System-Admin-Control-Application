import Login from "@/views/auth/login/Login";
import Overview from "@/views/overview/Overview";
import ChangePassword from "@/views/profile/ChangePassword";
import Profile from "@/views/profile/Profile";
import UpdateProfile from "@/views/profile/UpdateProfile";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute, { PublicRoute } from "./ProtectedRoute";
import DemoList from "@/views/demo/DemoList";
import Signup from "@/views/auth/signup/Signup";
import ForgotPassword from "@/views/auth/forgot-password/ForgotPassword";
import VerifyOtp from "@/views/auth/verify-otp/VerifyOtp";
import ResetPassword from "@/views/auth/reset-password/ResetPassword";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      // { path: "/", element: <Overview /> },
      { path: "/", element: <DemoList /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profile/update", element: <UpdateProfile /> },
      { path: "/profile/change-password", element: <ChangePassword /> },

      {
        path: "/settings",
        children: [],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-otp", element: <VerifyOtp /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
]);
