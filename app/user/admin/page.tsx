'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';

const Admin = () => {

    const fields = [
        { key: 'fullName', label: 'Full Name', className: '' },
        { key: 'email', label: 'Email', className: '' },
        { key: 'phoneNumber', label: 'Phone Number', className: '' },
        { key: 'address', label: 'Address', className: '' },
        { key: 'department', label: 'Department', className: '' },
        { key: 'business', label: 'Business Name', className: '' },
        { key: 'role', label: 'Role', className: '' },

    ]

    const actionConfig = {
        delete: {
            endPoint: '/api/user/delete',
            method: 'DELETE',
            payload: {}
        },
        suspend: {
            endPoint: '/api/user/suspend',
            method: 'POST',
            payload: { reason: 'violation' }
        }

    }
        

    return (
        <>
            <TableComponent
                title="Investors / Admins"
                endpoint="all-admins"
                fields={fields}
                breadcrumbs={{
                    parent: { path: '/user/admin', label: 'Admin' },
                    current: 'Admins'
                }}
                actionConfig={actionConfig}
            />
        </>

    )
}

export default Admin
