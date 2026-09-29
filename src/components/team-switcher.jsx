"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "./common/Image";
import { Separator } from "@radix-ui/react-dropdown-menu";
import useApi from "@/hooks/useApi";
import settingsApi from "@/views/settings/api";
import { getImageUrl } from "@/lib/media";

export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebarHeader({ intro }) {
  const { data: settingsData } = useApi({
    api: settingsApi.get,
    cacheKey: settingsApi.cacheKey,
  });

  const settings = settingsData?.data;
  const title = settings?.site_name || intro?.title || "Digital Product Selling";
  const subtitle = settings?.site_title || intro?.subtitle || "Admin Console";
  const logoUrl = settings?.logo ? getImageUrl(settings.logo) : null;

  return (
    <div className="flex items-center gap-3 px-3 h-full w-full cursor-pointer hover:bg-white/10 transition-[width,height,padding] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
      <div className="h-10 w-10 shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 bg-white rounded-lg flex justify-center items-center overflow-hidden p-1 shadow-2xs border border-white/20">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={title}
            className="h-full w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.parentElement?.querySelector(".logo-fallback");
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <span
          className="logo-fallback text-[#0f6b47] font-bold text-sm items-center justify-center"
          style={{ display: logoUrl ? "none" : "flex" }}
        >
          {title?.slice(0, 2)?.toUpperCase() || "DP"}
        </span>
      </div>
      <div className="group-data-[collapsible=icon]:hidden grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-bold text-base text-white">
          {title}
        </span>
        <span className="truncate text-xs text-emerald-100/80">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
