'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';

const Admin = () => {

    const employeeFields = [
        { key: 'fullName', label: 'Full Name', className: 'min-w-[200px]' },
        { key: 'email', label: 'Email', className: 'min-w-[200px]' },
        { key: 'phoneNumber', label: 'Phone Number', className: 'min-w-[200px]' },
        { key: 'address', label: 'Address', className: 'min-w-[200px]' }
    ]

    const actionConfig = {
        suspend: {
            endPoint: '/api/user/suspend',
            method: 'POST',
            payload: { reason: 'violation' }
        },
        delete: {
            endPoint: '/api/user/delete',
            method: 'DELETE',
            payload: {}
        }
    }

    return (
        <>
            <TableComponent
                title="Employees"
                endpoint="business-employees"
                fields={employeeFields}
                breadcrumbs={{
                    parent: { path: '/user/user-management', label: 'User & Access' },
                    current: 'Employees'
                }}
                actionConfig={actionConfig}

            />
        </>

    )
}

export default Admin
