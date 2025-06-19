import { useUser } from "@/app/hooks/useUser";
import BusinessCard from "@/app/pages/user/business/components/BusinessCard";
import { UsersRound } from "lucide-react";
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import FormPopup from "../pop-up/PopUpForm";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";

const SuperAdminDashboard = () => {
  const [openKycVerification, setOpenKycVerification] = useState(false);
  const user = useUser();

  if (!user) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      {openKycVerification && (
        <FormPopup
          setOpen={setOpenKycVerification}
          title="KYC Verification"
          method={"POST"}
          endPoint="business-auth/upload-certificate-of-incorporation"
          fields={[
            { name: "email", label: "", type: "hidden", required: true },
            {
              name: "certificateOfIncorporation",
              label: "Certificate of Incorporation",
              type: "file",
              required: true,
            },
          ]}
          defaultValues={{ email: user?.email }}
        />
      )}
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

export default SuperAdminDashboard;
