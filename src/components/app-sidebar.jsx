"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { AppSidebarHeader, TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  intro: {
    title: "Admin Panel",
    logo: GalleryVerticalEnd,
  },
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme   Inc.",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Parent Menu",
      url: "#",
      icon: Frame,
      isActive: true,
      items: [
        {
          title: "Menu Item One",
          url: "#",
        },
        {
          title: "Menu Item Two",
          url: "#",
        },
        {
          title: "Menu Item Three",
          url: "#",
        },
        {
          title: "Menu Item Four",
          url: "#",
        },
      ],
    },
    {
      title: "Single Link One",
      url: "#",
      icon: Map,
    },
    {
      title: "Single Link Two",
      url: "#",
      icon: PieChart,
    },
    {
      title: "Single Link Three",
      url: "#",
      icon: Bot,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar className={"border-none "} collapsible="icon" {...props}>
      <SidebarHeader className={"bg-[#0f6b47] text-white "}>
        <AppSidebarHeader intro={data.intro} />
      </SidebarHeader>
      <SidebarContent className={"border-r "}>
        <NavMain groupLabel="Group One" items={data.navMain} />
        <NavMain groupLabel="Group Two" items={data.navMain} />
        <NavMain groupLabel="Group Three" items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter className={"border-r "}>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
