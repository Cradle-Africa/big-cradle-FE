import React, { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import FormPopup from "./pop-up/PopUpForm";
import { getUser } from "../utils/user/userData";
import { Button, Flex } from "@radix-ui/themes";
import { Me } from "../lib/type";

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
              label: "Certificate of Incorporation",
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
              label: "Certificate of Incorporation",
              type: "file",
              required: true,
            },
            {
              name: "individualValidMeansOfId",
              label: "Individual ID",
              type: "file",
              required: true,
            },
          ]}
          defaultValues={{ email: user?.email }}
        />
      )}

      {user?.kycStatus === "not-submitted" && (
        <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no bg-red-400 text-white px-5 py-3 rounded-md mb-4">
          <div className="text-md">
            Upload your certificate for KYC verification
          </div>
          <button
            onClick={handleSubmit}
            className="bg-red-700 text-white rounded-md mt-5 md:mt-0 px-5 py-1 h-8 text-sm hover:border hover:border-white hover:cursor-pointer"
          >
            <UploadCloud size={14} className="inline" />
            <span className="ml-1">Verify KYC</span>
          </button>
        </div>
      )}

      {user?.kycStatus === "pending" && (
        <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no bg-blue-600 text-white px-5 py-3 rounded-md mb-4">
          <div className="text-md">
            Your KYC has been submitted and is under review
          </div>
        </div>
      )}

      {user?.kycStatus === "rejected" && (
        <Flex
          direction={{ initial: "column", md: "row" }}
          justify="between"
          gap="2"
          align="center"
          className="border border-red-500 rounded-md p-4"
        >
          <div className="md:mt-0 md:flex flex-col w-full text-red-500  hover:opacity-90 rounded-md">
            <div className="text-md font-bold">Your KYC has been Rejected</div>
            <div className="text-md bg-white mr-auto rounded-md text-red-500">
              {" "}
              {userData?.kycReviewReason}
            </div>
          </div>
          <Button color="red" variant="soft" onClick={handleSubmit}>
            Upload documents
          </Button>
        </Flex>
      )}

      {user?.kycStatus === "approved" &&
        (localStorage.getItem("successKwcVisible") === "true" &&
        successKycVisible === true ? (
          <Flex
            direction={{ initial: "column", md: "row" }}
            justify="between"
            gap="2"
            align="start"
            className="border border-green-500 rounded-md p-4"
          >
            <div className="md:mt-0 md:flex flex-col w-full text-green-500  hover:opacity-90 rounded-md">
              <div className="text-md font-bold">
                Your KYC has been Successfully validated
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
                <p>Close</p>
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
