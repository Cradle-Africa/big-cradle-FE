
'use client';

import React from 'react'
import DashboardLayout from '@/app/DashboardLayout';
import axios from "@/app/lib/axios";
import { useState } from "react";
import { useFetchAdmins } from './_features/hook';
import { Spinner } from '@radix-ui/themes';
import Pagination from './_components/Pagination';
import AdminTable from './_components/AdminTable';

const Admins = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { isLoading, data: adminData } = useFetchAdmins({
        axios,
        queryParams: {
            page,
            limit
        },
    });

    const adminList = adminData?.data ?? [];
    const pagination = {
        page: Number(adminData?.page) || 1,
        limit: Number(adminData?.limit) || 10,
        total: Number(adminData?.total) || 0,
        pages: Math.ceil(Number(adminData?.total || 0) / Number(adminData?.limit || 10)),
    };

    if (isLoading) return <DashboardLayout><Spinner /></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="flex justify-between mt-5">
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-black">Ecosystems enablers</h2>
                </div>
            </div>

            {/* ecosystems enablers table  */}
            <div className="flex flex-col mt-5">

                <div className="relative xs:w-90 sm:w-93 sm:min-w-full rounded-md" key="table-container">
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className=' bg-white'>
                                <AdminTable data={adminList ?? []} />
                            </div>

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
};

export default Admins;
