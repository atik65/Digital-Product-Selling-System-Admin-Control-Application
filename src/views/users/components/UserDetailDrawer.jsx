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
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Coins,
  CheckCircle2,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import useApi from "@/hooks/useApi";
import userApi from "../api";
import { formatDate, formatPrice } from "@/lib/formatters";
import { getImageUrl } from "@/lib/media";

const UserDetailDrawer = ({ open, onClose, user, onAdjustBalance }) => {
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

  return (
    <Drawer open={open} onOpenChange={(val) => !val && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-4 pb-6 pt-2">
          {/* iOS Handle bar */}
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200 mb-4" />

          <DrawerHeader className="px-0 pb-3 pt-0">
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
                  <DrawerTitle className="text-lg font-bold text-slate-900 truncate">
                    {userData.name || userData.username}
                  </DrawerTitle>
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
                <DrawerDescription className="text-xs text-slate-500 truncate mt-0.5">
                  {userData.email}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Wallet Balance Card (if customer) */}
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

          <DrawerFooter className="px-0 pt-4 flex-row gap-2">
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

export default UserDetailDrawer;
