import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useRequest from "@/hooks/useRequest";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import TooltipControl from "./TooltipControl";

/**
 * ActionDialogDelete Component - Reusable delete confirmation dialog
 *
 * Displays a confirmation dialog before deleting an item and handles the delete operation
 * with automatic cache invalidation via useRequest hook.
 *
 * @param {Object} props
 * @param {Object} props.request - Request configuration object for useRequest
 * @param {string|number} props.request.id - REQUIRED: Item ID for cache invalidation
 * @param {Object} props.request.api - API endpoint configuration (from api/index.js)
 * @param {string} props.request.cacheKey - Cache key for automatic cache update
 * @param {React.ReactNode} props.trigger - Button/element that triggers the dialog
 * @param {string} props.name - Name of the item being deleted (displayed in dialog)
 *
 * @example
 * // Basic usage with delete button
 * <ActionDialogDelete
 *   name={row.name}
 *   request={{
 *     id: row.id,
 *     api: documentCategoryApi.delete(row.id),
 *     cacheKey: documentCategoryApi.cacheKey,
 *   }}
 *   trigger={
 *     <Button variant="ghost" size="icon">
 *       <Trash2 className="h-4 w-4" />
 *     </Button>
 *   }
 * />
 *
 * IMPORTANT: Always include the `id` field in the request object.
 * Without it, the deleted item will not be removed from the cache/UI.
 */
const ActionDialogDelete = ({ request, trigger, name }) => {
  const closeRef = useRef(null);

  return (
    <AlertDialog>
      <TooltipControl title="Delete" side="top">
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      </TooltipControl>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to Delete {name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={closeRef}>Cancel</AlertDialogCancel>
          <ActionDeleteRequest
            request={request}
            onclose={() => closeRef.current.click()}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ActionDeleteRequest = ({ request, onclose }) => {
  const { isPending, mutateAsync } = useRequest();

  async function handleDelete() {
    try {
      await mutateAsync(request);
      onclose();
    } catch (error) {}
  }
  return (
    <Button disabled={isPending} onClick={handleDelete} variant="destructive">
      {isPending ? (
        <LoaderCircle className="mr-2 w-7 h-7 animate-spin" />
      ) : (
        "Delete"
      )}
    </Button>
  );
};
export default ActionDialogDelete;
