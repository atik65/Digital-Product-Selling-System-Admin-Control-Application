import useModalStore from "./store";

/**
 * EasyModal - Simple modal management across the application
 * Import and use these functions to control modals globally
 *
 * @example
 * import { openModal } from '@/lib/easyModal';
 * openModal('documentType', { editData: null });
 */

export const openModal = (modalKey, props) =>
  useModalStore.getState().openModal(modalKey, props);

export const closeModal = (modalId) =>
  useModalStore.getState().closeModal(modalId);

export const updateModalProps = (modalId, newProps) =>
  useModalStore.getState().updateModalProps(modalId, newProps);

// Re-export renderer for convenience
export { default as ModalRenderer } from "./ModalRenderer";
