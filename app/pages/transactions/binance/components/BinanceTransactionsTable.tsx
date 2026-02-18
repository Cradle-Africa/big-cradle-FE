"use client";

import { PaginationMeta } from "@/app/lib/type";
import type { BinanceTransaction } from "@/app/lib/type";
import Pagination from "./Pagination";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

function formatStatus(status: number): string {
	const map: Record<number, string> = {
		0: "Pending",
		1: "Completed",
		2: "Failed",
		3: "Processing",
	};
	return map[status] ?? `Status ${status}`;
}

function truncate(str: string | null | undefined, len: number): string {
	if (!str) return "—";
	return str.length <= len ? str : `${str.slice(0, len)}...`;
}

type BinanceTransactionsTableProps = {
	transactionsData?: BinanceTransaction[];
	pagination: PaginationMeta;
	onPageChange: (newPage: number) => void;
	onLimitChange: (newLimit: number) => void;
};

const BinanceTransactionsTable = ({
	transactionsData = [],
	pagination,
	onPageChange,
	onLimitChange,
}: BinanceTransactionsTableProps) => {
	const handleCopyTxId = async (txId: string) => {
		try {
			await navigator.clipboard.writeText(txId);
			toast.success("Tx ID copied to clipboard!");
		} catch {
			toast.error("Failed to copy.");
		}
	};

	if (!transactionsData.length) {
		return (
			<p className="text-gray-500 mt-5">
				No Binance transactions in this range. Try widening the date range or
				triggering a sync.
			</p>
		);
	}

	return (
		<>
			<div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
				<table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px] bg-white">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-sm font-semibold">#</th>
							<th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
							<th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
							<th className="px-6 py-3 text-left text-sm font-semibold">Coin</th>
							<th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
							<th className="px-6 py-3 text-left text-sm font-semibold">Network</th>
							<th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
							<th className="px-6 py-3 text-left text-sm font-semibold">Tx ID</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
						{transactionsData.map((tx, index) => (
							<tr key={tx.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium">{index + 1}</td>
								<td className="px-6 py-4 font-medium">
									{new Date(tx.timestamp).toLocaleString()}
								</td>
								<td className="px-6 py-4">
									<span
										className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
											tx.type === "deposit"
												? "bg-emerald-100 text-emerald-800 border border-emerald-200"
												: "bg-amber-100 text-amber-800 border border-amber-200"
										}`}
									>
										{tx.type}
									</span>
								</td>
								<td className="px-6 py-4 font-semibold">{tx.coin}</td>
								<td className="px-6 py-4 font-semibold">{tx.amount}</td>
								<td className="px-6 py-4">{tx.network ?? "—"}</td>
								<td className="px-6 py-4">
									<span
										className={`rounded-full px-3 py-1 text-xs font-medium ${
											tx.status === 1
												? "border border-green-600 text-green-600"
												: tx.status === 2
													? "border border-red-600 text-red-600"
													: "border border-gray-400 text-gray-600"
										}`}
									>
										{formatStatus(tx.status)}
									</span>
								</td>
								<td className="px-6 py-4">
									{tx.txId ? (
										<button
											type="button"
											onClick={() => handleCopyTxId(tx.txId!)}
											className="flex items-center gap-1 text-left hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
											title={tx.txId}
										>
											{truncate(tx.txId, 12)}
											<Copy size={14} className="shrink-0" aria-hidden />
										</button>
									) : (
										"—"
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Pagination
				currentPage={pagination.page}
				totalPages={pagination.pages || 1}
				limit={pagination.limit}
				onPageChange={onPageChange}
				onLimitChange={onLimitChange}
			/>
		</>
	);
};

export default BinanceTransactionsTable;
