'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';
import DashboardLayout from '@/app/DashboardLayout';
const Admin = () => {

    const employeeFields = [
        { key: 'firstName', label: 'First Name', className: '' },
        { key: 'LastName', label: 'Last Name', className: '' },
        { key: 'email', label: 'Email', className: '' },
        { key: 'phoneNumber', label: 'Phone Number', className: '' },
        { key: 'role', label: 'Role', className: '' },
        { key: 'invitationStatus', label: 'Invitation Status', className: '' }
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

    const rightAction = {
        add: {
            label: 'Invite Employee',
            endpoint: 'manage-employee/invite-employee-user',
            method: 'POST',
            icon: '',
            className: 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] opacity-90 text-white px-2 py-1 rounded-sm cursor-pointer',
            payload: {}
        }
    }

    return (
        <DashboardLayout>
            <TableComponent
                title="Employees"
                endpoint="manage-employee/all-business-user-employeees"
                fields={employeeFields}
                breadcrumbs={{
                    parent: { path: '/user/user-management', label: 'User & Access' },
                    current: 'Employees'
                }}
                actionConfig={actionConfig}
                rightAction={rightAction}
            />
        </DashboardLayout>

    )
}

export default Admin
