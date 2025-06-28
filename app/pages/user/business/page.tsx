'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';
import DashboardLayout from '@/app/DashboardLayout';
const Admin = () => {

    const businessFields = [
        { key: 'email', label: 'Email', className: '' },
        { key: 'businessName', label: 'Business Name', className: '' },
        { key: 'contactPersonFirstName', label: 'First Name', className: '' },
        { key: 'contactPersonLastName', label: 'Last Name', className: '' },
        { key: 'businessCountry', label: 'businessCountry', className: '' },
        { key: 'contactNumber', label: 'Phone Number', className: '' },
        { key: 'businessCity', label: 'City', className: '' },
        { key: 'businessState', label: 'State', className: '' },
        { key: 'kycStatus', label: 'Status', className: '' },
        { key: 'organizationSize', label: 'Size', className: '' },
        { key: 'businessAddress', label: 'businessAddress', className: '' },
    ]

    const actionConfig = {
        // resetPassword: {
        //     endPoint: 'manage-business/change-password',
        //     method: 'PUT',
        //     payload: {}
        // },
        delete: {
            endPoint: 'manage-business',
            method: 'DELETE',
            payload: {}
        }
    }

    const rightAction = {
        add: {
            label: 'Invite Business',
            endpoint: 'manage-business/invite-business-user',
            method: 'POST',
            icon: '',
            className: 'bg-blue-600 text-white px-2 py-1 rounded-sm cursor-pointer',
            payload: {}
        },
    }

    return (
        <DashboardLayout>
            <TableComponent
                title="Businesses"
                endpoint="manage-business/all-admin-user-businesses"
                fields={businessFields}
                breadcrumbs={{
                    parent: { path: '/', label: 'Dashboard' },
                    current: 'Dashboard'
                }}
                actionConfig={actionConfig}
                rightAction={rightAction}
            />
        </DashboardLayout>

    )
}

export default Admin
