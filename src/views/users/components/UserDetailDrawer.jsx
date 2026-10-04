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
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Coins,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  CreditCard,
  Loader2,
} from "lucide-react";
import useApi from "@/hooks/useApi";
import userApi from "../api";
import { formatDate, formatPrice } from "@/lib/formatters";
import { getImageUrl } from "@/lib/media";

const UserDetailDrawer = ({
  open,
  onClose,
  user,
  onAdjustBalance,
  onOpenOrders,
  onOpenTopups,
}) => {
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
  const isActive = userData.is_active;

  const renderHeaderContent = (TitleComp, DescComp) => (
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-lg flex items-center justify-center overflow-hidden shrink-0">
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
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <TitleComp className="text-lg font-bold text-slate-900 truncate">
            {userData.name || userData.username}
          </TitleComp>
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
              isAdmin
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            )}
          >
            {isAdmin ? "Super Admin" : "Customer"}
          </span>
        </div>
        <DescComp className="text-xs text-slate-500 truncate mt-0.5">
          {userData.email}
        </DescComp>
      </div>
    </div>
  );

  const renderBodyContent = () => (
    <div className="space-y-4 text-xs">
      {/* Wallet Balance Card */}
      {userData.wallet && (
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-700 font-semibold block">
              Available Wallet Credits
            </span>
            <span className="text-xl font-extrabold text-emerald-800">
              {formatPrice(userData.wallet.balance)}
            </span>
          </div>
          <Button
            size="sm"
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold h-9"
            onClick={() => {
              onClose();
              onAdjustBalance(userData);
            }}
          >
            <Coins className="mr-1.5 h-3.5 w-3.5" />
            Adjust Balance
          </Button>
        </div>
      )}

      {/* Orders & Top-Ups Quick Jump */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenOrders && onOpenOrders(userData);
          }}
          className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 hover:bg-blue-100/70 transition-all text-left group cursor-pointer"
        >
          <div>
            <span className="text-[11px] text-blue-700 font-semibold block">
              Orders Placed
            </span>
            <span className="text-lg font-extrabold text-blue-950">
              {userData.total_orders ?? userData.orders?.length ?? 0}
            </span>
          </div>
          <div className="h-8 w-8 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-2xs">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenTopups && onOpenTopups(userData);
          }}
          className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 hover:bg-purple-100/70 transition-all text-left group cursor-pointer"
        >
          <div>
            <span className="text-[11px] text-purple-700 font-semibold block">
              Top-Up Requests
            </span>
            <span className="text-lg font-extrabold text-purple-950">
              {userData.topups?.length ?? 0}
            </span>
          </div>
          <div className="h-8 w-8 rounded-xl bg-white border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform shadow-2xs">
            <CreditCard className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* Profile Fields */}
      <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl bg-white overflow-hidden">
        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            Username
          </span>
          <span className="font-semibold text-slate-900 font-mono">
            @{userData.username}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            Email Address
          </span>
          <span className="font-medium text-slate-800 truncate max-w-[200px]">
            {userData.email}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" />
            Phone Number
          </span>
          <span className="font-mono text-slate-700">
            {userData.phone || "Not set"}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-400" />
            Account Status
          </span>
          <span className="flex items-center gap-1 font-medium">
            {isActive ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Active</span>
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
                <span className="text-rose-700">Suspended</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between p-3.5">
          <span className="text-slate-500 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            Member Since
          </span>
          <span className="text-slate-700">
            {formatDate(userData.created_at)}
          </span>
        </div>
      </div>
    </div>
  );

  const renderFooterButtons = (CloseComp) => (
    <>
      <Button
        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-11 text-xs font-semibold"
        onClick={() => {
          onClose();
          onAdjustBalance(userData);
        }}
      >
        <Coins className="mr-1.5 h-3.5 w-3.5" />
        Adjust Wallet Balance
      </Button>
      <CloseComp asChild>
        <Button
          variant="outline"
          className="flex-1 rounded-xl h-11 text-xs font-semibold"
        >
          Close
        </Button>
      </CloseComp>
    </>
  );

  // Desktop View: Sheet sliding in from the right sidebar
  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md md:max-w-lg p-0 gap-0 flex flex-col h-full bg-white border-l border-slate-200 shadow-2xl"
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
          <SheetFooter className="p-4 border-t border-slate-100 bg-slate-50/70 flex-row gap-2 flex-shrink-0 sm:justify-start">
            {renderFooterButtons(SheetClose)}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Mobile View: Bottom drawer
  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-4 pb-6 pt-2">
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
          <DrawerFooter className="px-0 pt-4 flex-row gap-2">
            {renderFooterButtons(DrawerClose)}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDetailDrawer;
