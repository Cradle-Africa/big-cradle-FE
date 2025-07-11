'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { forgotPasswordService } from '@/app/services/user/userService';
import toast from 'react-hot-toast';

interface ResetPasswordProps {
    openReset: boolean;
    setOpenReset: React.Dispatch<React.SetStateAction<boolean>>;
    openResetCode: boolean;
    setOpenResetCode: React.Dispatch<React.SetStateAction<boolean>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const ForgotPassword: React.FC<ResetPasswordProps> = ({
    setOpenReset,
    setOpenResetCode,
    setEmail,
}) => {
    const [inputEmail, setInputEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        toast.loading('Sending OTP...');
        try {
            await forgotPasswordService({ email: inputEmail });
            setEmail(inputEmail);
            toast.dismiss();
            toast.success('Password reset email sent successfully!');
            setOpenReset(false);
            setOpenResetCode(true);
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error?.message || 'Request Failed');
            } else {
                toast.error('Request Failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 flex items-center justify-center z-50" />
            <div className="bg-white p-6 rounded-md shadow-md w-82 lg:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex justify-between">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Forgot password</h2>
                    <X size={15} className="text-red-500 hover:cursor-pointer" onClick={() => setOpenReset(false)} />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 rounded-md hover:cursor-pointer ${isSubmitting
                            ? "bg-blue-500 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </>
    );
};

export default ForgotPassword;
