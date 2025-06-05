'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RoleDropDownMenu from '../drop-down/RoleDropDownMenu';

const RoleComponent = () => {
    const pathname = usePathname();
    return (
        <div className="overflow-x-auto w-full mt-5 rounded-md border border-gray-100 px-5 py-5 bg-white">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-md text-gray-700 font-semibold mb-4">Role Management Panel</h2>
                {pathname !== '/user/user-management/role' && (
                    <div className="flex items-center gap-1 text-sm underline text-[#0023E8]">
                        <Link href='/user/user-management/role'> View all</Link>
                        <ArrowRight size={15} />
                    </div>
                )}
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                    <tr className='bg-gray-100'>
                        <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Role</th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Description</th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Users Assigned</th>
                        <th className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Permissions</th>
                        <th className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Actions</th>

                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Super Admin</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Full Access</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">8</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">All</td>
                        <td className='border border-gray-100 px-6 py-3 whitespace-nowrap'>
                            <RoleDropDownMenu />
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Admin</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Partial Access</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">4</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">All</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                            <RoleDropDownMenu />
                        </td>
                    </tr>

                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">User</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Partial Access</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">4</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">All</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                            <RoleDropDownMenu />
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

    )
}

export default RoleComponent
