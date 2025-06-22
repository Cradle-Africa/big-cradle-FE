'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../DashboardLayout';
import ActionDropdownMenu from '../../../components/drop-down/ActionDropdownMenu';
import { IdCard } from 'lucide-react';
import { apiGetService } from '../../../services/apiService'
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const [userData, setUserData] = useState<any>(null);
    const endPoint = '/authentication/me';

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await apiGetService(endPoint)
                setUserData(response?.data)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message || 'Request fail')
                } else {
                    console.log(error)
                }
            }
        }
        fetchUser();

    }, []);

    const renderSuperAdminTable = () => (
        <>
            <tr>
                <td className=" px-6 py-3 text-sm">Full Name</td>
                <td className=" px-6 py-3 text-sm">{userData.fullName}</td>
            </tr>
            <tr>
                <td className=" px-6 py-3 text-sm">Role</td>
                <td className=" px-6 py-3 text-sm capitalize">{userData.role}</td>
            </tr>
            <tr>
                <td className=" px-6 py-3 text-sm">Email</td>
                <td className=" px-6 py-3 text-sm">{userData.email}</td>
            </tr>
            <tr>
                <td className=" px-6 py-3 text-sm">Account Status</td>
                <td className=" px-6 py-3 text-sm">
                    <span className='text-xs text-[#0BAD2E] border border-[#0BAD2E] rounded-2xl px-1 py-[2px]'>
                        {userData.isVerified ? 'Active' : 'Inactive'}
                    </span>
                </td>
            </tr>
        </>
    );

    const renderBusinessTable = () => (
        <>
            <tr>
                <td className="px-6 py-3 text-sm">Business Name</td>
                <td className="px-6 py-3 text-sm">{userData.businessName}</td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">Contact Person</td>
                <td className="px-6 py-3 text-sm">
                    {userData.contactPersonFirstName} {userData.contactPersonLastName}
                </td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">Phone</td>
                <td className="px-6 py-3 text-sm">{userData.countryCode} {userData.contactNumber}</td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">Location</td>
                <td className="px-6 py-3 text-sm">{userData.businessAddress}, {userData.businessCity}, {userData.businessState}, {userData.businessCountry}</td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">Sector</td>
                <td className="px-6 py-3 text-sm">{userData.sector}</td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">Organization Size</td>
                <td className="px-6 py-3 text-sm">{userData.organizationSize}</td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">Email</td>
                <td className="px-6 py-3 text-sm">{userData.email}</td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">Role</td>
                <td className="px-6 py-3 text-sm">{userData.role}</td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">KYC Status</td>
                <td className="px-6 py-3 text-sm capitalize">{userData.kycStatus}</td>
            </tr>
            <tr>
                <td className="px-6 py-3 text-sm">Account Status</td>
                <td className="px-6 py-3 text-sm">
                    <span className='text-xs text-[#0BAD2E] border border-[#0BAD2E] rounded-2xl px-1 py-[2px]'>
                        {userData.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
            </tr>
        </>
    );

    return (
        <DashboardLayout>
            <div>
                <div className='flex w-full text-sm'>
                    <span className='flex items-center text-gray-400'>
                        <Link href='/user/user-management'>User & Access /</Link>
                        <Link href='/user/user-management/user-directory'>User directory /</Link>
                    </span>
                    <span className='text-gray-700 ml-1'>User Detail</span>
                </div>

                <div className="w-93 md:w-full mt-5 rounded-md border border-gray-100 px-5 py-5 bg-white">
                    <div className='flex justify-between items-center mb-2'>
                        <h2 className="text-sm md:text-md text-gray-700 font-semibold mb-4">User Detail Page</h2>
                        <ActionDropdownMenu
                            Id="123"
                            onViewProfile={() => { }}
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
                    </div>
                    <div className='flex items-center gap-1 mb-2'>
                        <IdCard size={15} className='text-blue-600' />
                        <h5>Basic Information</h5>
                    </div>
                    <div className="overflow-x-auto rounded-[8px] mt-10 border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className="rounded-tl-lg px-6 py-3 text-left text-sm font-semibold text-gray-600">Field</th>
                                    <th className="rounded-tr-lg px-6 py-3 text-left text-sm font-semibold text-gray-600">Value</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {!userData ? (
                                    <tr>
                                        <td colSpan={2} className='px-6 py-3 text-center text-sm text-gray-400'>Loading...</td>
                                    </tr>
                                ) : userData.role === 'super admin' ? (
                                    renderSuperAdminTable()
                                ) : userData.role === 'business' ? (
                                    renderBusinessTable()
                                ) : (
                                    <tr>
                                        <td colSpan={2} className='px-6 py-3 text-center text-sm text-gray-400'>Unknown Role</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
