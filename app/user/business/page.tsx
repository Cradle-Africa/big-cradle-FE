'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';

const Businesses = () => {

    const fields = [
        { key: '#', label: '#', className: '' },
        { key: 'fullName', label: 'Full Name', className: '' },
        { key: 'phoneNumber', label: 'Phone Number', className: '' },
        { key: 'country', label: 'Country', className: '' },
        { key: 'state', label: 'State', className: '' },
        { key: 'city', label: 'City', className: '' },
        { key: 'address', label: 'Address', className: '' },
        { key: 'email', label: 'Email', className: '' },
        { key: 'role', label: 'Role', className: '' },
        { key: 'size', label: 'Size', className: '' },
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
            payload: { }
        }    
    }

    return (
        <>
            <TableComponent
                title="Businesses"
                endpoint="all-admin-user-businesses"
                fields={fields}
                breadcrumbs={{
                    parent: { path: '/user/business', label: 'Business' },
                    current: 'Businesses'
                }}
                actionConfig={actionConfig}
            />
        </>

    )
}

export default Businesses
