import React, { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import FormPopup from "./pop-up/PopUpForm";
import { getUser } from "../utils/user/userData";
import { Button, Flex } from "@radix-ui/themes";
import { Me } from "../lib/type";
import { isRecent } from "../utils/isRecent2Day";

interface KycVerificationProps {
  openBusinessKycVerification: boolean;
  setOpenBusinessKycVerification: React.Dispatch<React.SetStateAction<boolean>>;
  openAdminKycVerification: boolean;
  setOpenAdminKycVerification: React.Dispatch<React.SetStateAction<boolean>>;
  user: Me;
  kycReviewReason?: string;
}

const KycVerification: React.FC<KycVerificationProps> = ({
  openBusinessKycVerification,
  setOpenBusinessKycVerification,
  openAdminKycVerification,
  setOpenAdminKycVerification,
  user,
}) => {
  const [successKycVisible, setsuccessKycVisible] = useState(true);
  const userData = getUser();
  const handleSubmit = () => {
    if (user?.role === "business") {
      setOpenBusinessKycVerification(true);
    }
    if (user?.role === "admin") {
      setOpenAdminKycVerification(true);
    }
  };
  return (
    <>
      {openBusinessKycVerification && (
        <FormPopup
          setOpen={setOpenBusinessKycVerification}
          title="KYC Verification"
          method="POST"
          endPoint="business-auth/upload-certificate-of-incorporation"
          fields={[
            { name: "email", label: "", type: "hidden", required: true },
            {
              name: "certificateOfIncorporation",
              label: "Certificate of Corporation",
              type: "file",
              required: true,
            },
          ]}
          defaultValues={{ email: user?.email }}
        />
      )}

      {openAdminKycVerification && (
        <FormPopup
          setOpen={setOpenAdminKycVerification}
          title="KYC Verification"
          method="POST"
          endPoint="admin-auth/upload-kyc"
          fields={[
            { name: "email", label: "", type: "hidden", required: true },
            {
              name: "certificateOfIncorporation",
              label: (user?.userType === "corporate") ? "Certificate of Corporation" : '',
              type: (user?.userType === "corporate") ? "file" : 'hidden',
              required: (user?.userType === "corporate") ? true : false,
            },
            {
              name: "individualValidMeansOfId",
              label: (user?.userType === "individual") ? "Individual ID" : '',
              type: (user?.userType === "individual") ? "file" : 'hidden',
              required: (user?.userType === "individual") ? true : false,
            },
          ]}
          defaultValues={{ email: user?.email }}
        />
      )}

      {user?.kycStatus === "not-submitted" && (
        <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no bg-red-50 border border-red-500 text-white px-5 py-3 rounded-md mb-4">
          <div className="text-md font-bold text-black">
            Upload your certificate for <span className="text-red-500">KYC verification</span>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-red-200 text-red-500 rounded-md mt-5 md:mt-0 px-5 py-1 h-8 text-sm hover:border hover:border-white hover:cursor-pointer"
          >
            <UploadCloud size={14} className="inline" />
            <span className="ml-1 font-bold">Verify KYC</span>
          </button>
        </div>
      )}

      {user?.kycStatus === "pending" && (
        <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no bg-blue-50 border border-blue-600 text-white px-5 py-5 rounded-lg mb-4">
          <div className="text-md font-bold text-black">
            Your <span className="text-blue-600">KYC</span> has been submitted and is under review
          </div>
        </div>
      )}

      {user?.kycStatus === "rejected" && (
        <Flex
          direction={{ initial: "column", md: "row" }}
          justify="between"
          gap="2"
          align="center"
          className="bg-red-50 border border-red-500 rounded-lg p-3"
        >
          <div className="md:mt-0 md:flex flex-col w-full text-red-500  hover:opacity-90 rounded-md">
            <div className="text-md font-bold text-black">Your <span className="text-red-500">KYC</span>  has been Rejected</div>
            <div className="text-md p-2 mr-auto rounded-md text-red-500">
              {" "}
              {userData?.kycReviewReason}
            </div>
          </div>
          <Button color="red" variant="soft" className="hover:cursor-pointer" onClick={handleSubmit}>
            Upload documents
          </Button>
        </Flex>
      )}

      {user?.kycStatus === "approved" && isRecent(user?.updatedAt) &&
        (localStorage.getItem("successKwcVisible") === "true" &&
        successKycVisible === true ? (
          <Flex
            direction={{ initial: "column", md: "row" }}
            justify="between"
            gap="2"
            align="start"
            className="border bg-[#f5fef8] border-green-500 rounded-lg p-3"
          >
            <div className="md:mt-0 md:flex flex-col w-full text-green-500  hover:opacity-90 rounded-md">
              <div className="text-md font-bold text-black">
                Your <span className="text-green-500">KYC</span> has been Successfully validated
              </div>
            </div>
            <Button
              variant="soft"
              onClick={() => {
                setsuccessKycVisible(false);
                localStorage.setItem("successKwcVisible", "false");
              }}
            >
              <Flex align="center" gap="1">
                <X />
              </Flex>
            </Button>
          </Flex>
        ) : (
          <p></p>
        ))}
    </>
  );
};

export default KycVerification;
