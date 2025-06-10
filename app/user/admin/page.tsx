'use client'
import React from 'react'
import Link from 'next/link';
import ActionDropdownMenu from '../../components/drop-down/ActionDropdownMenu';
import DashboardLayout from '@/app/components/layouts/DashboardLayout';
const Admin = () => {
    return (
        <DashboardLayout>
            <div className='flex w-full text-sm'>
                <span className='text-gray-400'>
                    <Link href='/user/user-management'>
                        User & Access /
                    </Link>
                </span>
                <span className='text-gray-700 ml-1'> Investors / Admins</span>
            </div>
            <div className="relative w-93 sm:min-w-full mt-5 rounded-md border border-gray-100 px-5 py-5 bg-white">
                <div className='flex justify-between items-center mb-4'>
                    <h2 className="text-sm md:text-md text-gray-700 font-semibold">Investors / Admins</h2>
                </div>
                <div className='relative overflow-x-auto whitespace-nowrap'>
                    <table className="relative w-full">
                        <thead className="">
                            <tr className='bg-gray-100'>
                                <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Full name</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Email</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">User Type</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Business Name</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Phone Nummber</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Country</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">City</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">State</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Address</th>
                                <th className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">John Doe</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">johndoe@gmail.com</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Corporate</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ABG CC inc</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">+250 784 543 455</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Rwanda</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali, KG 7 Ave</td>
                                <td className='border border-gray-100 px-6 py-3 whitespace-nowrap'>
                                    <ActionDropdownMenu
                                        Id="123"
                                        suspendAction={{
                                            endPoint: '/api/user/suspend',
                                            method: 'POST',
                                            payload: { reason: 'violation' }
                                        }}
                                        deleteAction={{
                                            endPoint: '/api/user/delete',
                                            method: 'DELETE',
                                            payload: {}
                                        }}
                                    />
                                </td>
                            </tr>
                             <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">John Doe</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">johndoe@gmail.com</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Corporate</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ABG CC inc</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">+250 784 543 455</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Rwanda</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali, KG 7 Ave</td>
                                <td className='border border-gray-100 px-6 py-3 whitespace-nowrap'>
                                    <ActionDropdownMenu
                                        Id="123"
                                        suspendAction={{
                                            endPoint: '/api/user/suspend',
                                            method: 'POST',
                                            payload: { reason: 'violation' }
                                        }}
                                        deleteAction={{
                                            endPoint: '/api/user/delete',
                                            method: 'DELETE',
                                            payload: {}
                                        }}
                                    />
                                </td>
                            </tr>
                             <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">John Doe</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">johndoe@gmail.com</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Corporate</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ABG CC inc</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">+250 784 543 455</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Rwanda</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Kigali, KG 7 Ave</td>
                                <td className='border border-gray-100 px-6 py-3 whitespace-nowrap'>
                                    <ActionDropdownMenu
                                        Id="123"
                                        suspendAction={{
                                            endPoint: '/api/user/suspend',
                                            method: 'POST',
                                            payload: { reason: 'violation' }
                                        }}
                                        deleteAction={{
                                            endPoint: '/api/user/delete',
                                            method: 'DELETE',
                                            payload: {}
                                        }}
                                    />
                                </td>
                            </tr>
                            

                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>

    )
}

export default Admin
