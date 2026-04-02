"use client";

import { PaginationMeta, WalletTransactionList } from "@/app/lib/type";
import Pagination from "./Pagination";
import { useState } from "react";
import PayoutActions from "./PayoutActions";
import PayoutStatus from "./PayoutStatus";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

type PayoutFlowTableProps = {
	transactionsData?: WalletTransactionList[];
	pagination: PaginationMeta;
	onPageChange: (newPage: number) => void;
	onLimitChange: (newLimit: number) => void;
};

function payoutStatusBadgeClass(status: string): string {
	const s = status?.toLowerCase() ?? "";
	const base = "rounded-full px-3 py-1 text-xs font-medium capitalize border text-center whitespace-nowrap";
	if (s === "paid") return `${base} border-green-600 text-green-700 bg-green-50`;
	if (s === "not-paid" || s === "not paid")
		return `${base} border-gray-400 text-gray-700 bg-gray-50`;
	return `${base} border-gray-300 text-gray-600 bg-white`;
}

const PayoutFlowTable = ({
	transactionsData = [],
	pagination,
	onPageChange,
	onLimitChange,
}: PayoutFlowTableProps) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [activateOpen, setActivateOpen] = useState(false);
	const [uniqueId, setUniqueId] = useState<string>("");
	const [selectedTransaction, setSelectedTransaction] = useState<WalletTransactionList | null>(null);

	if (!transactionsData.length) {
		return <p className="text-gray-500">No payouts in this view.</p>;
	}

	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Account number copied to clipboard!");
		} catch {
			toast.error("Failed to copy account number.");
		}
	};

	return (
		<>
			<div className="w-full max-w-full overflow-x-auto rounded-[8px] border border-gray-200 mt-5 pb-10">
				<table className="min-w-max w-full table-auto divide-y divide-gray-200 rounded-[8px] bg-white">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-semibold">#</th>
							<th className="px-3 py-3 text-left text-sm font-semibold">Date</th>
							<th className="px-3 py-3 text-left text-sm font-semibold">Amount</th>
							<th className="px-3 py-3 text-left text-sm font-semibold">Researcher</th>
							<th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">Payment type</th>
							<th className="px-3 py-3 text-left text-sm font-semibold whitespace-nowrap">Type & description</th>
							<th className="px-3 py-3 text-left text-sm font-semibold">Status</th>
							<th className="px-3 py-3 text-left text-sm font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
						{transactionsData.map((transaction, index) => (
							<tr key={transaction.id} className="hover:bg-gray-50">
								<td className="px-4 py-4 font-medium">{index + 1}</td>
								<td className="px-3 py-4 font-medium whitespace-nowrap">
									{new Date(transaction.createdAt).toLocaleString()}
								</td>
								<td className="px-3 py-4 font-semibold">{transaction.amount.toFixed(2)}</td>
								<td className="px-3 py-4 font-semibold">
									{[transaction.researcherFirstName, transaction.researcherLastName]
										.filter(Boolean)
										.join(" ")
										.trim() || "—"}
								</td>
								<td className="px-3 py-4 font-semibold">{transaction.paymentType}</td>
								<td className="px-3 py-4 max-w-[200px]">
									<span className="block font-semibold capitalize">{transaction.type}</span>
									{transaction.description &&
										(transaction.description.length > 55
											? transaction.description.slice(0, 55) + "..."
											: transaction.description)}
								</td>
								<td className="px-3 py-4 w-36">
									<span className={payoutStatusBadgeClass(transaction.payoutStatus)}>
										{transaction.payoutStatus}
									</span>
								</td>
								<td className="px-3 py-4">
									{transaction.payoutStatus !== "paid" ? (
										<PayoutActions
											index={index}
											openIndex={openIndex}
											setOpenIndex={setOpenIndex}
											onActivate={() => {
												setUniqueId(transaction.id ?? "");
												setSelectedTransaction(transaction);
												setActivateOpen(true);
											}}
										/>
									) : (
										<span className="px-2">N/A</span>
									)}
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

			{activateOpen && selectedTransaction && (
				<PayoutStatus uniqueId={uniqueId} setOpen={setActivateOpen} payout />
			)}
		</>
	);
};

export default PayoutFlowTable;
