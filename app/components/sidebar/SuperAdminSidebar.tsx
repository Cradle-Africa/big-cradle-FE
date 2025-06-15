'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
    Menu, X, Settings, Headset, House, UsersRound, ChevronDown,
    ChevronUp, User, Building2, Users
} from 'lucide-react';
import Image from 'next/image';
export default function SuperAdminSidebar() {
    const [open, setOpen] = useState(false);
    const [usersMenuOpen, setUsersMenuOpen] = useState(false);

    return (
        <div className={`z-10 md:fixed md:h-screen lg:w-64 flex flex-col px-3 py-2 rounded-br md:bg-white rounded-md md:border-b border-gray-200 ${open ? 'fixed shadow bg-white' : 'absolute '} `}>
            {/* Mobile toggle - unchanged */}
            <div className={` ${open ? '' : 'border border-gray-200'} md:hidden rounded-md mt-3 md:mt-0 px-2 py-1 md:p-4 flex justify-between items-center`}>
                <button onClick={() => setOpen(!open)} className="text-gray-500 hover:cursor-pointer">
                    {open ? (
                        <div className='flex items-center justify-between'>
                            <Link href='/'>
                                <Image src={"/logo.png"} width={150} height={13} alt="Logo" className='' />
                            </Link>
                            <X size={15} className='text-red-500' />
                        </div>
                    ) : <Menu size={25} className='' />}
                </button>
            </div>

            {/* Menu list */}
            <div
                className={`lg:flex flex-col justify-between text-sm flex-grow ${open ? 'block' : 'hidden'
                    } lg:block`}
            >
                <ul className="flex flex-col space-y-2 mt-2 px-4">
                    <Link href='/'>
                        <Image src={"/logo.png"} width={100} height={13} alt="Logo" className={` ${open ? 'hidden' : 'w-auto h-13'}`} />
                    </Link>
                    <span className="flex md:py-1 px-3 text-xs text-gray-400">Control</span>
                    <li>
                        <Link
                            href='/'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <House size={15} />
                                Dashboard
                            </div>
                        </Link>
                    </li>
                    {/* <li>
                        <Link
                            href='/system-config'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <MonitorCog size={15} />
                                System Config
                            </div>
                        </Link>
                    </li> */}

                    <span className="flex md:py-1 px-3 border-t border-gray-100 text-xs text-gray-400">People</span>
                    <li>
                        <div
                            onClick={() => setUsersMenuOpen(!usersMenuOpen)}
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition cursor-pointer"
                        >
                            <div className='flex gap-1 items-center justify-between'>
                                <div className='flex gap-1 items-center'>
                                    <UsersRound size={15} />
                                    Users & Access
                                </div>
                                {usersMenuOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </div>
                        </div>
                        {usersMenuOpen && (
                            <div className="ml-6 mt-1 space-y-1">
                                <Link
                                    href='/pages/user/user-management/'
                                    className="py-1 px-3 rounded hover:bg-gray-200 transition text-sm flex items-center gap-2"
                                >
                                    <User size={14} />
                                    User management
                                </Link>
                                {/* <Link
                                    href='/pages/user/super-admin/'
                                    className="py-1 px-3 rounded hover:bg-gray-200 transition text-sm flex items-center gap-2"
                                >
                                    <Shield size={14} />
                                    Super admin
                                </Link>
                                <Link
                                    href='/pages/user/admin/'
                                    className="py-1 px-3 rounded hover:bg-gray-200 transition text-sm flex items-center gap-2"
                                >
                                    <UserCog size={14} />
                                    Investors/Admins
                                </Link> */}
                                <Link
                                    href='/pages/user/business-kyc/'
                                    className="py-1 px-3 rounded hover:bg-gray-200 transition text-sm flex items-center gap-2"
                                >
                                    <Building2 size={14} />
                                    Businesses KYC
                                </Link>
                                <Link
                                    href='/pages/user/employee/'
                                    className="py-1 px-3 rounded hover:bg-gray-200 transition text-sm flex items-center gap-2"
                                >
                                    <Users size={14} />
                                    Employees
                                </Link>
                               
                            </div>
                        )}
                    </li>
                    {/* <li>
                        <Link
                            href='/pages/user/department'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <MonitorCog size={15} />
                                Department
                            </div>
                        </Link>
                    </li> */}
                    {/* <li>
                        <Link
                            href='/ecosystem'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <Layers size={15} />
                                Ecosystem
                            </div>
                        </Link>
                    </li>

                    <span className="flex md:py-1 px-3 border-t border-gray-100 text-xs text-gray-400">Intelligence & Insights</span>
                    <li>
                        <Link
                            href='/analytics'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <BarChart size={15} />
                                Analytics
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/billing'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <Banknote size={15} />
                                Billing
                            </div>
                        </Link>
                    </li> */}
                </ul>

                {/* Bottom items - unchanged */}
                <ul className="flex flex-col space-y-2 px-4 pb-4 mt-auto">
                    <li>
                        <Link
                            href='support'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <Headset size={15} />
                                Support
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/settings'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <Settings size={15} />
                                Settings
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}