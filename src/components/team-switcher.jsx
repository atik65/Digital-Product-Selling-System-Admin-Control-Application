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
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          size="default"
          isActive={false}
          className=" data-[state=open]:bg-white/10 data-[state=open]:text-sidebar-accent-foreground hover:bg-white/10  hover:text-white border-b border-[#363D49] p-2 rounded-none   h-16 flex gap-3 items-center transition-[width,height,padding] cursor-pointer"
        >
          {/* <div className="bg-white/10 flex aspect-square size-8 items-center justify-center rounded-md"> */}
          {/* <intro.logo className="size-4 " /> */}
          {/* <Image src={"/logo.png"} /> */}
          <div
            className=" h-11 w-11 group-data-[collapsible=icon]:w-8
          group-data-[collapsible=icon]:h-8  bg-[#8552FD] rounded-md flex justify-around items-center text-white font-bold "
          >
            MP
          </div>
          {/* </div> */}
          <div className="group-data-[collapsible=icon]:hidden grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-base mb-1">
              {intro?.title}
            </span>
            <span className="truncate text-xs text-[#9CA3AF]">
              {intro.subtitle}
            </span>
          </div>
          {/* <ChevronsUpDown className="ml-auto" /> */}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
