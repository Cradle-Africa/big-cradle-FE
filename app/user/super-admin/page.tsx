'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';

const SuperAdmin = () => {

    const fields = [
        { key: '#', label: '#', className: '' },
        { key: 'fullName', label: 'Full Name', className: '' },
        { key: 'email', label: 'Email', className: '' }
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
                title="Super Admins"
                endpoint="all-super-admins"
                fields={fields}
                breadcrumbs={{
                    parent: { path: '/user/super-admin', label: 'Super Admin' },
                    current: 'Super Admins'
                }}
                actionConfig={actionConfig}
            />
        </>

    )
}

export default SuperAdmin
