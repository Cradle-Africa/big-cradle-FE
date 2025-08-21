'use client';

import DashboardLayout from '@/app/DashboardLayout';
import { Spinner } from '@radix-ui/themes';
import axios from '@/app/lib/axios';
import { useEffect, useState } from 'react';
import { useFetchInflowTransactions } from '../_features/hook';
import InflowTable from './components/InflowTable';

const Page = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data: transactionsData, isLoading, refetch } = useFetchInflowTransactions({
        axios,
        queryParams: { page, limit },
    });

    // pagination metadata 
    const pagination = {
        page: page, // Use current state,
        limit: limit, // Use current state,
        total: transactionsData?.pagination.total || 0,
        pages: transactionsData?.pagination.pages || 0
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
                <h2 className="font-bold text-lg text-black mb-4">In flow transactions</h2>
                <p>
                    View and manage all in flow transactions across the BigCradle ecosystem.
                </p>

                <div className="mt-10">
                    <InflowTable
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