'use client';

import DashboardLayout from '@/app/DashboardLayout';
import { Spinner } from '@radix-ui/themes';
import axios from '@/app/lib/axios';
import { useEffect, useState } from 'react';
import { useFetchOutFlowTransactions } from '../_features/hook';
import OutFlowTable from './components/outflowTable';

const Page = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data: transactionsData, isLoading, refetch } = useFetchOutFlowTransactions({
        axios,
        queryParams: { page, limit },
    });

    const pagination = {
        page: transactionsData?.pagination.page || 1,
        limit: transactionsData?.pagination.limit || 10,
        total: transactionsData?.pagination.total || 0,
        pages: transactionsData?.pagination.pages || 0,
    };

    useEffect(() => {
        if (!isLoading && transactionsData) {
            refetch();
        }
    }, [isLoading, transactionsData, refetch]);


    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <Spinner />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="w-full mt-5">
                <h2 className="font-bold text-lg text-black mb-4">Out flow transactions</h2>
                <p>
                    View and manage all out flow transactions across the BigCradle ecosystem.
                </p>

                <div className="mt-10">
                    <OutFlowTable
                        transactionsData={transactionsData?.data}
                        pagination={pagination}
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1); // reset to first page when limit changes
                        }}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Page;
