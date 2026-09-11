import AdminLayout from "@/components/layout/AdminLayout";
import usePageTitle from "@/hooks/usePageTitle";
import { getCookie } from "@/lib/cookies";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isLoggedIn = getCookie("signedIn") === "true";
  usePageTitle();

  return !isLoggedIn ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export function PublicRoute() {
  const isLoggedIn = getCookie("signedIn") === "true";
  usePageTitle();

  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
}
