'use client'
import React from 'react'
import TableComponent from '@/app/components/table/TableComponent';
import DashboardLayout from '@/app/DashboardLayout';

const Department = () => {
    const fields = [
        { key: 'departmentName', label: 'Name', className: '' },
        { key: 'departmentDescription', label: 'Description', className: '' }
    ]

    const actionConfig = {
        edit: {
            endPoint: '/api/user/delete',
            method: 'DELETE',
            payload: {}
        }
    }

    const rightAction = {
        add: {
            label: 'Add Department',
            endpoint: 'department-mgt/create-department',
            method: 'POST',
            icon: '',
            className: 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] opacity-90 text-white px-2 py-1 rounded-sm cursor-pointer',
            payload: {}
        }
    }

    return (
        <DashboardLayout>
            <TableComponent
                title='Departments'
                endpoint='department-mgt/all-business-departments'
                fields={fields}
                breadcrumbs={{
                    parent: { path: '/user/user-management', label: 'User' },
                    current: 'Department'
                }}
                actionConfig={actionConfig}
                rightAction={rightAction}
            />
        </DashboardLayout>

    )
}

export default Department
