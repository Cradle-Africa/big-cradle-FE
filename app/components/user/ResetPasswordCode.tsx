'use client';
import React from 'react'
import { useState } from 'react';
import OtpInput from './OtpInput';

interface ResetPasswordProps {
    openReset: boolean;
    setOpenReset: React.Dispatch<React.SetStateAction<boolean>>;
    openResetCode: boolean;
    setOpenResetCode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ openReset, openResetCode, setOpenResetCode }) => {
    const [otp, setOtp] = useState('');

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    // };

    return (
        <>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 flex items-center justify-center z-50"></div>
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className='text-center'>
                    <h2 className="text-md font-semibold text-gray-700 mb-4">We sent you a code</h2>
                    <p>We sent a four digit code to your email address, input it here to proceed to changing your password</p>
                </div>
                <form className="mt-8">
                    <OtpInput 
                        length={4} 
                        value={otp} 
                        onChange={setOtp} 
                    />
                    <div className='text-center text-xs mt-5'>
                        <p>Did not get the code?
                            <a className='underline text-blue-500 mx-1 hover:cursor-pointer'>Resend code</a>
                            in 4 seconds...
                        </p>
                    </div>
                    <div className='flex gap-5 justify-center mt-5'>
                        <button
                            className="w-full bg-gray-300 text-gray-500 py-2 rounded-md hover:cursor-pointer hover:text-white hover:bg-[linear-gradient(to_bottom_right,#5E8FF9,#074BDF)]"
                            onClick={() => setOpenResetCode(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="w-full bg-gray-300 text-gray-500 py-2 rounded-md hover:cursor-pointer hover:text-white hover:bg-[linear-gradient(to_bottom_right,#5E8FF9,#074BDF)]"
                            onClick={() => { setOpenResetCode(!openReset); setOpenResetCode(!openResetCode) }}
                        >
                            Verify code
                        </button>
                    </div>


                </form>
            </div>
        </>
    )
}


export default ResetPassword
