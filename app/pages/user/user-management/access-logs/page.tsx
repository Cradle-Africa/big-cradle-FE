import React from 'react'
import AccessLogsComponent from '../../../../components/user-management/AccessLogsComponent';
import DashboardLayout from '../../../../DashboardLayout';
import Link from 'next/link';

const AccessLogsPage = () => {
    return (
        <DashboardLayout>
            <div>
                <div className='flex w-full text-sm'>
                    <span className='text-gray-400'>
                        <Link href='/user/user-management'>
                            User & Access / 
                        </Link>
                    </span> <span className='text-gray-700 ml-1'>Access Logs</span>
                </div>
                <AccessLogsComponent />
            </div>
        </DashboardLayout>
    )
}

export default AccessLogsPage
