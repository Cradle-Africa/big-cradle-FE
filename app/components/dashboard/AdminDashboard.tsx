import { DashboardMenu } from "@/app/lib/type";
import axios from "@/app/lib/axios";
import BusinessCard from "@/app/pages/user/business/_components/BusinessCard";
import { ArrowDownUp, Database, Scan, UsersRound } from "lucide-react";
import DashboardCharts from "../charts/DashboardCharts";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";
import { useFetchMe } from "@/app/shared/_features/hooks";
import KycVerification from "../KycVerification";
import { useState } from "react";

const BusinessDashboard = () => {
  const [openBusinessKycVerification, setOpenBusinessKycVerification] =
    useState(false);
  const [openAdminKycVerification, setOpenAdminKycVerification] =
    useState(false);
  const { data: user, isLoading } = useFetchMe({ axios });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      {isLoading ? (
        <div>
          <p>Loading kwc verification... </p>
        </div>
      ) : (
        <KycVerification
          openBusinessKycVerification={openBusinessKycVerification}
          setOpenBusinessKycVerification={setOpenBusinessKycVerification}
          openAdminKycVerification={openAdminKycVerification}
          setOpenAdminKycVerification={setOpenAdminKycVerification}
          user={user?.data!}
        />
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {data.map((menu, index) => (
          <BusinessCard
            key={index}
            title={menu.title}
            subTitle={menu.subTitle}
            value={menu.value}
            icon={<UsersRound />}
            isHighLighted={index === 0}
          />
        ))}
      </div>
      <DashboardCharts />
    </div>
  );
};

const data: DashboardMenu[] = [
  {
    title: "Pipelines",
    subTitle: "Total pipelines",
    value: "0",
    icon: <ArrowDownUp />,
  },
  {
    title: "Data points",
    subTitle: "Total data points",
    value: "0",
    icon: <Database />,
  },
  {
    title: "Surveys",
    subTitle: "Total survey",
    value: "0",

    icon: <Scan />,
  },
];

export default BusinessDashboard;
