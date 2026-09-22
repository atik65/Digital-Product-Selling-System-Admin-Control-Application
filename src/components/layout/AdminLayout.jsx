import React from "react";
import { Link, useLocation } from "react-router-dom";
import useProfile from "@/hooks/useProfile";
import { getBreadcrumbs } from "@/lib/breadcrumbs";

import Navbar from "./Navbar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "../ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ThemeToggle } from "../theme/theme-toggle";
import { Button } from "../ui/button";
import { Maximize2 } from "lucide-react";
import logout from "@/lib/logout";
import FullScreenControl from "../common/FullScreenControl";
import { UserNav } from "./UserNav";

const AdminLayout = ({ children }) => {
  // const { userProfile, isLoadingProfile } = useProfile();
  // console.log("Profile from useProfile:", { userProfile, isLoadingProfile });

  // return (
  //   <div>
  //     <div className="sticky top-0 z-50">
  //       <Header userProfile={userProfile} />
  //       <Navbar />
  //     </div>
  //     <main className="px-4 py-8 lg:px-0">
  //       <div className="mx-auto w-full max-w-7xl">{children}</div>
  //     </main>
  //   </div>
  // );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 bg-[#0f6b47] text-white z-50 border-b border-[#0b5336] flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
          <LayoutHeader />
        </header>

        <main className="p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;

const LayoutHeader = () => {
  const { userProfile, isLoadingProfile } = useProfile();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="flex items-center justify-between h-full gap-2 px-4 text-white w-full">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hover:bg-white/20 hover:text-white" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 bg-white/20"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.href || index}>
                  <BreadcrumbItem className={!isLast ? "hidden md:inline-flex" : ""}>
                    {isLast ? (
                      <BreadcrumbPage className="text-white font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        asChild
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="hidden md:inline-flex text-white/40" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* theme toggle or profile avatar will be placed */}
      <div className="flex h-full items-center gap-3">
        {/* <ThemeToggle /> */}

        {/* full screen control */}
        <FullScreenControl />

        {/* user nav */}
        <UserNav userProfile={userProfile} onLogout={handleLogout} />
      </div>
    </div>
  );
};
