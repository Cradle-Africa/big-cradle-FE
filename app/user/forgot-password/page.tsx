'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
    const [formData, setFormData] = useState<{
        password: string;
        confirmPassword: string;

    }>({
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };

    return (

        <div className="min-h-screen flex justify-between px-5 md:py-8 bg-white">

            <div className="flex items-center justify-center w-[400px] px-4 md:px-12 py-4 bg-white">

                <div className="w-full max-w-md space-y-5">
                    <Image src='/auth-logo.png' alt="Big Cradle Logo" className="w-8 mr-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Welcome to Big Cradle</h3>
                    <p className='text-gray-700'>Enter your new password below</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 pr-10 outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 pr-10 outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:cursor-pointer"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <p className='text-gray-700 text-xs'>
                            Remembered your password? <Link href="/user/signin" className="text-blue-500 underline ml-1"> Log in</Link>
                        </p>
                        <button
                            type="submit"
                            className="w-full bg-gray-300 text-gray-500 py-2 rounded-md hover:cursor-pointer hover:text-white hover:bg-[linear-gradient(to_bottom_right,#5E8FF9,#074BDF)]"
                            disabled>
                            Reset password
                        </button>
                    </form>
                </div>
            </div>

            <div className="hidden md:block w-3/4 relative">
                <Image src="/auth-img.png" alt="big cradle Sign up" fill className="object-cover" />
            </div>
        </div>
    );
}
