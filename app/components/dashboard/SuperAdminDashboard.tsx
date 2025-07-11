import { useUser } from "@/app/hooks/useUser";
import BusinessCard from "@/app/pages/user/business/_components/BusinessCard";
import { ArrowDownUp, Database, Scan, UsersRound } from "lucide-react";
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import FormPopup from "../pop-up/PopUpForm";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";
import { DashboardMenu } from "@/app/lib/type";

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
     <div className="w-full mt-2">
        <p className="font-semibold text-md space-y-1">
          Hi{" "}
          {user?.contactPersonFirstName ?? user?.firstName ?? user?.fullName ?? ""},{" "}
          here’s your platform overview for today
        </p>

        <p className="text-sm">
          All systems operational. Last sync: 10 mins ago
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {data.map((menu, index) => (
          <BusinessCard
            key={index}
            title={menu.title}
            subTitle={menu.subTitle }
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

const data: DashboardMenu[]=[ 
  {
    title: 'Pipelines',
    subTitle: 'Total pipelines',
    value: '0',
    icon: <ArrowDownUp />,    
  },
  {
    title: 'Data points',
    subTitle: 'Total data points',
    value: '0',
    icon: <Database/>,    
  },
  {
    title: 'Surveys',
    subTitle: 'Total survey',
    value: '0',
    icon: <Scan/>,    
  }
]

export default SuperAdminDashboard;
