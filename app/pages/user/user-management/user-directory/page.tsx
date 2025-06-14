import React from 'react';
import DashboardLayout from '../../../../components/layouts/DashboardLayout';
import UserManagementComponent from '../../../../components/user-management/UserManagementComponent';
import Link from 'next/link';

const UserManagementPage = () => {
    return (
        <DashboardLayout>

            <div>
                <div className='flex w-full text-sm'>
                    <span className='text-gray-400'>
                        <Link href='/user/user-management'>
                            User & Access / 
                        </Link> 
                    </span>
                    <span className='text-gray-700 ml-1'>User</span>
                </div>
                <UserManagementComponent />
            </div>
        </DashboardLayout>
    )
}

export default UserManagementPage
