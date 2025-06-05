'use client';
import React from 'react'
import { useState } from 'react';
import { X } from 'lucide-react';
import { forgotPasswordService } from '@/app/services/user/userService';
import toast from 'react-hot-toast';



interface ResetPasswordProps {
    openReset: boolean;
    setOpenReset: React.Dispatch<React.SetStateAction<boolean>>;
    openResetCode: boolean;
    setOpenResetCode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ openReset, setOpenReset, openResetCode, setOpenResetCode }) => {

    const [formData, setFormData] = useState<{
        email: string;

    }>({
        email: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        const payload = {
            email: formData.email,
        }

        try {
            toast.loading('Sending OTP...');
            await forgotPasswordService(payload);
            setFormData({ ...formData, email: '' });
            toast.dismiss();
            toast.success('Password reset email sent successfully!');
            setOpenReset(!openReset); 
            setOpenResetCode(!openResetCode);
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to reset the password');
            } else {
                toast.error('Failed to reset the password');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 flex items-center justify-center z-50"></div>
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className='flex justify-between'>
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Forgot password</h2>
                    <X size={15} className='text-red-500 hover:cursor-pointer' onClick={() => setOpenReset(false)} />
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 outline-none "
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gray-300 text-gray-500 py-2 rounded-md hover:cursor-pointer hover:text-white hover:bg-[linear-gradient(to_bottom_right,#5E8FF9,#074BDF)]"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </>
    )
}


export default ResetPassword
