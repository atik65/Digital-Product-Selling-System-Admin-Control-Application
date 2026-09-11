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
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Tag,
  FileCode2,
  MessageSquare,
  DollarSign,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { formatDate, formatPrice, getStatusBadge } from "@/lib/formatters";
import { toast } from "sonner";

const OrderDetailDrawer = ({
  open,
  onClose,
  order,
  onUpdateStatus,
  onEditNote,
}) => {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!order) return null;

  const badge = getStatusBadge(order.status);
  const user = order.user;
  const items = order.items || [];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-xl overflow-y-auto px-4 pb-6 pt-2">
          {/* iOS Handle bar */}
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200 mb-4" />

          <DrawerHeader className="px-0 pb-3 pt-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <DrawerTitle className="text-base sm:text-lg font-bold font-mono text-slate-900">
                    {order.order_number}
                  </DrawerTitle>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.order_number, "order_no")}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {copiedKey === "order_no" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <DrawerDescription className="text-xs text-slate-500 mt-0.5">
                  Placed on {formatDate(order.created_at)}
                </DrawerDescription>
              </div>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border shrink-0",
                  badge.bg,
                  badge.text,
                  badge.border
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                {badge.label}
              </span>
            </div>
          </DrawerHeader>

          <div className="space-y-4 py-2">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-10 text-xs border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/70 rounded-xl"
                onClick={() => {
                  onClose();
                  onUpdateStatus(order);
                }}
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Change Status
              </Button>

              <Button
                variant="outline"
                className="h-10 text-xs border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl"
                onClick={() => {
                  onClose();
                  onEditNote(order);
                }}
              >
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Edit Fulfillment Note
              </Button>
            </div>

            {/* Customer Information */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-semibold border-b border-slate-200/60 pb-2">
                <User className="h-4 w-4 text-emerald-600" />
                <span>Customer Profile</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                <div>
                  <span className="text-[11px] text-slate-400 block">Name / Username</span>
                  <span className="font-semibold">{user?.name || user?.username || `User #${order.user_id}`}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Email</span>
                  <span className="font-medium truncate block">{user?.email || "-"}</span>
                </div>
                {user?.phone && (
                  <div>
                    <span className="text-[11px] text-slate-400 block">Phone</span>
                    <span>{user.phone}</span>
                  </div>
                )}
                {order.customer_note && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/40">
                    <span className="text-[11px] text-slate-400 block">Customer Request Note:</span>
                    <p className="italic text-slate-600">&quot;{order.customer_note}&quot;</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items & Dynamic Customer Input Values */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
                Order Items & Dynamic Inputs ({items.length})
              </span>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-xs text-slate-900">
                          {item.product_name}
                        </h4>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          Tier: {item.package_name} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-sm text-slate-900">
                        {formatPrice(item.total_price)}
                      </span>
                    </div>

                    {/* Dynamic Inputs Box */}
                    {item.input_values && Object.keys(item.input_values).length > 0 && (
                      <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-2.5 space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 flex items-center gap-1">
                          <FileCode2 className="h-3 w-3 text-amber-600" />
                          Customer Inputs for Fulfillment:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                          {Object.entries(item.input_values).map(([key, val]) => (
                            <div
                              key={key}
                              className="bg-white/90 p-1.5 rounded-lg border border-amber-200/50 flex items-center justify-between gap-1"
                            >
                              <span className="text-[11px] font-medium text-slate-500 font-mono">
                                {key}:
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900 select-all">
                                  {String(val)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(String(val), key)}
                                  className="text-slate-400 hover:text-slate-700"
                                >
                                  {copiedKey === key ? (
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
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount (Coupon):</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-emerald-700">{formatPrice(order.total_amount)}</span>
              </div>
            </div>

            {/* Admin Note Box */}
            {order.admin_note && (
              <div className="bg-blue-50/70 rounded-2xl p-3.5 border border-blue-100 text-xs text-blue-900">
                <span className="font-semibold block mb-1 text-blue-800 flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                  Internal Fulfillment Note:
                </span>
                <p className="leading-relaxed">{order.admin_note}</p>
              </div>
            )}
          </div>

          <DrawerFooter className="px-0 pt-4 flex-row gap-2">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 text-xs font-semibold"
              onClick={() => {
                onClose();
                onUpdateStatus(order);
              }}
            >
              Update Status
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 text-xs font-semibold"
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default OrderDetailDrawer;
