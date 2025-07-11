'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import OtpInput from './OtpInput';

interface ResetPasswordProps {
    openResetCode: boolean;
    setOpenResetCode: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
    setResetToken: React.Dispatch<React.SetStateAction<string>>;
}

const ForgotPasswordCode: React.FC<ResetPasswordProps> = ({
    setOpenResetCode,
    setOpenResetPassword,
    setResetToken
}) => {
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error('Reset token must be 6 digits');
            return;
        }

        setResetToken(code);
        setOpenResetCode(false);
        setOpenResetPassword(true);
        setIsSubmitting(true);
    };

    return (
        <>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 flex items-center justify-center z-50" />
            <div className="bg-white p-6 rounded-md shadow-md w-82 lg:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-center">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Enter reset token</h2>
                    <p className='text-sm text-gray-500'>Enter the otp code sent to your email address</p>
                </div>
                <form onSubmit={handleSubmit} className='mt-10'>
                    <OtpInput value={code} onChange={setCode} length={6} />

                    <div className='flex justify-between gap-2'>
                        <button
                            onClick={() => setOpenResetCode(false)}
                            className="w-full mt-4 bg-gray-300 text-gray-500 hover:bg-red-700 hover:text-white hover:cursor-pointer py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 rounded-md hover:cursor-pointer ${isSubmitting
                                ? "bg-blue-500 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Verify Code
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ForgotPasswordCode;
