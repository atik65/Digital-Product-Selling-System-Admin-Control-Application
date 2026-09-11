import { lazy } from "react";

/**
 * Global modal registry
 * Register all app modals here for centralized management
 */
const MODAL_REGISTRY = {
  // Settings modals
  documentType: lazy(
    () =>
      // import("@/pages/settings/document-type/components/AddEdit")
      import("@/pages/demo/components/AddEdit"),
  ),

  // Add more modals as needed:
  // appointment: lazy(() => import('@/pages/appointments/components/AddEdit')),
  // user: lazy(() => import('@/pages/users/components/AddEdit')),
  // checkIn: lazy(() => import('@/pages/check-in/components/AddEdit')),
};

export default MODAL_REGISTRY;
