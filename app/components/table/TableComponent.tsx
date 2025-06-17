'use client'
import React, { useEffect, useState } from 'react'
import ActionDropdownMenu from '../../components/drop-down/ActionDropdownMenu'
import DashboardLayout from '@/app/DashboardLayout'
import { apiGetPaginateService } from '../../services/apiService'
import { removeUser } from '@/app/utils/user/userData';
import Pagination from '@/app/components/table/Pagination';
import { getBusinessId } from '../../utils/user/userData'
import { TableData, TableComponentProps } from './types/Table';
import BreadsCrumps from './BreadsCrumps'

const TableComponent: React.FC<TableComponentProps> = ({ title, endpoint, data, fields, breadcrumbs, actionConfig, rightAction, }) => {
    const [tableData, setTableData] = useState<TableData[]>(data || [])
    const [loading, setLoading] = useState<boolean>(true)

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.ceil(totalItems / limit);
    const [openDepartment, setOpenDepartment] = useState<boolean>(false);
    const [openEmployee, setOpenEmployee] = useState<boolean>(false);
    const businessId = getBusinessId();

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
                setTotalItems(response.pagination.total || response.total || response.data.length);
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
            <BreadsCrumps
                title={title}
                openDepartment={openDepartment}
                openEmployee={openEmployee}
                setOpenDepartment={setOpenDepartment}
                setOpenEmployee={setOpenEmployee}
                rightAction={rightAction}
                breadcrumbs={breadcrumbs}
            />

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
                                <tr className="bg-gray-100 border-b border-gray-200 rounded-lg " key="header-row">
                                    <th
                                        key="header-index"
                                        className="px-3 py-3 text-left text-sm font-bold text-gray-600 rounded-tl-lg"
                                    >
                                        #
                                    </th>
                                    {fields.map((field, index) => (
                                        <th
                                            key={`header-${field.key}-${index}`}
                                            className={`px-3 py-3 text-left text-sm font-bold text-gray-600 ${index === fields.length - 1 && !actionConfig ? 'rounded-tr-lg' : ''}`}>
                                            {field.label}
                                        </th>
                                    ))}
                                    {actionConfig && (
                                        <th
                                            key="actions-header"
                                            className="rounded-tr-lg px-3 py-3 text-left text-sm font-bold text-gray-600"
                                        >
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>


                            <tbody className="bg-white divide-y divide-gray-100" key="table-body">
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
                                            <td className=" border-l border-gray-100 px-3 py-2 whitespace-nowrap text-sm">
                                                {rowIndex + 1}
                                            </td>
                                            {fields.map((field, idx) => (
                                                <td
                                                    key={`cell-${item.id}-${field.key}-${idx}`}
                                                    className={`px-3 py-2 whitespace-nowrap text-sm capitalize ${field.className || ''}`}
                                                >
                                                    <span 
                                                        className={` 
                                                            ${field.label === 'Status' && item[field.key] === 'pending' && 'text-xs text-[#ad0b0e] border border-[#ad0b0e] rounded-2xl px-3 py-[3px]'} 
                                                            ${field.label === 'Status' && item[field.key] === 'rejected' && 'text-xs text-[#ad0b0e] border border-[#ad0b0e] rounded-2xl px-3 py-[3px]'} 
                                                            ${field.label === 'Status' && item[field.key] !== 'pending' && 'text-xs text-[#0BAD2E] border border-[#0BAD2E] rounded-2xl px-3 py-[3px]'} 
                                                            
                                                        }`}>
                                                        {item[field.key]}                                              
                                                    </span>
                                                </td>
                                            ))}
                                            {actionConfig && (
                                                <td
                                                    key={`actions-${item.id}`}
                                                    className="border-b border-r border-gray-100 px-6 py-2 whitespace-nowrap"
                                                >
                                                    <ActionDropdownMenu
                                                        Id={item.id}
                                                        businessUserId={item.id}
                                                        adminUserId={item.id}
                                                        certificate={item.certificateOfIncorporation}
                                                        suspendAction={actionConfig.suspend}
                                                        deleteAction={actionConfig.delete}
                                                        editAction={actionConfig.edit}
                                                        viewAction={actionConfig.view}
                                                        reviewAction={actionConfig.review}
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
                                            className="px-3 py-4 border-b border-gray-100 text-center text-sm text-gray-700"
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