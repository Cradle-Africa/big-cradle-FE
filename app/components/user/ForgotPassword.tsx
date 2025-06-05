'use client';
import React from 'react'
import { useState } from 'react';
import { X } from 'lucide-react';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     console.log(formData);
    // };

    return (
        <>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 flex items-center justify-center z-50"></div>
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className='flex justify-between'>
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Forgot password</h2>
                    <X size={15} className='text-red-500 hover:cursor-pointer' onClick={() => setOpenReset(false)} />
                </div>
                <form className="space-y-4">
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
                        className="w-full bg-gray-300 text-gray-500 py-2 rounded-md hover:cursor-pointer hover:text-white hover:bg-[linear-gradient(to_bottom_right,#5E8FF9,#074BDF)]"
                        onClick={() => { setOpenReset(!openReset); setOpenResetCode(!openResetCode) }}
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </>
    )
}


export default ResetPassword
