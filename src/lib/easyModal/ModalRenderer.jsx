import { Suspense } from "react";
import useModalStore from "./store";
import MODAL_REGISTRY from "./registry";

/**
 * Global modal renderer component
 * Renders all active modals from the modal store
 * Add this component once in App.jsx root
 */
const ModalRenderer = () => {
  const modals = useModalStore((state) => state.modals);
  const closeModal = useModalStore((state) => state.closeModal);

  return (
    <>
      {modals.map((modal) => {
        const ModalComponent = MODAL_REGISTRY[modal.key];

        if (!ModalComponent) {
          console.error(`Modal "${modal.key}" not found in registry`);
          return null;
        }

        return (
          <Suspense key={modal.id} fallback={null}>
            <ModalComponent
              {...modal.props}
              onClose={() => {
                modal.props.onClose?.();
                closeModal(modal.id);
              }}
            />
          </Suspense>
        );
      })}
    </>
  );
};

export default ModalRenderer;
