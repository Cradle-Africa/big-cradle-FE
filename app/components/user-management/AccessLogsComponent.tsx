'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AccessLogsComponent = () => {
    const pathname = usePathname();
    return (
        <div className="relative w-93 sm:w-full mt-5 rounded-md border border-gray-100 px-5 py-5 bg-white">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-sm md:text-md text-gray-700 font-semibold mb-4">Access Logs(Recent Activities)</h2>
                {pathname !== '/user/user-management/access-logs' && (
                    <div className="flex items-center gap-1 text-sm underline text-[#0023E8]">
                        <Link href='/user/user-management/access-logs'> View all</Link>
                        <ArrowRight size={15} />
                    </div>
                )}
            </div>

            <div className='relative overflow-x-auto whitespace-nowrap'>
                <table className="w-full table-auto">
                    <thead className="">
                        <tr className='bg-gray-100'>
                            <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">User</th>
                            <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Event</th>
                            <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">IP</th>
                            <th className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Time stamp</th>

                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">John Doe</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Access the survey</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">192.68.0.2</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12:00:05</td>
                        </tr>

                        <tr>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">John Doe</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Access the survey</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">192.68.0.2</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12:00:05</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">John Doe</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Access the survey</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">192.68.0.2</td>
                            <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12:00:05</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default AccessLogsComponent
