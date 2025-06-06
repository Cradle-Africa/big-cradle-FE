'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserDropDownMenu from '../drop-down/UserDropDownMenu';

const UserManagementComponent = () => {
    const pathname = usePathname();
    return (
        <div className="relative w-93 sm:w-full mt-5 rounded-md border border-gray-100 px-5 py-5 bg-white">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-sm md:text-md text-gray-700 font-semibold mb-4">User Directory Table</h2>
                {pathname !== '/user/user-management/user-directory' && (
                    <div className="flex items-center gap-1 text-sm underline text-[#0023E8]">
                        <Link href='/user/user-management/user-directory'> View all</Link>
                        <ArrowRight size={15} />
                    </div>
                )}
            </div>

            <div className="relative overflow-x-auto whitespace-nowrap">
                <table className="w-full table-auto">
                    <thead className="">
                        <tr className='bg-gray-100'>
                            <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Name</th>
                            <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Role</th>
                            <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Email</th>
                            <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Status</th>
                            <th className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Ayo B.</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Super Admin</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ayo.b@example.com</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap">
                                <span className='text-xs text-[#0BAD2E] border border-[#0BAD2E] rounded-2xl px-1 py-[2px] transition-colors duration-200'>
                                    Active
                                </span>
                            </td>
                            <td className='border border-gray-100 px-6 py-3 whitespace-nowrap'>
                                <UserDropDownMenu />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Ecosystem Admin</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ShopAssist</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ecosystem.admin@example.com</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap">
                                <span className='text-xs text-[#C00000] border border-[#C00000] rounded-2xl px-1 py-[2px] transition-colors duration-200'>
                                    Inactive
                                </span>
                            </td>
                            <td className='border border-gray-100 px-6 py-3 whitespace-nowrap'>
                                <UserDropDownMenu />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Ecosystem Admin</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ShopAssist</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ecosystem.admin@example.com</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap">
                                <span className='text-xs text-[#C00000] border border-[#C00000] rounded-2xl px-1 py-[2px] transition-colors duration-200'>
                                    Suspended
                                </span>
                            </td>
                            <td className='border border-gray-100 px-6 py-3 whitespace-nowrap'>
                                <UserDropDownMenu />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Ecosystem Admin</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ShopAssist</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ecosystem.admin@example.com</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap">
                                <span className='text-xs text-[#C00000] border border-[#C00000] rounded-2xl px-1 py-[2px] transition-colors duration-200'>
                                    Inactive
                                </span>
                            </td>
                            <td className='border border-gray-100 px-6 py-3 whitespace-nowrap'>
                                <UserDropDownMenu />
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default UserManagementComponent
