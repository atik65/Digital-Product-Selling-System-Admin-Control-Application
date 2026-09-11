import {
  Bell,
  Maximize2,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  KeyRound,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import logout from "@/lib/logout";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserNav } from "./UserNav";

export const SettingsNav = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/settings/document-type")}
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Document Types</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/settings/staffs")}
        >
          <Users className="mr-2 h-4 w-4" />
          <span>Staff Members</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = ({ userProfile }) => {
  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-[#0f6b47] text-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-0">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">Admin Dashboard</p>
            <p className="text-sm text-white/80">Bangladesh High Commission</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
          </Button> */}
          <SettingsNav />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={handleToggleFullscreen}
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
          <UserNav userProfile={userProfile} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;
