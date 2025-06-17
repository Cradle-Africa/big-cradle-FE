'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';

const AdminKyc = () => {

    const fields = [
        { key: 'email', label: 'Email', className: '' },
        { key: 'userType', label: 'User Type', className: '' },
        { key: 'firstName', label: 'First Name', className: '' },
        { key: 'lastName', label: 'Last Name', className: '' },
        { key: 'phoneNumber', label: 'Phone Number', className: '' },
        { key: 'country', label: 'Country', className: '' },
        { key: 'city', label: 'City', className: '' },
        { key: 'state', label: 'State', className: '' },
        { key: 'kycStatus', label: 'Status', className: '' },
        { key: 'createdAt', label: 'Created at', className: '' },
    ]

    const actionConfig = {
        review: {
            endPoint: 'super-admin-auth/review-admin-kyc',
            method: 'POST',
            payload: {}
        },
        view: {
            endPoint: '',
            method: '',
            payload: {}
        },

    }

    return (
        <>
            <TableComponent
                title="Investors KYC"
                endpoint="super-admin-auth/all-admin-kyc-review"
                fields={fields}
                breadcrumbs={{
                    parent: { path: '/Dashboard', label: 'User' },
                    current: 'Investors KYC'
                }}
                actionConfig={actionConfig}
            />
        </>

    )
}

export default AdminKyc
