'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react';
import { validateSignUp } from '../../utils/signupValidation';
import { signUpSuperAdminService } from '../../services/user/userService';
import AccountVerification from '@/app/components/user/AccountVerification';
import toast from 'react-hot-toast';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'super admin',
        profilePicture: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAccountVerification, setShowAccountVerification] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateSignUp(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setIsSubmitting(true);

        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            password: formData.password,
            profilePicture:
                formData.profilePicture ||
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        };

        try {
            await signUpSuperAdminService(payload);
            toast.dismiss();
            toast.success('Account created successfully!');
            setShowAccountVerification(true);
        } catch (error: unknown) {
            toast.dismiss();
            if(error instanceof Error){
                toast.error(error.message || 'Sign up failed. Please try again.');
            }else{
                toast.error('Sign up failed, please try again')
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-between px-5 md:py-0 bg-white">
            {showAccountVerification && (
                <AccountVerification
                    showAccountVerification={showAccountVerification}
                    setShowAccountVerification={setShowAccountVerification}
                    email={formData.email}
                />
            )}

            <div className="flex items-center justify-center w-[400px] px-4 md:px-12 py-4 bg-white">
                <div className="w-full max-w-md space-y-6">
                    <Image src="/auth-logo.png" alt="Logo" className="w-8 mr-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">Welcome to Big Cradle</h3>
                    <p className='text-gray-700 text-sm'>
                        Already have an account?
                        <Link href="/user/signin" className="underline ml-1">Log in</Link>
                    </p>

                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md text-gray-700 py-2">
                        <FcGoogle className="text-md" /> Continue with Google
                    </button>

                    <div className="flex items-center gap-2">
                        <hr className="flex-grow border-gray-300" />
                        <span className="text-sm text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                            />
                            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>


                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none"
                            />
                            <div className="absolute right-3 top-2.5 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
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
                            <div className="absolute right-3 top-2.5 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 rounded-md hover:cursor-pointer text-gray-400 bg-gray-200 ${isSubmitting ? 'bg-gray-300' : 'shadow-md hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90'}`}

                        >
                            {isSubmitting ? 'Submitting...' : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="hidden md:block w-3/4 relative">
                <Image src="/auth-img.png" alt="signup" fill className="object-cover" />
            </div>
        </div>
    );
}
