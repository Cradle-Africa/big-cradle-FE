'use client';

import DashboardLayout from '@/app/DashboardLayout';
import { Spinner } from '@radix-ui/themes';
import axios from '@/app/lib/axios';
import { useEffect, useState } from 'react';
import { useFetchPayoutTransactions } from '../_features/hook';
import PayoutFlowTable from './components/PayoutflowTable';

const Page = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data: payoutsData, isLoading, refetch } = useFetchPayoutTransactions({
        axios,
        queryParams: { page, limit },
    });

    const pagination = {
        page: payoutsData?.pagination.page || 1,
        limit: payoutsData?.pagination.limit || 10,
        total: payoutsData?.pagination.total || 0,
        pages: payoutsData?.pagination.pages || 0,
    };

    useEffect(() => {
        if (!isLoading && payoutsData) {
            refetch();
        }
    }, [isLoading, payoutsData, refetch]);

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
                <h2 className="font-bold text-lg text-black mb-4">Payout transactions</h2>
                <p>
                    View and manage all payout transactions across the BigCradle ecosystem.
                </p>

                <div className="mt-10">
                    <PayoutFlowTable
                        transactionsData={payoutsData?.data}
                        pagination={pagination}
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1); // reset to first page when limit changes
                        }}
                        refetch={refetch}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Page;
