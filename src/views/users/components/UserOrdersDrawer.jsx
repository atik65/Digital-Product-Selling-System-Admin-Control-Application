import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@mantine/hooks";
import {
  ShoppingBag,
  Copy,
  Check,
  Package,
  Calendar,
  FileCode2,
  MessageSquare,
  Loader2,
  ReceiptText,
} from "lucide-react";
import useApi from "@/hooks/useApi";
import userApi from "../api";
import { formatDate, formatPrice, getStatusBadge } from "@/lib/formatters";
import { getImageUrl } from "@/lib/media";
import { toast } from "sonner";

const UserOrdersDrawer = ({ open, onClose, user }) => {
  const [copiedKey, setCopiedKey] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: detailData, isLoading } = useApi({
    api: user?.id ? userApi.show(user.id) : null,
    cacheKey: `userDetail-${user?.id}`,
    trigger: !!user?.id && open,
  });

  if (!user) return null;

  const userData = detailData?.data || user;
  const avatar = getImageUrl(userData.image);
  const isAdmin = userData.role === "admin";
  const orders = userData.orders || [];

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const totalSpent = userData.total_spent ?? orders.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  );

  const renderHeaderContent = (TitleComp, DescComp) => (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-12 w-12 rounded-full bg-blue-100 border border-blue-200 text-blue-800 font-bold text-base flex items-center justify-center overflow-hidden shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={userData.name || userData.username}
              className="h-full w-full object-cover"
            />
          ) : (
            (userData.name?.[0] || userData.username?.[0] || "U").toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <TitleComp className="text-lg font-bold text-slate-900 truncate">
              {userData.name || userData.username}&apos;s Orders
            </TitleComp>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0",
                isAdmin
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              )}
            >
              {isAdmin ? "Admin" : "Customer"}
            </span>
          </div>
          <DescComp className="text-xs text-slate-500 truncate mt-0.5">
            {userData.email}
          </DescComp>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 shrink-0">
        <ShoppingBag className="h-4 w-4" />
        <span className="text-xs font-bold">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"}
        </span>
      </div>
    </div>
  );

  const renderBodyContent = () => (
    <div className="space-y-4">
      {/* Metrics summary row */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Total Orders
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {userData.total_orders ?? orders.length}
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
            <Package className="h-4 w-4" />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-700 font-medium block">
              Total Spent
            </span>
            <span className="text-lg font-extrabold text-emerald-800">
              {formatPrice(totalSpent)}
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-white border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-2xs">
            <ReceiptText className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="space-y-3">
        {isLoading && !detailData ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading Customer Orders...</p>
            <p className="text-xs text-slate-400 mt-0.5">Fetching latest order history and line items</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-6">
            <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-3">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Orders Placed Yet</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              This user has not placed any digital product orders in the store yet.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const items = order.items || [];

            return (
              <div
                key={order.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs hover:border-blue-200 transition-all"
              >
                {/* Order top bar */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                      <span className="select-all">{order.order_number}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.order_number, `ord-${order.id}`)}
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                        title="Copy Order Number"
                      >
                        {copiedKey === `ord-${order.id}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border shrink-0",
                      badge.bg,
                      badge.text,
                      badge.border
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                    {badge.label}
                  </span>
                </div>

                {/* Customer Note if present */}
                {order.customer_note && (
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-900">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block mb-0.5">
                      Customer Request Note:
                    </span>
                    <p className="italic">&quot;{order.customer_note}&quot;</p>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-semibold text-xs text-slate-900">
                            {item.product_name}
                          </h5>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            {item.package_name} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-bold text-xs text-slate-900">
                          {formatPrice(item.total_price)}
                        </span>
                      </div>

                      {/* Customer Input values */}
                      {item.input_values &&
                        Object.keys(item.input_values).length > 0 && (
                          <div className="bg-white rounded-lg p-2.5 border border-slate-200/80 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                              <FileCode2 className="h-3 w-3 text-slate-400" />
                              Customer Inputs for Fulfillment:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                              {Object.entries(item.input_values).map(([k, v]) => (
                                <div
                                  key={k}
                                  className="flex items-center justify-between gap-1.5 bg-slate-50 px-2 py-1.5 rounded-md border border-slate-200/50 text-[11px]"
                                >
                                  <span className="text-slate-500 font-medium">{k}:</span>
                                  <div className="flex items-center gap-1 font-mono font-semibold text-slate-800 min-w-0">
                                    <span className="select-all truncate max-w-[150px]">
                                      {String(v)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopy(String(v), `${item.id}-${k}`)
                                      }
                                      className="text-slate-400 hover:text-slate-700 shrink-0"
                                      title="Copy value"
                                    >
                                      {copiedKey === `${item.id}-${k}` ? (
                                        <Check className="h-3 w-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Subtotal: {formatPrice(order.subtotal)}</span>
                    {order.discount > 0 && (
                      <span className="text-rose-600 font-medium">
                        Discount: -{formatPrice(order.discount)}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-slate-900">
                    Total:{" "}
                    <span className="text-emerald-700 text-sm font-extrabold">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Admin Fulfillment Note */}
                {order.admin_note && (
                  <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-2.5 text-xs text-blue-900">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 flex items-center gap-1 mb-0.5">
                      <MessageSquare className="h-3 w-3 text-blue-600" />
                      Internal Fulfillment Note:
                    </span>
                    <p className="leading-relaxed">{order.admin_note}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Desktop View: Sheet sliding in from the right sidebar
  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl lg:max-w-2xl p-0 gap-0 flex flex-col h-full bg-white border-l border-slate-200 shadow-2xl"
        >
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-slate-100 flex-shrink-0 pr-12 text-left">
            {renderHeaderContent(SheetTitle, SheetDescription)}
          </SheetHeader>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {renderBodyContent()}
          </div>

          {/* Footer */}
          <SheetFooter className="p-4 border-t border-slate-100 bg-slate-50/70 flex-shrink-0">
            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full rounded-xl h-11 text-xs font-semibold"
              >
                Close Orders
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Mobile View: Bottom drawer
  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto px-4 pb-6 pt-2">
          {/* iOS Handle bar */}
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200 mb-4" />

          {/* Header */}
          <DrawerHeader className="px-0 pb-3 pt-0 text-left">
            {renderHeaderContent(DrawerTitle, DrawerDescription)}
          </DrawerHeader>

          {/* Scrollable Body */}
          <div className="py-2">
            {renderBodyContent()}
          </div>

          {/* Footer */}
          <DrawerFooter className="px-0 pt-4">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full rounded-xl h-11 text-xs font-semibold"
              >
                Close Orders
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserOrdersDrawer;
