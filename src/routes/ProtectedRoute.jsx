import AdminLayout from "@/components/layout/AdminLayout";
import usePageTitle from "@/hooks/usePageTitle";
import { isAuthenticated } from "@/lib/cookies";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const loggedIn = isAuthenticated();
  usePageTitle();

  return loggedIn ? (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export function PublicRoute() {
  const loggedIn = isAuthenticated();
  usePageTitle();

  return loggedIn ? <Navigate to="/" replace /> : <Outlet />;
}

