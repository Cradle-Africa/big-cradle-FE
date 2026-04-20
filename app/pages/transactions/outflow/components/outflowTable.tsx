'use client';

import { PaginationMeta, WalletTransactionList } from "@/app/lib/type";
import Pagination from "./Pagination";

type OutFlowTableProps = {
    transactionsData?: WalletTransactionList[];
    pagination: PaginationMeta;
    onPageChange: (newPage: number) => void;
    onLimitChange: (newLimit: number) => void;
};

function paymentStatusBadge(status: string) {
    const s = status?.toLowerCase() ?? "";
    const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap";
    switch (s) {
        case "paid":    return <span className={`${base} border-green-200 text-green-700 bg-green-50`}>● Paid</span>;
        case "pending": return <span className={`${base} border-amber-200 text-amber-700 bg-amber-50`}>◑ Pending</span>;
        case "failed":  return <span className={`${base} border-red-200 text-red-700 bg-red-50`}>✕ Failed</span>;
        case "not-paid": return <span className={`${base} border-gray-200 text-gray-600 bg-gray-50`}>○ Not paid</span>;
        default:        return <span className={`${base} border-gray-200 text-gray-500 bg-white capitalize`}>{status ?? "—"}</span>;
    }
}

const OutFlowTable = ({
    transactionsData = [],
    pagination,
    onPageChange,
    onLimitChange,
}: OutFlowTableProps) => {
    if (!transactionsData.length) {
        return (
            <div className="mt-5 flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                <p className="text-sm font-medium">No outflow transactions found</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mt-5 shadow-sm">
                <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-100 bg-white">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount (BCC)</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type & Description</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50 text-sm text-gray-700">
                        {transactionsData.map((t, index) => (
                            <tr key={t.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-4 text-gray-400 text-xs font-medium">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {new Date(t.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                                    <span className="block text-gray-400">{new Date(t.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                    {(t.amountBCC ?? t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    {" "}<span className="text-xs font-normal text-blue-600">BCC</span>
                                </td>
                                <td className="px-6 py-4 max-w-[260px]">
                                    <span className="block font-semibold capitalize text-xs text-gray-400 mb-0.5">{t.type}</span>
                                    <span className="text-gray-600 text-xs">
                                        {t.description
                                            ? t.description.length > 55 ? t.description.slice(0, 55) + "…" : t.description
                                            : "—"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{paymentStatusBadge(t.paymentStatus)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                limit={pagination.limit}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
            />
        </>
    );
};

export default OutFlowTable;
