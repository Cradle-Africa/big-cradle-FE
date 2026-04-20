"use client";

import { PaginationMeta, InflowTransactionRow, TransactionProvider } from "@/app/lib/type";
import Pagination from "./Pagination";
import { Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

type InFlowTableProps = {
	transactionsData?: InflowTransactionRow[];
	pagination: PaginationMeta;
	onPageChange: (newPage: number) => void;
	onLimitChange: (newLimit: number) => void;
};

function paymentStatusBadge(status: string) {
	const s = status?.toLowerCase() ?? "";
	const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap";
	switch (s) {
		case "paid": return <span className={`${base} border-green-200 text-green-700 bg-green-50`}>● Paid</span>;
		case "pending": return <span className={`${base} border-amber-200 text-amber-700 bg-amber-50`}>◑ Pending</span>;
		case "failed": return <span className={`${base} border-red-200 text-red-700 bg-red-50`}>✕ Failed</span>;
		case "not-paid": return <span className={`${base} border-gray-200 text-gray-600 bg-gray-50`}>○ Not paid</span>;
		default: return <span className={`${base} border-gray-200 text-gray-500 bg-white`}>{status ?? "—"}</span>;
	}
}

function providerBadge(provider?: TransactionProvider | string) {
	const base = "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold";
	switch (provider) {
		case "flutterwave": return <span className={`${base} bg-orange-50 text-orange-700 border border-orange-200`}>Flutterwave</span>;
		case "kuvarpay":   return <span className={`${base} bg-purple-50 text-purple-700 border border-purple-200`}>KuvarPay</span>;
		case "stellar":    return <span className={`${base} bg-blue-50 text-blue-700 border border-blue-200`}>Stellar</span>;
		case "internal":   return <span className={`${base} bg-gray-50 text-gray-600 border border-gray-200`}>Internal</span>;
		default:           return <span className={`${base} bg-gray-50 text-gray-500 border border-gray-200`}>{provider ?? "—"}</span>;
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
		return (
			<div className="mt-5 flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
				<p className="text-sm font-medium">No inflow transactions found</p>
				<p className="text-xs mt-1">Try adjusting your filters</p>
			</div>
		);
	}

	const handleCopy = async (text: string, label: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(`${label} copied!`);
		} catch {
			toast.error("Failed to copy.");
		}
	};

	return (
		<>
			<div className="w-full max-w-full overflow-x-auto rounded-xl border border-gray-200 mt-5 shadow-sm">
				<table className="min-w-max w-full table-auto divide-y divide-gray-100 bg-white">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount (BCC)</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Original Amount</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Rate</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Provider</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Counterparty</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-50 text-sm text-gray-700">
						{transactionsData.map((t, index) => (
							<tr key={t.id} className="hover:bg-blue-50/30 transition-colors">
								<td className="px-4 py-4 text-gray-400 font-medium text-xs">{index + 1}</td>
								<td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
									{new Date(t.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
									<span className="block text-gray-400">{new Date(t.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
								</td>

								{/* BCC amount — primary */}
								<td className="px-4 py-4 font-semibold text-gray-900 whitespace-nowrap">
									{t.amountBCC != null
										? <>{t.amountBCC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal text-blue-600">BCC</span></>
										: <>{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal text-blue-600">BCC</span></>
									}
								</td>

								{/* Original amount in local currency */}
								<td className="px-4 py-4 whitespace-nowrap">
									{t.originalAmount != null && t.originalCurrency
										? <span className="text-gray-600">{t.originalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs text-gray-400">{t.originalCurrency}</span></span>
										: <span className="text-gray-300">—</span>
									}
								</td>

								{/* Exchange rate */}
								<td className="px-4 py-4 whitespace-nowrap">
									{t.exchangeRateAtTime != null
										? <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-mono">1 USD = {t.exchangeRateAtTime.toFixed(2)} {t.originalCurrency ?? ""}</span>
										: <span className="text-gray-300">—</span>
									}
								</td>

								<td className="px-4 py-4">{providerBadge(t.provider)}</td>

								<td className="px-4 py-4 max-w-[180px]">
									<span className="block truncate text-gray-700">{counterpartyLabel(t)}</span>
								</td>

								<td className="px-4 py-4 max-w-[200px]">
									<span className="block font-medium capitalize text-xs text-gray-400 mb-0.5">{t.type}</span>
									<span className="text-gray-600 text-xs">
										{t.description
											? t.description.length > 50 ? t.description.slice(0, 50) + "…" : t.description
											: "—"}
									</span>
								</td>

								<td className="px-4 py-4">{paymentStatusBadge(t.paymentStatus)}</td>
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
