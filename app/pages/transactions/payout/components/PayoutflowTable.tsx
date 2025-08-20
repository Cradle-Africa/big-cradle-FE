'use client';

import { PaginationMeta, WalletTransactionList } from "@/app/lib/type";
import Pagination from "./Pagination";
import { useState } from "react";
import PayoutActions from "./PayoutActions";
import PayoutStatus from "./PayoutStatus";

type PayoutFlowTableProps = {
    transactionsData?: WalletTransactionList[];
    pagination: PaginationMeta;
    onPageChange: (newPage: number) => void;
    onLimitChange: (newLimit: number) => void;
    refetch: () => void;
};

const PayoutFlowTable = ({
    transactionsData = [],
    pagination,
    onPageChange,
    onLimitChange,
    refetch,
}: PayoutFlowTableProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activateOpen, setActivateOpen] = useState(false);
    const [uniqueId, setUniqueId] = useState<string>('');
    const [selectedTransaction, setSelectedTransaction] = useState<WalletTransactionList | null>(null);

    if (!transactionsData.length) {
        return <p className="text-gray-500">No transactions available.</p>;
    }

    return (
        <>
            <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5 pb-10">
                <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px] bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Type & Description</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                        {transactionsData.map((transaction, index) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{index + 1}</td>
                                <td className="px-6 py-4 font-medium">
                                    {new Date(transaction.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-semibold">
                                    {transaction.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="block font-semibold mt-1 capitalize">
                                        {transaction.type}
                                    </span>
                                    {transaction.description &&
                                        (transaction.description.length > 55
                                            ? transaction.description.slice(0, 55) + "..."
                                            : transaction.description)}
                                </td>
                                <td className="px-6 py-4 w-44">
                                    <span
                                        className={`${transaction.payoutStatus === "paid"
                                            ? "border border-green-600 text-green-600"
                                            : "border border-red-600 text-red-600"
                                            } rounded-full px-5 py-1 capitalize w-full text-center`}
                                    >
                                        {transaction.payoutStatus}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {transaction.payoutStatus !== "paid" ? (
                                        <PayoutActions
                                            index={index}
                                            openIndex={openIndex}
                                            setOpenIndex={setOpenIndex}
                                            onActivate={() => {
                                                setUniqueId(transaction?.id ?? "");
                                                setSelectedTransaction(transaction);
                                                setActivateOpen(true);
                                            }}
                                        />
                                    ):(
                                        <span className="px-2">
                                            N/A
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                limit={pagination.limit}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
            />

            {
                activateOpen && selectedTransaction && (
                    <PayoutStatus uniqueId={uniqueId} setOpen={setActivateOpen} payout={true} refetch={refetch} />
                )
            }
        </>
    );
};

export default PayoutFlowTable;
