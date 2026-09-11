import { User, LogOut, KeyRound } from "lucide-react";
import { Button } from "../ui/button";
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

export const UserNav = ({ userProfile, onLogout }) => {
  const navigate = useNavigate();

  const getInitials = () => {
    if (userProfile?.name) {
      const parts = userProfile.name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (userProfile?.first_name) {
      const firstInitial = userProfile.first_name.charAt(0).toUpperCase();
      const lastInitial = userProfile.last_name
        ? userProfile.last_name.charAt(0).toUpperCase()
        : "";
      return `${firstInitial}${lastInitial}`;
    }
    if (userProfile?.username) {
      return userProfile.username.slice(0, 2).toUpperCase();
    }
    return "AD";
  };

  const getUserName = () => {
    if (userProfile?.name) return userProfile.name;
    if (userProfile?.first_name) {
      return `${userProfile.first_name} ${userProfile.last_name || ""}`.trim();
    }
    if (userProfile?.username) return userProfile.username;
    return "Admin";
  };

  const avatarSrc = userProfile?.image || userProfile?.avatar?.path;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <Avatar className="h-9 w-9 border-2 border-white/20">
            <AvatarImage src={avatarSrc} alt={getUserName()} />
            <AvatarFallback className="bg-white/20 text-sm font-semibold text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={avatarSrc}
                alt={getUserName()}
              />
              <AvatarFallback className="bg-[#0f6b47]/10 text-sm font-semibold text-[#0f6b47]">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{getUserName()}</p>
              <p className="text-xs text-muted-foreground">
                {userProfile?.email || ""}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/profile/change-password")}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
