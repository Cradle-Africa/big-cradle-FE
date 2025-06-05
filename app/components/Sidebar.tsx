'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Settings, Headset, BarChart, House, UsersRound, MonitorCog, Banknote, Layers } from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
    const [open, setOpen] = useState(false);


    return (
        <div className="fixed h-screen md:w-64 flex flex-col bg-white rounded-md">
            {/* Mobile toggle */}
            <div className="lg:hidden p-4 flex justify-between items-center border-b border-gray-200">
                Menu
                <button onClick={() => setOpen(!open)} className="text-gray-600">
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {/* Menu list */}
            <div
                className={`lg:flex flex-col justify-between flex-grow ${open ? 'block' : 'hidden'
                    } lg:block`}
            >
                <ul className="flex flex-col space-y-2 mt-4 px-4">
                    <Image src={"/logo.png"} width={100} height={13} alt="Logo" className="w-auto h-13" />

                    <span className="flex py-1 px-3 text-xs text-gray-400">Control</span>
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
                    <li>
                        <Link
                            href='/system-config'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <MonitorCog size={15} />
                                System Config
                            </div>
                        </Link>
                    </li>

                    <span className="flex py-1 px-3 border-t border-gray-100 text-xs text-gray-400">People</span>
                    <li>
                        <Link
                            href='/user/user-management/'
                            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
                        >
                            <div className='flex gap-1 items-center'>
                                <UsersRound size={15} />
                                Users & Access
                            </div>
                        </Link>
                    </li>
                    <li>
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

                    <span className="flex py-1 px-3 border-t border-gray-100 text-xs text-gray-400">Intelligence & Insights</span>
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
                    </li>


                </ul>

                {/* Bottom items */}
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
