import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useRequest from "@/hooks/useRequest";
import orderApi from "../api";
import { Loader2, MessageSquare } from "lucide-react";

const AdminNoteModal = ({ open, onClose, order }) => {
  const [note, setNote] = useState("");
  const { mutateAsync, isPending } = useRequest();

  useEffect(() => {
    setNote(order?.admin_note || "");
  }, [order]);

  const handleSubmit = async () => {
    if (!order?.id) return;

    try {
      await mutateAsync({
        id: order.id,
        data: { admin_note: note },
        api: orderApi.updateNote(order.id),
        cacheKey: orderApi.cacheKey,
        handleDone: () => {
          onClose();
        },
      });
    } catch (err) {
      console.error("Order note update error:", err);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Internal Fulfillment Note
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-mono">
                {order.order_number}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            Fulfillment Notes & Proof Details
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="e.g., Diamonds sent to UID 1829384920 via UniPin API at 14:35. Screenshot saved."
          />
          <p className="text-[11px] text-slate-400">
            Visible only to administrators for order tracking and audit purposes.
          </p>
        </div>

        <DialogFooter className="flex-row gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-10 font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <span>Save Note</span>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="text-xs h-10 font-semibold"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminNoteModal;
