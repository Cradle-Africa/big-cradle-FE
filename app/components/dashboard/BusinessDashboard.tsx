import React, { useEffect, useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import { UploadCloud, UsersRound, Banknote, CheckSquare } from "lucide-react";
import FormPopup from "../pop-up/PopUpForm";
import { getUser } from "@/app/utils/user/userData";
import { User } from "@/app/pages/user/types/User";

const BusinessDashboard = () => {
  const [openKycVerification, setOpenKycVerification] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = getUser(); // make sure this returns a promise if async
      setUser(currentUser);
    };

    fetchUser();
  }, []);

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

      {user?.kycStatus === "not-submitted" && (
        <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no bg-red-400 text-white px-5 py-3 rounded-md mb-4">
          <div className="text-sm">
            Upload your certificate for KYC verification
          </div>
          <button
            onClick={() => {
              setOpenKycVerification(true);
            }}
            className=" bg-red-700 text-white rounded-md mt-5 md:mt-0 px-5 py-1 h-8 text-sm hover:border hover:border-white hover:cursor-pointer"
          >
            <UploadCloud size={14} className="inline" />
            <span className="ml-1">Verify KYC</span>
          </button>
        </div>
      )}
      {user?.kycStatus == "pending" && (
        <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no text-white bg-gradient-to-br from-[#578CFF] to-[#0546D2] hover:opacity-90 px-5 py-3 rounded-md mb-4">
          <div className="text-sm">
            Your KYC has been submitted and is under review
          </div>
        </div>
      )}

      {user?.kycStatus == "rejected" && (
        <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no text-white bg-gradient-to-br from-[#ff5762] to-[#d20505] hover:opacity-90 px-5 py-3 rounded-md mb-4">
          <div className="text-sm">Your KYC has been Rejected</div>
        </div>
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
        <div className="border border-[#F7F7F7] bg-white py-2 px-3 rounded-md">
          <h3 className="flex gap-1 items-center text-sm mb-2">
            <UsersRound size={13} />
            Total Users
          </h3>
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <p>1,2340</p>
            <div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">
              10.2%
            </div>
          </div>
          <p className="text-xs">Registered accross all roles</p>
        </div>

        <div className="border border-[#F7F7F7] bg-white py-2 px-3 rounded-md ">
          <h3 className="flex gap-1 items-center text-sm mb-2">
            <Banknote size={13} /> Revenue (This Month)
          </h3>
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <p>₦1,845,200</p>
            <div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">
              10.2%
            </div>
          </div>
          <p className="text-xs">Total from active campaigns</p>
        </div>

        <div className="border border-[#F7F7F7] bg-white py-2 px-3 rounded-md">
          <h3 className="flex gap-1 items-center text-sm mb-2">
            <CheckSquare size={13} /> <div className="hidden md:inline"></div>
            Task completion time
          </h3>
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
            <p>3m 42s</p>
            <div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">
              10.2%
            </div>
          </div>
          <p className="text-xs">Across mobile & QR responses</p>
        </div>
      </div>
      <DashboardCharts />
    </div>
  );
};

export default BusinessDashboard;
