'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import AccountVerification from '@/app/components/user/AccountVerification';
import SuperAdminSignUp from '@/app/components/user/SuperadminSignUp';
import BusinessAdminSignUp from '../../components/user/BusinessAdminSignUp'
import EmployeeSignUp from '../../components/user/EmployeeSignUp';

export default function SignUpPage() {
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [superAdminSignUp, setSuperAdminSignUp] = useState(false);
    const [businessAdminSignUp, setBusinessAdminSignUp] = useState(true);
    const [employeeSignUp, setEmployeeSignUp] = useState(false);

    const [formData] = useState({
        email: '',
    });

    return (
        <div className="h-screen flex bg-white">
            {showVerification && (
                <AccountVerification
                    showAccountVerification={showVerification}
                    setShowAccountVerification={setShowVerification}
                    email={formData.email}
                />
            )}

            <div className="flex justify-between items-center gap-5 w-full px-5 md:px-10 text-sm">
                <div className="w-full md:w-[500px] space-y-3 py-10">
                    <Image src="/auth-logo.png" width={32} height={32} alt="Logo" className="w-8 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Create Business Account</h3>

                    <p className="text-gray-700 text-sm">
                        Already have an account?
                        <Link href="/user/signin" className="underline ml-1">Sign in</Link>
                    </p>
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-gray-700">
                        <FcGoogle className="text-md" /> Continue with Google
                    </button>

                    <div className="flex items-center gap-2">
                        <hr className="flex-grow border-gray-300" />
                        <span className="text-sm text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>


                    <div className='overflow-x-auto whitespace-nowrap flex w-full justify-between border border-gray-200 px-1 py-1 rounded-md text-xs text-gray-700'>
                        <div className=''>
                            <button onClick={() => { setSuperAdminSignUp(true); setBusinessAdminSignUp(false); setEmployeeSignUp(false) }} className={`py-2 px-1 rounded-md hover:cursor-pointer ${superAdminSignUp ? 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white' : ' text-gray-700'}`}>
                                Super admin sign up
                            </button>
                        </div>

                        <div className=' '>
                            <button onClick={() => { setBusinessAdminSignUp(true); setSuperAdminSignUp(false); setEmployeeSignUp(false) }} className={`py-2 px-1 rounded-md hover:cursor-pointer ${businessAdminSignUp ? 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white' : ' text-gray-700'}`}>
                                Business sign up
                            </button>
                        </div>
                        <div className=' '>
                            <button onClick={() => { setEmployeeSignUp(true); setSuperAdminSignUp(false); setBusinessAdminSignUp(false) }} className={`py-2 px-1 rounded-md hover:cursor-pointer ${employeeSignUp ? 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white' : ' text-gray-700'}`}>
                                Employee sign up
                            </button>
                        </div>

                    </div>

                    <div>
                        {superAdminSignUp && <SuperAdminSignUp />}
                        {businessAdminSignUp && <BusinessAdminSignUp />}
                        {employeeSignUp && <EmployeeSignUp />}
                    </div>

                </div>
                <div className="hidden md:block md:w-3/4 md:ml-5 h-full relative">
                    <Image src="/auth-img.png" alt="signup" fill className="object-cover" />
                </div>
            </div>


        </div>
    );
}
