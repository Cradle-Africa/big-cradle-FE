"use client";
import DashboardLayout from "./DashboardLayout";
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
