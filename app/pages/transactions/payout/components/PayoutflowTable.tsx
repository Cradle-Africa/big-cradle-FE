"use client";

import { PaginationMeta, WalletTransactionList, TransactionProvider } from "@/app/lib/type";
import Pagination from "./Pagination";
import { useState } from "react";
import PayoutActions from "./PayoutActions";
import PayoutStatus from "./PayoutStatus";
import toast from "react-hot-toast";
import { Copy, ExternalLink } from "lucide-react";

type PayoutFlowTableProps = {
	transactionsData?: WalletTransactionList[];
	pagination: PaginationMeta;
	onPageChange: (newPage: number) => void;
	onLimitChange: (newLimit: number) => void;
};

function payoutStatusBadge(status: string) {
	const s = status?.toLowerCase() ?? "";
	const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap";
	switch (s) {
		case "paid":
		case "completed": return <span className={`${base} border-green-200 text-green-700 bg-green-50`}>● Completed</span>;
		case "processing": return <span className={`${base} border-blue-200 text-blue-700 bg-blue-50`}>⟳ Processing</span>;
		case "pending":    return <span className={`${base} border-amber-200 text-amber-700 bg-amber-50`}>◑ Pending</span>;
		case "failed":     return <span className={`${base} border-red-200 text-red-700 bg-red-50`}>✕ Failed</span>;
		case "cancelled":  return <span className={`${base} border-gray-200 text-gray-600 bg-gray-50`}>⊘ Cancelled</span>;
		case "not-paid":
		case "not paid":   return <span className={`${base} border-gray-200 text-gray-600 bg-gray-50`}>○ Not paid</span>;
		default:           return <span className={`${base} border-gray-200 text-gray-500 bg-white capitalize`}>{status ?? "—"}</span>;
	}
}

function providerBadge(provider?: TransactionProvider | string) {
	const base = "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold";
	switch (provider) {
		case "flutterwave": return <span className={`${base} bg-orange-50 text-orange-700 border border-orange-200`}>Flutterwave</span>;
		case "kuvarpay":    return <span className={`${base} bg-purple-50 text-purple-700 border border-purple-200`}>KuvarPay</span>;
		case "stellar":     return <span className={`${base} bg-blue-50 text-blue-700 border border-blue-200`}>🌐 Stellar</span>;
		case "internal":    return <span className={`${base} bg-gray-50 text-gray-600 border border-gray-200`}>Internal</span>;
		default:            return provider ? <span className={`${base} bg-gray-50 text-gray-500 border border-gray-200`}>{provider}</span> : null;
	}
}

function truncateHash(hash: string): string {
	if (hash.length <= 16) return hash;
	return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
}

const STELLAR_EXPLORER_BASE = "https://stellar.expert/explorer/testnet/tx";

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
		return (
			<div className="mt-5 flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
				<p className="text-sm font-medium">No payout transactions found</p>
				<p className="text-xs mt-1">Payouts processed via Stellar will appear here</p>
			</div>
		);
	}

	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Transaction hash copied!");
		} catch {
			toast.error("Failed to copy.");
		}
	};

	return (
		<>
			<div className="w-full max-w-full overflow-x-auto rounded-xl border border-gray-200 mt-5 shadow-sm pb-2">
				<table className="min-w-max w-full table-auto divide-y divide-gray-100 bg-white">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
							<th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
							<th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount (BCC)</th>
							<th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Researcher</th>
							<th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider</th>
							<th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Blockchain TX</th>
							<th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
							<th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
							<th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-50 text-sm text-gray-700">
						{transactionsData.map((t, index) => (
							<tr key={t.id} className="hover:bg-blue-50/30 transition-colors">
								<td className="px-4 py-4 text-gray-400 text-xs font-medium">{index + 1}</td>
								<td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">
									{new Date(t.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
									<span className="block text-gray-400">{new Date(t.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
								</td>

								<td className="px-3 py-4 font-semibold text-gray-900 whitespace-nowrap">
									{(t.amountBCC ?? t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									{" "}<span className="text-xs font-normal text-blue-600">BCC</span>
								</td>

								<td className="px-3 py-4 font-medium text-gray-700">
									{[t.researcherFirstName, t.researcherLastName].filter(Boolean).join(" ").trim() || "—"}
								</td>

								<td className="px-3 py-4">{providerBadge(t.provider)}</td>

								{/* Stellar TX Hash */}
								<td className="px-3 py-4">
									{t.stellarTxHash ? (
										<div className="flex items-center gap-1.5">
											<span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
												{truncateHash(t.stellarTxHash)}
											</span>
											<button
												onClick={() => handleCopy(t.stellarTxHash!)}
												className="text-gray-400 hover:text-gray-600 transition-colors"
												title="Copy full hash"
											>
												<Copy size={12} />
											</button>
											<a
												href={`${STELLAR_EXPLORER_BASE}/${t.stellarTxHash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-400 hover:text-blue-600 transition-colors"
												title="View on Stellar Explorer"
											>
												<ExternalLink size={12} />
											</a>
										</div>
									) : (
										<span className="text-gray-300 text-xs">—</span>
									)}
								</td>

								<td className="px-3 py-4 max-w-[180px]">
									<span className="block font-medium capitalize text-xs text-gray-400 mb-0.5">{t.type}</span>
									<span className="text-gray-600 text-xs">
										{t.description
											? t.description.length > 45 ? t.description.slice(0, 45) + "…" : t.description
											: "—"}
									</span>
								</td>

								<td className="px-3 py-4">{payoutStatusBadge(t.payoutStatus)}</td>

								<td className="px-3 py-4">
									{t.payoutStatus !== "paid" && t.payoutStatus !== "completed" ? (
										<PayoutActions
											index={index}
											openIndex={openIndex}
											setOpenIndex={setOpenIndex}
											onActivate={() => {
												setUniqueId(t.id ?? "");
												setSelectedTransaction(t);
												setActivateOpen(true);
											}}
										/>
									) : (
										<span className="text-gray-300 text-xs px-2">—</span>
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
