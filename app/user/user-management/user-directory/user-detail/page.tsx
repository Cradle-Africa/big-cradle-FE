import React from 'react'
import Link from 'next/link';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import UserDetailDropDownMenu from '../../../../components/drop-down/UserDetaildropDowwnMenu';
import { IdCard, User, Check, CircleUserRound, Megaphone } from 'lucide-react';

const UserDetailPage = () => {
    return (
        <DashboardLayout>
            <div>
                <div className='flex w-full text-sm'>
                    <span className='flex ittems-center text-gray-400'>
                        <Link href='/user/user-management'>
                            User & Access /
                        </Link>
                        <Link href='/user/user-management/user-directory'>
                            User directory /
                        </Link>
                    </span>
                    <span className='text-gray-700 ml-1'> User Detail</span>
                </div>

                <div className="overflow-x-auto w-full mt-5 rounded-md border border-gray-100 px-5 py-5 bg-white">
                    <div className='flex justify-between items-center mb-2'>
                        <h2 className="text-md text-gray-700 font-semibold mb-4">User Detail Page</h2>
                        <UserDetailDropDownMenu />
                    </div>
                    <div className='flex items-center gap-1 mb-2'>
                        <IdCard size={15} className='text-blue-600' />
                        <h5>Basic Information</h5>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
                            <tr className='bg-gray-100'>
                                <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Field</th>
                                <th className="rounded-tr-lg border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Value</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Full Name</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">John Doe</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Role</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Super Admin</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Organisation</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ABC Corp</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Email</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">john.doe@example.com</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Phone</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">+1 234 567 890</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Location</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">New York, USA</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Account Status</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <span className='text-xs text-[#0BAD2E] border border-[#0BAD2E] rounded-2xl px-1 py-[2px] transition-colors duration-200'>
                                        Active
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Last Login</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">2 days ago</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Sign up Date</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">2025-06-06</td>
                            </tr>



                        </tbody>
                    </table>

                    <div className='flex items-center gap-1 mt-5 mb-2'>
                        <User size={15} className='text-blue-600' />
                        <h5>Account Activities & Access Logs</h5>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
                            <tr className='bg-gray-100'>
                                <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Event</th>
                                <th className="border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">IP</th>
                                <th className="border-l rounded-tr-lg border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Logged In</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">192.168.0.3</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12:34pm</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Uploaded Dataset</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">192.168.0.3</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12:34pm</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Accessed Partner Metrics</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">192.168.0.3</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12:34pm</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Logged Out</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">192.168.0.3</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12:34pm</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className='flex items-center gap-1 mt-5 mb-2'>
                        <User size={15} className='text-blue-600' />
                        <h5>User Summary Metrics (Last 30 Days)</h5>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
                            <tr className='bg-gray-100'>
                                <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Metrics</th>
                                <th className="border-l rounded-tr-lg border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Value</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Data set Uploaded</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">8</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Surveys Created</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">5</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Survey Completion Rate</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">62.5%</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Feedback Responses Receeived</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">20</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Reward Payouts Triggred</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">₦184,000</td>
                            </tr>   

                        </tbody>
                    </table>

                    <div className='flex items-center gap-1 mt-5 mb-2'>
                        <Megaphone size={15} className='text-blue-600' />
                        <h5>Linked Compaigns</h5>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
                            <tr className='bg-gray-100'>
                                <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Campaign Title</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Status</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Created on</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Completion Rate</th>
                                <th className="border-l rounded-tr-lg border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Data set Uploaded</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <span className='text-xs text-[#0BAD2E] border border-[#0BAD2E] rounded-2xl px-1 py-[2px] transition-colors duration-200'>
                                        Completed
                                    </span>
                                </td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Ap 12, 2025</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">88%</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <Link href='/user/user-management/user-directory/user-detail' className='underline hover:no-underline hover:cursor-pointer'>View</Link>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Surveys Created</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <span className='text-xs text-[#7688B5] border border-[#7688B5] rounded-2xl px-1 py-[2px] transition-colors duration-200'>
                                        Ongoing
                                    </span>
                                </td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Ap 12, 2025</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">62%</td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <Link href='/user/user-management/user-directory/user-detail' className='underline hover:no-underline hover:cursor-pointer'>View</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className='flex items-center gap-1 mt-5 mb-2'>
                        <CircleUserRound size={15} className='text-blue-600' />
                        <h5>Role Perrmissions</h5>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
                            <tr className='bg-gray-100'>
                                <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Module</th>
                                <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Access</th>
                                <th className="border-l rounded-tr-lg border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Dashboard Access</td>
                                <td className="flex items-center border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <Check size={15} className='text-green-600 mr-1' />
                                    Full
                                </td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <div className='bg-blue-600 rounded-full w-4 h-4'> </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">User Management</td>
                                <td className="flex items-center border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <Check size={15} className='text-green-600 mr-1' />
                                    Full
                                </td>
                                <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">
                                    <div className='bg-blue-600 rounded-full w-4 h-4'> </div>
                                </td>   
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default UserDetailPage 
