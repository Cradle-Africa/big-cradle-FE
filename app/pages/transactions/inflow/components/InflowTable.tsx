"use client";

import { PaginationMeta, InflowTransactionRow } from "@/app/lib/type";
import Pagination from "./Pagination";

type InFlowTableProps = {
	transactionsData?: InflowTransactionRow[];
	pagination: PaginationMeta;
	onPageChange: (newPage: number) => void;
	onLimitChange: (newLimit: number) => void;
};

function paymentStatusBadgeClass(status: string): string {
	const s = status?.toLowerCase() ?? "";
	const base = "rounded-full px-3 py-1 text-xs font-medium capitalize border text-center whitespace-nowrap";
	switch (s) {
		case "paid":
			return `${base} border-green-600 text-green-700 bg-green-50`;
		case "pending":
			return `${base} border-amber-500 text-amber-800 bg-amber-50`;
		case "failed":
			return `${base} border-red-600 text-red-700 bg-red-50`;
		case "not-paid":
		case "not paid":
			return `${base} border-gray-400 text-gray-700 bg-gray-50`;
		default:
			return `${base} border-gray-300 text-gray-600 bg-white`;
	}
}

function counterpartyLabel(t: InflowTransactionRow): string {
	const parts: string[] = [];
	if (t.businessName?.trim()) parts.push(t.businessName.trim());
	const r = [t.researcherFirstName, t.researcherLastName].filter(Boolean).join(" ").trim();
	if (r) parts.push(r);
	return parts.length ? parts.join(" · ") : "—";
}

const InFlowTable = ({
	transactionsData = [],
	pagination,
	onPageChange,
	onLimitChange,
}: InFlowTableProps) => {
	if (!transactionsData.length) {
		return <p className="text-gray-500">No transactions in this view.</p>;
	}

	return (
		<>
			<div className="w-full max-w-full overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
				<table className="min-w-max w-full table-auto divide-y divide-gray-200 rounded-[8px] bg-white">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-semibold">#</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">Provider</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">Currency</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">Counterparty</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">Type & description</th>
							<th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
						{transactionsData.map((transaction, index) => (
							<tr key={transaction.id} className="hover:bg-gray-50">
								<td className="px-4 py-4 font-medium">{index + 1}</td>
								<td className="px-4 py-4 font-medium whitespace-nowrap">
									{new Date(transaction.createdAt).toLocaleString()}
								</td>
								<td className="px-4 py-4 font-semibold">{transaction.amount.toFixed(2)}</td>
								<td className="px-4 py-4 capitalize">{transaction.provider ?? "—"}</td>
								<td className="px-4 py-4">{transaction.currency ?? "—"}</td>
								<td className="px-4 py-4 max-w-[200px]">{counterpartyLabel(transaction)}</td>
								<td className="px-4 py-4 max-w-[220px]">
									<span className="block font-semibold capitalize">{transaction.type}</span>
									{transaction.description &&
										(transaction.description.length > 55
											? transaction.description.slice(0, 55) + "..."
											: transaction.description)}
								</td>
								<td className="px-4 py-4 w-36">
									<span className={paymentStatusBadgeClass(transaction.paymentStatus)}>
										{transaction.paymentStatus}
									</span>
								</td>
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

export default InFlowTable;
