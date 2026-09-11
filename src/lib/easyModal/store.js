import { create } from "zustand";

const ANIMATION_DURATION = 300; // ms for Sheet close animation

/**
 * Zustand store for modal state management
 */
const useModalStore = create((set) => ({
  modals: [],

  openModal: (modalKey, props = {}) => {
    const modalId = `${modalKey}-${Date.now()}`;

    set((state) => ({
      modals: [
        ...state.modals,
        {
          id: modalId,
          key: modalKey,
          props: {
            ...props,
            open: true,
          },
        },
      ],
    }));

    return modalId;
  },

  closeModal: (modalId) => {
    // Trigger close animation first
    set((state) => ({
      modals: state.modals.map((modal) =>
        modal.id === modalId
          ? { ...modal, props: { ...modal.props, open: false } }
          : modal
      ),
    }));

    // Remove from DOM after animation completes
    setTimeout(() => {
      set((state) => ({
        modals: state.modals.filter((modal) => modal.id !== modalId),
      }));
    }, ANIMATION_DURATION);
  },

  updateModalProps: (modalId, newProps) => {
    set((state) => ({
      modals: state.modals.map((modal) =>
        modal.id === modalId
          ? { ...modal, props: { ...modal.props, ...newProps } }
          : modal
      ),
    }));
  },
}));

export default useModalStore;
