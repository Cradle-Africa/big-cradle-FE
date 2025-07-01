'use client'
import React, { useState } from 'react'
import DashboardLayout from '@/app/DashboardLayout';
import axios from '@/app/lib/axios';
import BusinessKycLoading from './loading';
import { useFetchBusinessKyc } from './_features/hook';
import BusinessKycTable from './_components/BusinessKycTable';
import Pagination from '../_components/Pagination';

const BusinessKyc = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { isLoading, data: businessesData } = useFetchBusinessKyc({
        axios,
        queryParams: {
            page,
            limit,
        },
    });

    const businessKycList = businessesData?.data ?? [];
    const pagination = businessesData?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 };

    if (isLoading) return <BusinessKycLoading />;

    return (
        <DashboardLayout>
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-black">Businesses Kyc</h2>
                </div>
            </div>

            {/* department table  */}
            <div className="flex flex-col bg-white mt-5">

                <div className="relative xs:w-90 sm:w-93 sm:min-w-full rounded-md bg-white" key="table-container">
                    {isLoading ? (
                        <BusinessKycLoading />
                    ) : (
                        <>
                            <BusinessKycTable data={businessKycList ?? []} />
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.pages}
                                limit={pagination.limit}
                                onPageChange={(newPage) => setPage(newPage)}
                                onLimitChange={(newLimit) => {
                                    setLimit(newLimit);
                                    setPage(1); // Reset to page 1 on limit change
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default BusinessKyc