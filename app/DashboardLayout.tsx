// app/components/layouts/DashboardLayout.tsx
"use client";

import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { ReactNode } from "react";
import SideBar from "./components/sidebar/SideBar";
import Topbar from "./components/Topbar";

export default function SuperAdminSidebar({
  children,
}: {
  children: ReactNode;
}) {
  useAuthGuard();

  return (
    <div className="flex w-full lg:px-5 max-h-screen ">
      <div className="absolute lg:fixed z-10 top-0 lg:h-screen py-5 lg:max-w-[300px]">
        <SideBar />
      </div>
      <div className="w-full lg:ml-64 flex-1">
        <Topbar />
        <div className="px-5 lg:px-0 lg:pl-5 lg:pr-0 py-5">{children}</div>
      </div>
    </div>
  );
}
