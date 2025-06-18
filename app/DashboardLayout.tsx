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
      <div className="fixed z-10 top-0 h-screen py-5  max-w-[300px]">
        <SideBar />
      </div>
      <div className="lg:ml-64 flex-1">
        <Topbar />
        <div className="px-5 md:px-0 md:pl-5 py-5">{children}</div>
      </div>
    </div>
  );
}
