'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { resetPasswordService } from '../../services/user/userService';
import { validateResetPassword } from '../../utils/userValidation';

interface ResetPasswordProps {
    email: string;
    resetToken: string;
    setopenResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email, resetToken, setopenResetPassword }) => {

    const [formData, setFormData] = useState({
        email,
        resetToken,
        password: '',
        confirmPassword: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        setFormData(prev => ({ ...prev, email, resetToken }));
    }, [email, resetToken]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateResetPassword(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0 || resetToken.length !== 6) {
            toast.error('Please check the form for errors.');
            return;
        }

        setIsSubmitting(true);
        toast.loading('Resetting password...');

        const payload = {
            email: formData.email,
            newPassword: formData.password,
            resetToken: formData.resetToken
        }
        try {
            await resetPasswordService(payload);
            toast.dismiss();
            toast.success('Password reset successfully!');
            window.location.href = '/user/signin';
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error?.message || 'Request failed');
            }else{
                toast.error('Request failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40" />
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-center">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Reset your password</h2>
                    <p className='text-sm text-gray-500'>Enter the new password</p>

                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="New Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none"
                        />
                        <div className="absolute right-3 top-2.5 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none"
                        />
                        <div className="absolute right-3 top-2.5 cursor-pointer" onClick={() => setShowConfirmPassword(prev => !prev)}>
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                    </div>

                    <div className='flex justify-between gap-2'>
                        <button
                            onClick={() => setopenResetPassword(false)}
                            className="w-full bg-gray-300 text-gray-500 hover:bg-red-700 hover:text-white hover:cursor-pointer py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gray-300 text-gray-500 py-2 rounded-md hover:cursor-pointer hover:text-white hover:bg-[linear-gradient(to_bottom_right,#5E8FF9,#074BDF)]"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ResetPassword;
