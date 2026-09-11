import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute, { PublicRoute } from "./ProtectedRoute";

// Auth
import Login from "@/views/auth/login/Login";
import Signup from "@/views/auth/signup/Signup";
import ForgotPassword from "@/views/auth/forgot-password/ForgotPassword";
import VerifyOtp from "@/views/auth/verify-otp/VerifyOtp";
import ResetPassword from "@/views/auth/reset-password/ResetPassword";

// Core Overview
import Overview from "@/views/overview/Overview";

// Catalog
import CategoriesList from "@/views/categories/CategoriesList";
import ProductsList from "@/views/products/ProductsList";

// Orders
import OrdersList from "@/views/orders/OrdersList";

// Payments & Finances
import PaymentVerificationList from "@/views/payments/verification/PaymentVerificationList";
import PaymentMethodsList from "@/views/payments/methods/PaymentMethodsList";
import SmsLogsList from "@/views/payments/sms-logs/SmsLogsList";
import TopUpsList from "@/views/wallet/TopUpsList";

// Users & Growth
import UsersList from "@/views/users/UsersList";
import CouponsList from "@/views/coupons/CouponsList";
import LotteriesList from "@/views/lottery/LotteriesList";
import MarketingHub from "@/views/marketing/MarketingHub";

// Settings & Profile
import Settings from "@/views/settings/Settings";
import Profile from "@/views/profile/Profile";
import UpdateProfile from "@/views/profile/UpdateProfile";
import ChangePassword from "@/views/profile/ChangePassword";

// Demo Reference
import DemoList from "@/views/demo/DemoList";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <Overview /> },
      { path: "/overview", element: <Overview /> },

      // Catalog
      { path: "/categories", element: <CategoriesList /> },
      { path: "/products", element: <ProductsList /> },

      // Orders
      { path: "/orders", element: <OrdersList /> },

      // Payments & Finances
      { path: "/payments", element: <PaymentVerificationList /> },
      { path: "/payment-methods", element: <PaymentMethodsList /> },
      { path: "/sms-logs", element: <SmsLogsList /> },
      { path: "/wallet-topups", element: <TopUpsList /> },

      // Users & Growth
      { path: "/users", element: <UsersList /> },
      { path: "/coupons", element: <CouponsList /> },
      { path: "/lottery", element: <LotteriesList /> },
      { path: "/marketing", element: <MarketingHub /> },

      // System Settings & Profile
      { path: "/settings", element: <Settings /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profile/update", element: <UpdateProfile /> },
      { path: "/profile/change-password", element: <ChangePassword /> },

      // Demo Template Reference
      { path: "/demo", element: <DemoList /> },
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

export default router;
