'use client';
import React from 'react'
import { Search, Bell, ChevronRight } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import Image from 'next/image';

const Topbar = () => {
    const user = useUser();
    if (!user) {
        return null; 
    }

    return (
        <div className="border-b border-gray-100 w-full flex justify-between pt-5 pb-4 px-5">
            <form className="relative flex items-center">
                <Search className="absolute left-3 text-gray-300 w-4 h-4 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search for something..."
                    className="hidden md:block pl-10 pr-3 py-1 md:w-72 border border-gray-300 text-sm rounded-md focus:outline-none"
                />
            </form>

            <div className='flex justify-between gap-5 items-center'>
                <Bell className="w-8 h-8 p-2 rounded-full bg-[#F3F3F3] text-gray-600" />
                <Image src="/profile.png" alt='profile image' className='w-8 h-8' />
                <div className='flex flex-col'>
                    <span className='text-xs font-semibold'>{user?.fullName}</span>
                    <span className='text-xs text-gray-500'>{user?.role}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 hover:cursor-pointer" />
            </div>

        </div>
    )
}

export default Topbar
