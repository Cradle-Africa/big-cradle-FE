'use client';
import React, { useState } from 'react'
import { Search, Bell, ChevronRight, CircleUser, LogOut, X } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import Image from 'next/image';
import TopBarSkeleton from './skeleton/TopBarSkeleton';
import {removeUser} from '../utils/user/userData';

const Topbar = () => {
    const [openProfile, setOpenProfile] = useState(false);
    const user = useUser();
    if (!user) {
        return (
            <TopBarSkeleton/>
        )
    }
    return (
        <>
            <div className=''>
                <div className="border-b border-gray-100 w-full flex justify-end md:justify-between pl-5 pt-5 pb-4">
                    <form className="hidden relative md:flex items-center">
                        <Search className="absolute left-3 text-gray-300 w-4 h-4 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search for something..."
                            className="hidden md:block pl-10 pr-3 py-1 md:w-72 border border-gray-300 text-sm rounded-md focus:outline-none"
                        />
                    </form>

                    <div className='flex justify-between gap-3 items-center'>
                        <Bell className="hidden md:block w-8 h-8 p-2 rounded-full bg-[#F3F3F3] text-gray-600" />

                        {user?.profilePicture ?
                            <Image src={user?.profilePicture} width={8} height={8} alt='profile image' className='rounded-full w-8 h-8' />
                            :
                            <CircleUser className='rounded-full w-8 h-8' />
                        }

                        <div className='flex flex-col hover:cursor-pointer' onClick={() => setOpenProfile(!openProfile)}>
                            <span className='hidden lg:inline text-xs font-semibold'>
                                {user?.fullName ?? (user?.contactPersonFirstName + ' ' + user?.contactPersonLastName)}
                            </span>
                            <span className='inline lg:hidden text-xs font-semibold'>{user?.fullName?.slice(0, 12) + '...'}</span>
                            <span className='text-xs text-gray-500'>{user?.role}</span>
                        </div>
                        <ChevronRight
                            onClick={() => setOpenProfile(!openProfile)}
                            className="w-4 h-4 text-gray-500 hover:cursor-pointer" />
                    </div>
                </div>
                {openProfile && (
                    <div className='absolute z-20 right-5 md:right-10 showdow-md bg-white px-2 py-2 md:px-5 md:py-5 rounded-md border border-gray-100'>
                        <X onClick={() => setOpenProfile(!openProfile)} size={15} className='absolute right-2 md:right-5 hover:cursor-pointer' color='red' />
                        <div className='flex justify-center mt-5'>
                            {user?.profilePicture ?
                                <Image src={user?.profilePicture} width={8} height={8} alt='profile image' className='rounded-full w-12 h-12' />
                                :
                                <CircleUser className='rounded-full w-12 h-12' />
                            }
                        </div>
                        <div className='flex flex-col mt-5 md:mt-10 text-blue-600'>
                            <span className='hidden lg:inline text-sm font-semibold '>
                                {user?.fullName ?? (user?.contactPersonFirstName + ' ' + user?.contactPersonLastName)}
                            </span>
                            <span className='inline lg:hidden text-sm font-semibold'>{user?.fullName}</span>
                            <span className='text-xs'>{user?.role}</span>
                        </div>
                        <button
                            className='w-full px-2 py-1 bg-gray-100 rounded-md mt-5 text-sm hover:cursor-pointer hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90 transition-shadow'
                        >
                            <LogOut 
                                size={12} 
                                className='inline mr-1' 
                                onClick={() => removeUser()}
                                />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>

    )
}

export default Topbar
