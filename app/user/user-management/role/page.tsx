import React from 'react'
import RoleComponent from '../../../components/user-management/RoleComponent';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Link from 'next/link';

const RolePage = () => {
    return (
        <DashboardLayout>
            <div>
                <div className='flex w-full text-sm'>
                    <span className='text-gray-400'>
                        <Link href='/user/user-management'>
                            User & Access /
                        </Link>
                    </span>
                    <span className='text-gray-700 ml-1'> Role Management</span>
                </div>
                <RoleComponent />
            </div>
        </DashboardLayout>
    )
}

export default RolePage
