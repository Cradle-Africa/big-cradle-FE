'use client';

import { WalletTransactionList } from "@/app/lib/type";
import WalletActions from "./WalletActions";
import { useState } from "react";
import TransactionModal from "./TransactionModal";
import { Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

type TransactionsTableProps = {
	transactionsData?: WalletTransactionList[];
};

function statusBadge(status: string) {
	const s = status?.toLowerCase() ?? "";
	const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap";
	switch (s) {
		case "paid":
		case "completed": return <span className={`${base} border-green-200 text-green-700 bg-green-50`}>● Paid</span>;
		case "pending":   return <span className={`${base} border-amber-200 text-amber-700 bg-amber-50`}>◑ Pending</span>;
		case "failed":    return <span className={`${base} border-red-200 text-red-700 bg-red-50`}>✕ Failed</span>;
		case "not-paid":
		case "not paid":  return <span className={`${base} border-gray-200 text-gray-600 bg-gray-50`}>○ Not paid</span>;
		default:          return <span className={`${base} border-gray-200 text-gray-500 bg-white capitalize`}>{status ?? "—"}</span>;
	}
}

function truncateHash(hash: string): string {
	if (hash.length <= 16) return hash;
	return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
}

const STELLAR_EXPLORER_BASE = "https://stellar.expert/explorer/testnet/tx";

const TransactionsTable = ({ transactionsData = [] }: TransactionsTableProps) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [selectedTransaction, setSelectedTransaction] = useState<WalletTransactionList | null>(null);
	const [completePayment, setCompletePayment] = useState(false);

	if (!transactionsData.length) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl mt-5">
				<p className="text-sm font-medium">No transactions yet</p>
				<p className="text-xs mt-1">Your transaction history will appear here</p>
			</div>
		);
	}

	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Copied to clipboard!");
		} catch {
			toast.error("Failed to copy.");
		}
	};

	return (
		<div className="overflow-x-auto rounded-xl border border-gray-200 mt-5 shadow-sm">
			<table className="min-w-full table-auto divide-y divide-gray-100 bg-white">
				<thead>
					<tr className="bg-gray-50">
						<th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
						<th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
						<th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
						<th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type & Description</th>
						<th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Blockchain TX</th>
						<th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
						<th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
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

							{/* Amount with BCC label and original currency hint */}
							<td className="px-6 py-4 whitespace-nowrap">
								<p className="font-semibold text-gray-900">
									{(t.amountBCC ?? t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
									{" "}<span className="text-xs font-normal text-blue-600">BCC</span>
								</p>
								{t.originalAmount != null && t.originalCurrency && (
									<p className="text-xs text-gray-400 mt-0.5">
										≈ {t.originalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {t.originalCurrency}
									</p>
								)}
							</td>

							<td className="px-6 py-4 max-w-[220px]">
								<span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mb-1 capitalize ${
									t.type === "credit" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
								}`}>
									{t.type}
								</span>
								<p className="text-gray-500 text-xs">
									{t.description
										? t.description.length > 55 ? t.description.slice(0, 55) + "…" : t.description
										: "—"}
								</p>
							</td>

							{/* Stellar TX Hash — only shown for Stellar payout rows */}
							<td className="px-6 py-4">
								{t.stellarTxHash ? (
									<div className="flex items-center gap-1.5">
										<span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
											{truncateHash(t.stellarTxHash)}
										</span>
										<button
											onClick={() => handleCopy(t.stellarTxHash!)}
											className="text-gray-400 hover:text-gray-600 transition-colors"
											title="Copy hash"
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

							<td className="px-6 py-4">{statusBadge(t.paymentStatus)}</td>

							<td className="px-6 py-4">
								<WalletActions
									index={index}
									openIndex={openIndex}
									setOpenIndex={setOpenIndex}
									paymentStatus={t.paymentStatus}
									setSelectedTransaction={() => {
										setSelectedTransaction(t);
										setCompletePayment(true);
									}}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{completePayment && selectedTransaction && (
				<TransactionModal
					transaction={selectedTransaction}
					setOpen={setCompletePayment}
					completeTransaction={true}
				/>
			)}
		</div>
	);
};

export default TransactionsTable;
