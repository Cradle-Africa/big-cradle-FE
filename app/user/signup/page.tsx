'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, ChangeEvent, FormEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import AccountVerification from '@/app/components/user/AccountVerification';
import SuperAdminSignUp from '@/app/components/user/SuperadminSignUp';
import BusinessAdminSignUp from '../../components/user/BusinessAdminSignUp'

export default function SignUpPage() {
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [superAdminSignUp, setSuperAdminSignUp] = useState(false);
    const [businessAdminSignUp, setBusinessAdminSignUp] = useState(true);
    // const [employeeSignUp,  setEmployeeSignUp] = useState(false);

    const [formData, setFormData] = useState({
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

            <div className="flex justify-between gap-5 w-full px-5 md:px-10 text-sm">
                <div className="w-full md:w-[500px] space-y-3 py-10">
                    <Image src="/auth-logo.png" width={32} height={32} alt="Logo" className="w-8 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Create Business Account</h3>

                    <p className="text-gray-700 text-sm">
                        Already have an account?
                        <Link href="/user/signin" className="underline ml-1">Log in</Link>
                    </p>
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-gray-700">
                        <FcGoogle className="text-md" /> Continue with Google
                    </button>

                    <div className="flex items-center gap-2">
                        <hr className="flex-grow border-gray-300" />
                        <span className="text-sm text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    
                    <div className='flex justify-between border border-gray-200 px-1 py-1 rounded-md text-sm text-gray-700'>
                        <button onClick={() => { setSuperAdminSignUp(true); setBusinessAdminSignUp(false) }} className={`md:w-1/2 py-2 px-4 rounded-md hover:cursor-pointer ${superAdminSignUp ? 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white' : ' text-gray-700'}`}>
                            Super admin sign up
                        </button>
                        <button onClick={() => { setBusinessAdminSignUp(true); setSuperAdminSignUp(false) }} className={`md:w-1/2 py-2 px-4 rounded-md hover:cursor-pointer ${businessAdminSignUp ? 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white' : ' text-gray-700'}`}>
                            Organisation sign up
                        </button>
                    </div>

                    <div>
                        {superAdminSignUp && <SuperAdminSignUp />}
                        {businessAdminSignUp && <BusinessAdminSignUp />}
                        {/* {employeeSignUp && <EmployeeSignUpComponent />} */}
                    </div>

                </div>
                <div className="hidden md:block md:w-3/4 md:ml-5 h-full relative">
                    <Image src="/auth-img.png" alt="signup" fill className="object-cover" />
                </div>
            </div>


        </div>
    );
}
