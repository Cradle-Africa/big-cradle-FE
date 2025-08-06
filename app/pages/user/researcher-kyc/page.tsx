'use client'
import React, { useState } from 'react'
import DashboardLayout from '@/app/DashboardLayout';
import axios from '@/app/lib/axios';
import Pagination from '../employee/_components/Pagination';
import ResearcherKycLoading from './loading';
import ResearcherKycTable from './_components/ResearcherKycTable';
import { useFetchResearcherKyc } from './_features/hook';

const ResearcherKyc = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { isLoading, data: researchersData } = useFetchResearcherKyc({
        axios,
        queryParams: {
            page,
            limit,
        },
    });

    const ResearcherKycList = researchersData?.data ?? [];
    const pagination = researchersData?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 };

    if (isLoading) return <ResearcherKycLoading />;

    return (
        <DashboardLayout>
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-black">Researchers Kyc</h2>
                </div>
            </div>

            {/* department table  */}
            <div className="flex flex-col bg-white mt-5 mb-5">

                <div className="relative xs:w-90 sm:w-93 sm:min-w-full rounded-md bg-white mb-5" key="table-container">
                    {isLoading ? (
                        <ResearcherKycLoading />
                    ) : (
                        <>
                            <ResearcherKycTable data={ResearcherKycList ?? []} />
                            <div className='px-5'>
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
                            </div>

                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ResearcherKyc