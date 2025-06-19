import BusinessCard from "@/app/pages/user/business/components/BusinessCard";
import { getUser } from "@/app/utils/user/userData";
import { UsersRound } from "lucide-react";
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import KycVerification from "../KycVerification";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";

const BusinessDashboard = () => {
  const [openBusinessKycVerification, setOpenBusinessKycVerification] =
    useState(false);
  const [openAdminKycVerification, setOpenAdminKycVerification] =
    useState(false);
  const user = getUser();
  if (!user) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <KycVerification
        openBusinessKycVerification={openBusinessKycVerification}
        setOpenBusinessKycVerification={setOpenBusinessKycVerification}
        openAdminKycVerification={openAdminKycVerification}
        setOpenAdminKycVerification={setOpenAdminKycVerification}
        user={user}
      />

      <div className="w-full">
        <p className="font-semibold text-md space-y-1">
          Hi Esther, here’s your platform overview for today
        </p>
        <p className="text-sm">
          All systems operational. Last sync: 10 mins ago
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {[...Array(3)].map((_, index) => (
          <BusinessCard
            key={index}
            title="Active Campaigns"
            subTitle="Increase from last month"
            value="67"
            percentage="10.2%"
            icon={<UsersRound />}
            isHighLighted={index === 0}
          />
        ))}
      </div>
      <DashboardCharts />
    </div>
  );
};

export default BusinessDashboard;
