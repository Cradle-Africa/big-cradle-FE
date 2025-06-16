'use client';

import React, { useState } from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface Props {
    formData: {
        email: string;
        password: string;
        confirmPassword: string;
    };
    onChange: (field: string, value: string) => void;
    errors: Record<string, string>
}

const CredentialDetails: React.FC<Props> = ({ formData, onChange, errors }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setPasswordVisible(prev => !prev);

    const password = formData.password || '';

    const passwordRules = [
        {
            label: 'At least 8 characters',
            isValid: password.length >= 8,
        },
        {
            label: 'A maximum of 15 characters',
            isValid: password.length > 0 && password.length <= 15,
        },
        {
            label: 'At least one uppercase letter',
            isValid: /[A-Z]/.test(password),
        },
        {
            label: 'At least one number',
            isValid: /\d/.test(password),
        },
        {
            label: 'At least one special character',
            isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
    ];

    return (
        <div className="space-y-6" >
            {/* Email Field */}
            <div className="relative mt-5">
                <MdOutlineEmail size={20} className="absolute left-2 top-[7px] text-gray-400" />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    placeholder="Email"
                    className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 outline-none pr-10 cursor-pointe"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="relative mt-5">
                <button type="button" onClick={togglePasswordVisibility} >
                    {
                        passwordVisible ? (
                            <IoEyeOutline size={18} className="absolute left-2 top-[7px] text-gray-400 cursor-pointer" />
                        ) : (
                            <IoEyeOffOutline size={18} className="absolute left-2 top-[7px] text-gray-400 cursor-pointer" />
                        )}
                </button>
                < input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={(e) => onChange('password', e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 outline-none pr-10"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
            <div className="relative mt-5">
                <button type="button" onClick={togglePasswordVisibility} >
                    {
                        passwordVisible ? (
                            <IoEyeOutline size={18} className="absolute left-2 top-[7px] text-gray-400 cursor-pointer" />
                        ) : (
                            <IoEyeOffOutline size={18} className="absolute left-2 top-[7px] text-gray-400 cursor-pointer" />
                        )}
                </button>
                < input
                    type={passwordVisible ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => onChange('confirmPassword', e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full pl-10 border border-gray-300 rounded-md px-3 py-2 outline-none pr-10"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
            </div>

            {/* Password Rules */}
            <div className="space-y-1" >
                {
                    passwordRules.map((rule, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-500" >
                            {
                                rule.isValid ? (
                                    <FaCheckCircle className="text-green-500" />
                                ) : (
                                    <FaRegCircle className="text-gray-400" />
                                )}
                            <span>{rule.label} </span>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CredentialDetails;