'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';
import DashboardLayout from '@/app/DashboardLayout';

const BusinessKyc = () => {

    const fields = [
        { key: 'kycReviewReason', label: 'Reason', className: '' },
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
        { key: 'email', label: 'Email', className: '' }
    ]

    const actionConfig = {
        review: {
            endPoint: 'super-admin-auth/review-kyc',
            method: 'POST',
            payload: {}
        },
        view: {
            endPoint: 'super-admin-auth/review-kyc',
            method: 'POST',
            payload: {}
        },


    }


    return (
        <DashboardLayout>
            <TableComponent
                title="Business KYC"
                endpoint="super-admin-auth/all-businesses-kyc-review"
                fields={fields}
                breadcrumbs={{
                    parent: { path: '/user-management', label: 'User' },
                    current: 'Businesses KYC'
                }}
                actionConfig={actionConfig}
            />
        </DashboardLayout>

    )
}

export default BusinessKyc
