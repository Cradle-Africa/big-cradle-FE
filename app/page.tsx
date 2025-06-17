"use client";
import DashboardLayout from "./DashboardLayout";
import Dashboard from "./components/dashboard/Dashboard";
import DashboardSkeleton from "./components/skeleton/Dashboardskeleton";
import { useUser } from "./hooks/useUser";

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
      <Dashboard />
    </DashboardLayout>
  );
}
