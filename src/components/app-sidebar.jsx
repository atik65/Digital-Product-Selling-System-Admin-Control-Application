"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  ShoppingBag,
  CheckCircle2,
  CreditCard,
  MessageSquare,
  Coins,
  Users,
  Tag,
  Sparkles,
  Megaphone,
  Settings2,
  Layout,
  Store,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { AppSidebarHeader } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const navConfig = {
  intro: {
    title: "BoostGhor Admin",
    logo: Store,
  },
  user: {
    name: "System Admin",
    email: "admin@example.com",
    avatar: "",
  },
  core: [
    {
      title: "Overview",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
  ],
  catalog: [
    {
      title: "Products Catalog",
      url: "/products",
      icon: Layers,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: FolderTree,
    },
  ],
  sales: [
    {
      title: "Orders Fulfillment",
      url: "/orders",
      icon: ShoppingBag,
    },
    {
      title: "Payment Verification",
      url: "/payments",
      icon: CheckCircle2,
    },
    {
      title: "Payment Gateways",
      url: "/payment-methods",
      icon: CreditCard,
    },
    {
      title: "SMS Device Logs",
      url: "/sms-logs",
      icon: MessageSquare,
    },
    {
      title: "Wallet Top-Ups",
      url: "/wallet-topups",
      icon: Coins,
    },
  ],
  marketing: [
    {
      title: "Customer Directory",
      url: "/users",
      icon: Users,
    },
    {
      title: "Discount Coupons",
      url: "/coupons",
      icon: Tag,
    },
    {
      title: "Lucky Spin Lotteries",
      url: "/lottery",
      icon: Sparkles,
    },
    {
      title: "Marketing CMS",
      url: "/marketing",
      icon: Megaphone,
    },
  ],
  system: [
    {
      title: "Site Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Demo Starter View",
      url: "/demo",
      icon: Layout,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar className="border-none" collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#0f6b47] text-white">
        <AppSidebarHeader intro={navConfig.intro} />
      </SidebarHeader>

      <SidebarContent className="border-r">
        <NavMain groupLabel="Analytics" items={navConfig.core} />
        <NavMain groupLabel="Store Catalog" items={navConfig.catalog} />
        <NavMain groupLabel="Sales & Finances" items={navConfig.sales} />
        <NavMain groupLabel="Customers & Marketing" items={navConfig.marketing} />
        <NavMain groupLabel="System" items={navConfig.system} />
      </SidebarContent>

      <SidebarFooter className="border-r">
        <NavUser user={navConfig.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
