import axios from "@/app/lib/axios";
import { DashboardMenu } from "@/app/lib/type";
import BusinessCard from "@/app/pages/user/business/_components/BusinessCard";
import { useFetchMe } from "@/app/shared/_features/hooks";
import { ArrowDownUp, Database, Scan, UsersRound } from "lucide-react";
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import KycVerification from "../KycVerification";

const EmployeeDashboard = () => {
  const [openBusinessKycVerification, setOpenBusinessKycVerification] =
    useState(false);
  const [openAdminKycVerification, setOpenAdminKycVerification] =
    useState(false);

  const { data: user, isLoading } = useFetchMe({ axios });

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

      {/* <div className="w-full">
        <p className="font-semibold text-md space-y-1">
          Hi Esther employee, here’s your platform overview for today
        </p>
        <p className="text-sm">
          All systems operational. Last sync: 10 mins ago
        </p>
      </div> */}
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
    value: "10",
    icon: <ArrowDownUp />,
  },
  {
    title: "Data points",
    subTitle: "Total data points",
    value: "50",
    icon: <Database />,
  },
  {
    title: "Surveys",
    subTitle: "Total survey",
    value: "30",
    icon: <Scan />,
  },
];

export default EmployeeDashboard;
