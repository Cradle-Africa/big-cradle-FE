import React from 'react';
import { UploadCloud } from 'lucide-react';
import FormPopup from './pop-up/PopUpForm';


interface KycVerificationProps {
    openBusinessKycVerification: boolean;
    setOpenBusinessKycVerification: React.Dispatch<React.SetStateAction<boolean>>
    openAdminKycVerification: boolean;
    setOpenAdminKycVerification: React.Dispatch<React.SetStateAction<boolean>>
    user: {
        email?: string;
        kycStatus?: 'not-submitted' | 'pending' | 'rejected' | string;
        certificateOfIncorporation?: string;
        role: string;
    };
    kycReviewReason?: string;
}

const KycVerification: React.FC<KycVerificationProps> = ({
    openBusinessKycVerification,
    setOpenBusinessKycVerification,
    openAdminKycVerification,
    setOpenAdminKycVerification,
    user,
    kycReviewReason
}) => {

    const handleSubmit = () => {
        if(user?.role === 'business'){
            setOpenBusinessKycVerification(true)
        }
        if(user?.role === 'admin'){
            setOpenAdminKycVerification(true)
        }
    }
    return (
        <>
            {openBusinessKycVerification && (
                <FormPopup
                    setOpen={setOpenBusinessKycVerification}
                    title="KYC Verification"
                    method="POST"
                    endPoint="business-auth/upload-certificate-of-incorporation"
                    fields={[
                        { name: 'email', label: '', type: 'hidden', required: true },
                        {
                            name: 'certificateOfIncorporation',
                            label: 'Certificate of Incorporation',
                            type: 'file',
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
                        { name: 'email', label: '', type: 'hidden', required: true },
                        {
                            name: 'certificateOfIncorporation',
                            label: 'Certificate of Incorporation',
                            type: 'file',
                            required: true,
                        },
                        {
                            name: 'individualValidMeansOfId',
                            label: 'Individual ID',
                            type: 'file',
                            required: true,
                        },
                    ]}
                    defaultValues={{ email: user?.email }}
                />
            
            )}

            {user?.kycStatus === 'not-submitted' && (
                <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no bg-red-400 text-white px-5 py-3 rounded-md mb-4">
                    <div className="text-md">Upload your certificate for KYC verification</div>
                    <button
                        onClick={handleSubmit}
                        className="bg-red-700 text-white rounded-md mt-5 md:mt-0 px-5 py-1 h-8 text-sm hover:border hover:border-white hover:cursor-pointer"
                    >
                        <UploadCloud size={14} className="inline" />
                        <span className="ml-1">Verify KYC</span>
                    </button>
                </div>
            )}

            {user?.kycStatus === 'pending' && (
                <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no bg-blue-600 text-white px-5 py-3 rounded-md mb-4">
                    <div className="text-md">Your KYC has been submitted and is under review</div>
                </div>
            )}

            {user?.kycStatus === 'rejected' && (
                <div className="mt-14 md:mt-0 md:flex w-full justify-between items-center text-center md:text-center-no text-white bg-gradient-to-br from-[#ff5762] to-[#d20505] hover:opacity-90 px-5 py-3 rounded-md mb-4">
                    <div className="text-md">Your KYC has been Rejected</div>
                    { kycReviewReason && (
                        <div className="text-md bg-white rounded-md px-2 py-1 text-red-500"> {kycReviewReason }</div>
                    )}
                </div>
            )}
        </>
    );
};

export default KycVerification;
