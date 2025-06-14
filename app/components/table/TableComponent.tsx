'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ActionDropdownMenu from '../../components/drop-down/ActionDropdownMenu'
import DashboardLayout from '@/app/components/layouts/DashboardLayout'
import { apiGetPaginateService } from '../../services/apiService'
import { removeUser } from '@/app/utils/user/userData';
import Pagination from '@/app/components/table/Pagination';
import FormPopup from '@/app/components/pop-up/PopUpForm';
import { getBusinessId, getToken } from '../../utils/user/userData'
import { TableData, TableComponentProps, Department } from './types/Table';
import { BASE_URL } from '@/app/services/base'

const TableComponent: React.FC<TableComponentProps> = ({ title, endpoint, data, fields, breadcrumbs, actionConfig, rightAction, }) => {
    const [tableData, setTableData] = useState<TableData[]>(data || [])
    const [loading, setLoading] = useState<boolean>(true)

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.ceil(totalItems / limit);
    const [openDepartment, setOpenDepartment] = useState(false);
    const [openEmployee, setOpenEmployee] = useState(false);
    const businessId = getBusinessId();
    const accessToken = getToken();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const response = await apiGetPaginateService(endpoint, {
                    page: currentPage,
                    limit,
                    businessUserId: businessId
                });
                setTableData(response.data || response.department || response.employeeUser);
                setTotalItems(response.total || response.data.length);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    if (err.message === 'Unauthorized') {
                        removeUser()
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, limit, endpoint, businessId]);

    return (
        <DashboardLayout>

            {openDepartment && (
                <FormPopup
                    setOpen={setOpenDepartment}
                    title="Create Department"
                    method={rightAction?.add?.method || 'POST'}
                    endPoint={rightAction?.add?.endpoint || ''}
                    fields={[
                        { name: 'departmentName', label: 'Name', type: 'text', required: true },
                        { name: 'departmentDescription', label: 'Description', type: 'text', required: false },
                        { name: 'businessUserId', label: '', type: 'hidden', required: true }
                    ]}
                    defaultValues={{ businessUserId: businessId || '' }}
                />
            )}

            {openEmployee && (
                <FormPopup
                    setOpen={setOpenEmployee}
                    title="Send Invite Link"
                    method={rightAction?.add?.method || 'POST'}
                    endPoint={rightAction?.add?.endpoint}
                    fields={[
                        { name: 'email', label: 'Email', type: 'email', required: true },
                        { name: 'role', label: '', type: 'hidden', required: true },
                        { name: 'businessUserId', label: '', type: 'hidden', required: false },
                        {
                            name: 'departmentId', label: 'Department', type: 'select', required: true,
                            fetchOptions: async () => {
                                const res = await fetch(
                                    `${BASE_URL}/department-mgt/all-business-departments?businessUserId=${businessId}`,
                                    {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${accessToken}`,
                                        },
                                    }
                                );
                                const data = await res.json();
                                return (data?.department as Department[]).map((d: Department) => ({ label: d.departmentName, value: d.id }));
                            }
                        },
                    ]}
                    defaultValues={{ businessUserId: businessId || '', role: 'employee' }}
                />
            )}

            <div className='flex justify-between w-full text-sm'>
                <div>
                    <span className='text-gray-400'>
                        <Link href={breadcrumbs.parent.path} key="breadcrumb-link">
                            {breadcrumbs.parent.label} /
                        </Link>
                    </span>
                    <span className='text-gray-700 ml-1' key="breadcrumb-current">
                        {breadcrumbs.current}
                    </span>
                </div>
                <div>
                    {rightAction && rightAction.add && (
                        <>
                            <button
                                onClick={() => {
                                    if (title === 'Employees') {
                                        setOpenEmployee(true)
                                    } else if (title === 'Departments') {
                                        setOpenDepartment(true)
                                    }
                                }}
                                className={`btn ${rightAction.add.className || 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] opacity-90 text-white px-2 py-1 rounded-sm cursor-pointer'}`}
                                key="right-action-button"
                            >
                                {rightAction.add.icon && (
                                    <span className={`icon ${rightAction.add.icon}`} key="right-action-icon"></span>
                                )}
                                {rightAction.add.label}
                            </button>
                        </>

                    )}
                </div>
            </div>

            <div className="relative w-93 sm:min-w-full mt-5 rounded-md border border-gray-100 px-5 py-5 bg-white" key="table-container">
                <div className='flex justify-between items-center mb-4' key="table-header">
                    <h2 className="text-sm md:text-md text-gray-700 font-semibold" key="table-title">
                        {title}
                    </h2>
                </div>

                <div className='relative overflow-x-auto whitespace-nowrap ' key="table-wrapper">
                    <>
                        <table className="relative w-full" key="data-table">
                            <thead key="table-head">
                                <tr className="bg-gray-100" key="header-row">
                                    <th
                                        key="header-index"
                                        className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200 rounded-tl-lg"
                                    >
                                        #
                                    </th>
                                    {fields.map((field, index) => (
                                        <th
                                            key={`header-${field.key}-${index}`}
                                            className={`px-3 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200 ${index === fields.length - 1 && !actionConfig ? 'rounded-tr-lg' : ''}`}>
                                            {field.label}
                                        </th>
                                    ))}
                                    {actionConfig && (
                                        <th
                                            key="actions-header"
                                            className="rounded-tr-lg border-l border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700"
                                        >
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>


                            <tbody className="bg-white divide-y divide-gray-200" key="table-body">
                                {loading ? (
                                    <tr key="loading-state">
                                        <td
                                            className="py-2 text-center text-sm text-gray-500"
                                            colSpan={fields.length + 1 + (actionConfig ? 1 : 0)} // 1 for index
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : tableData?.length > 0 ? (
                                    tableData.map((item, rowIndex) => (
                                        <tr key={`row-${item.id}`}>
                                            <td className="border border-gray-100 px-3 py-2 whitespace-nowrap text-sm">
                                                {rowIndex + 1}
                                            </td>
                                            {fields.map((field, idx) => (
                                                <td
                                                    key={`cell-${item.id}-${field.key}-${idx}`}
                                                    className={`border border-gray-100 px-3 py-2 whitespace-nowrap text-sm capitalize ${field.className || ''}`}
                                                >
                                                    <span 
                                                        className={` 
                                                            ${field.label === 'Status' && item[field.key] === 'pending' && 'text-xs text-[#ad0b0e] border border-[#ad0b0e] rounded-2xl px-2 py-[2px]'} 
                                                            ${field.label === 'Status' && item[field.key] === 'rejected' && 'text-xs text-[#ad0b0e] border border-[#ad0b0e] rounded-2xl px-2 py-[2px]'} 
                                                            ${field.label === 'Status' && item[field.key] !== 'pending' && 'text-xs text-[#0BAD2E] border border-[#0BAD2E] rounded-2xl px-1 py-[2px]'} 
                                                            
                                                        }`}>
                                                        {item[field.key]}                                              
                                                    </span>
                                                </td>
                                            ))}
                                            {actionConfig && (
                                                <td
                                                    key={`actions-${item.id}`}
                                                    className="border border-gray-100 px-6 py-2 whitespace-nowrap"
                                                >
                                                    <ActionDropdownMenu
                                                        Id={item.id}
                                                        businessUserId={item.businessUserId}
                                                        certificate={item.certificateOfIncorporation}
                                                        suspendAction={actionConfig.suspend}
                                                        deleteAction={actionConfig.delete}
                                                        editAction={actionConfig.edit}
                                                        viewAction={actionConfig.view}
                                                        approveAction={actionConfig.approve}
                                                        rejectAction={actionConfig.reject}
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr key="no-data-row">
                                        <td
                                            key="no-data-cell"
                                            colSpan={fields.length + 1 + (actionConfig ? 1 : 0)} // 1 for index
                                            className="px-3 py-4 text-center text-sm text-gray-700"
                                        >
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>


                        <Pagination
                            key="pagination"
                            currentPage={currentPage}
                            totalPages={totalPages}
                            limit={limit}
                            onPageChange={setCurrentPage}
                            onLimitChange={setLimit}
                            className=""
                            showPageInput={true}
                            showLimitSelect={true}
                        />
                    </>
                </div>
            </div>
        </DashboardLayout>
    )

}

export default TableComponent