'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ActionDropdownMenu from '../../components/drop-down/ActionDropdownMenu'
import DashboardLayout from '@/app/components/layouts/DashboardLayout'
import { apiGetPaginateService } from '../../services/apiService'
import { removeUser } from '@/app/utils/user/userData';
import Pagination from '@/app/components/table/Pagination';

interface TableData {
    id: string
    [key: string]: string | number | boolean | null | undefined
}

interface TableField {
    key: string
    label: string
    className?: string
}

interface TableComponentProps {
    title: string
    endpoint: string
    data?: TableData[]
    fields: TableField[]
    breadcrumbs: {
        parent: { path: string; label: string }
        current: string
    }
    actionConfig?: {
        suspend?: {
            endPoint: string
            method: string
            payload: Record<string, unknown>
        }
        delete?: {
            endPoint: string
            method: string
            payload: Record<string, unknown>
        }
    }
    onActionComplete?: (id: string) => void
}

const TableComponent: React.FC<TableComponentProps> = ({
    title,
    endpoint,
    data,
    fields,
    breadcrumbs,
    actionConfig,
    // onActionComplete
}) => {
    const [tableData, setTableData] = useState<TableData[]>(data || [])
    const [loading, setLoading] = useState<boolean>(true)

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.ceil(totalItems / limit);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const response = await apiGetPaginateService(endpoint, {
                    page: currentPage,
                    limit
                });
                setTableData(response.data);
                setTotalItems(response.total || response.data.length);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    if (err.message === 'Unauthorized') {
                        removeUser() // Remove user if unauthorized
                    }
                } 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, limit, endpoint]);

    // const handleActionComplete = (id: string) => {
    //     const newData = tableData.filter(item => item.id !== id)
    //     setTableData(newData)
    //     if (onActionComplete) {
    //         onActionComplete(id)
    //     }
    // }

    return (
        <DashboardLayout>
            <div className='flex w-full text-sm'>
                <span className='text-gray-400'>
                    <Link href={breadcrumbs.parent.path} key="breadcrumb-link">
                        {breadcrumbs.parent.label} /
                    </Link>
                </span>
                <span className='text-gray-700 ml-1' key="breadcrumb-current">
                    {breadcrumbs.current}
                </span>
            </div>

            <div className="relative w-93 sm:min-w-full mt-5 rounded-md border border-gray-100 px-5 py-5 bg-white" key="table-container">
                <div className='flex justify-between items-center mb-4' key="table-header">
                    <h2 className="text-sm md:text-md text-gray-700 font-semibold" key="table-title">
                        {title}
                    </h2>
                </div>

                <div className='relative overflow-x-auto whitespace-nowrap' key="table-wrapper">
                    {loading ? (
                        <div key="loading-state" className='px-6 py-4 text-center text-sm text-gray-500'>Loading...</div>
                    ) : (
                        <>
                            <table className="relative w-full" key="data-table">
                                <thead key="table-head">
                                    <tr className='bg-gray-100' key="header-row">
                                        {fields.map((field, index) => (
                                            <th
                                                key={`header-${field.key}-${index}`}
                                                className={`px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider border-r border-gray-200 ${index === 0 ? 'rounded-tl-lg' : ''
                                                    } ${index === fields.length - 1 && !actionConfig ? 'rounded-tr-lg' : ''
                                                    } ${field.className || ''}`}
                                            >
                                                {field.label}
                                            </th>
                                        ))}
                                        {actionConfig && (
                                            <th
                                                key="actions-header"
                                                className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200" key="table-body">
                                    {tableData.length > 0 ? (
                                        tableData.map((item) => (
                                            <tr key={`row-${item.id}`}>
                                                {fields.map((field, index) => (
                                                    <td
                                                        key={`cell-${item.id}-${field.key}-${index}`}
                                                        className={`border border-gray-100 px-6 py-3 whitespace-nowrap text-sm ${field.className || ''}`}
                                                    >
                                                        {item[field.key]}
                                                    </td>
                                                ))}
                                                {actionConfig && (
                                                    <td
                                                        key={`actions-${item.id}`}
                                                        className='border border-gray-100 px-6 py-3 whitespace-nowrap'
                                                    >
                                                        <ActionDropdownMenu
                                                            Id={item.id}
                                                            suspendAction={actionConfig.suspend}
                                                            deleteAction={actionConfig.delete}
                                                        />
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr key="no-data-row">
                                            <td
                                                key="no-data-cell"
                                                colSpan={fields.length + (actionConfig ? 1 : 0)}
                                                className="px-6 py-4 text-center text-sm text-gray-700"
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
                    )}
                </div>
            </div>
        </DashboardLayout>
    )

}

export default TableComponent