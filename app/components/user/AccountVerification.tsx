'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import OtpInput from './OtpInput';
import { verifyOtpService, resendOtpService } from '../../services/user/userService';
import { useRouter } from 'next/navigation';

interface AccountVerificationProps {
    showAccountVerification: boolean;
    setShowAccountVerification: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
}

const AccountVerification: React.FC<AccountVerificationProps> = ({ setShowAccountVerification, email }) => {
    const [formData, setFormData] = useState<{ email: string; otp: string }>({
        email,
        otp: '',
    });
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(prev => ({ ...prev, email }));
    }, [email]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.otp.length !== 6) {
            toast.error('OTP must be 6 digits');
            return;
        }

        setIsSubmitting(true);
        const payload = {
            email: formData.email,
            otp: formData.otp.toString(),
        };

        try {
            toast.loading('Verifying OTP...');
            await verifyOtpService(payload);
            setFormData({ ...formData, otp: '' }); 
            toast.dismiss();
            toast.success('OTP verified successfully!');
            setShowAccountVerification(false);
            router.push('/pages/user/signin');
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error.message || 'OTP verification failed');
            } else {
                toast.error('OTP verification failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        const payload = {
            email: formData.email,
        }

        try {
            toast.loading('Resending OTP...');
            await resendOtpService(payload);
            setFormData({ ...formData, otp: '' });
            toast.dismiss();
            toast.success('OTP resent successfully!');
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error.message || 'OTP verification failed');
            } else {
                toast.error('OTP verification failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>
            <div className="bg-white p-6 rounded-md shadow-md w-62 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-center">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Verify your email address</h2>
                    <p className="text-sm text-gray-500">We sent a six digit code to your email address. Input it here to proceed.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                    <OtpInput
                        length={6}
                        value={formData.otp}
                        onChange={(otp) => setFormData({ ...formData, otp })}
                    />

                    <div className="text-center text-xs mt-5">
                        <p>
                            Didn’t get the code?
                            <a onClick={handleResendCode} className="underline text-blue-500 mx-1 hover:cursor-pointer">Resend code</a>
                            in 4 seconds...
                        </p>
                    </div>

                    <div className="flex gap-5 justify-center mt-5">
                        <button
                            type="button"
                            className="w-full hover:cursor-pointer text-gray-500 py-2 h-10 rounded-md hover:border border-gray-400"
                            onClick={() => setShowAccountVerification(false)}
                        >
                            Close
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 rounded-md hover:cursor-pointer text-gray-500 bg-gray-300 ${isSubmitting ? 'bg-gray-300' : 'shadow-md hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90'}`}

                        >
                            {isSubmitting ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AccountVerification;
