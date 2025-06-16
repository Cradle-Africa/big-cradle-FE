"use client";
import { useState } from "react";
import DashboardCharts from "./components/charts/DashboardCharts";

import { UsersRound, CheckSquare, Banknote, UploadCloud } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import FormPopup from "@/app/components/pop-up/PopUpForm";
import { useUser } from "./hooks/useUser";
import DashboardSkeleton from "./components/skeleton/Dashboardskeleton";
import Dashboard from "./components/dashboard/Dashboard";

export default function Home() {
  const user = useUser();
  
  if (!user) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Dashboard/>
    </DashboardLayout>
  );
}
