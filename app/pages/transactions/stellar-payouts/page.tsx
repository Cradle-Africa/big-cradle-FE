"use client";

import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { PayoutCycle, PayoutCycleStatus, PayoutRequest, PayoutRequestStatus, PayoutStats } from "@/app/lib/type";
import {
	fetchCurrentCycle,
	fetchFailedPayouts,
	fetchPayoutCycles,
	fetchPayoutStats,
	fetchPendingPayouts,
	retryFailedPayouts,
	triggerDisbursement,
} from "../_features/api";
import { useEffect, useState } from "react";
import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	Copy,
	ExternalLink,
	Loader2,
	RefreshCw,
	Satellite,
	Send,
	XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateHash(hash: string): string {
	if (!hash || hash.length <= 16) return hash ?? "—";
	return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
}

function copyToClipboard(text: string, label = "Copied!") {
	navigator.clipboard.writeText(text).then(() => toast.success(label)).catch(() => toast.error("Failed to copy."));
}

function cycleBadge(status: PayoutCycleStatus) {
	const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border";
	switch (status) {
		case "open":             return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}><span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />Open</span>;
		case "processing":       return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />Processing</span>;
		case "completed":        return <span className={`${base} bg-green-50 text-green-700 border-green-200`}><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Completed</span>;
		case "partially_failed": return <span className={`${base} bg-orange-50 text-orange-700 border-orange-200`}><span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />Partial</span>;
		case "failed":           return <span className={`${base} bg-red-50 text-red-700 border-red-200`}><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />Failed</span>;
	}
}

function requestBadge(status: PayoutRequestStatus) {
	const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border";
	switch (status) {
		case "pending":    return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>Pending</span>;
		case "locked":     return <span className={`${base} bg-indigo-50 text-indigo-700 border-indigo-200`}>Locked</span>;
		case "processing": return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>Processing</span>;
		case "completed":  return <span className={`${base} bg-green-50 text-green-700 border-green-200`}>Completed</span>;
		case "failed":     return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>Failed</span>;
		case "cancelled":  return <span className={`${base} bg-gray-50 text-gray-600 border-gray-200`}>Cancelled</span>;
	}
}

function formatDate(d?: string): string {
	if (!d) return "—";
	return new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, color }: {
	label: string; value: string | number; sub?: string;
	icon: React.ReactNode; color: string;
}) {
	return (
		<div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4`}>
			<div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
				{icon}
			</div>
			<div>
				<p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
				<p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
				{sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
			</div>
		</div>
	);
}

// ─── Requests Table ───────────────────────────────────────────────────────────

function RequestsTable({ requests, selectable, selected, onSelect }: {
	requests: PayoutRequest[];
	selectable?: boolean;
	selected?: Set<string>;
	onSelect?: (id: string, checked: boolean) => void;
}) {
	if (!requests.length) {
		return (
			<div className="flex flex-col items-center justify-center py-10 text-gray-400">
				<p className="text-sm">No requests to display</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-xl border border-gray-100">
			<table className="min-w-max w-full table-auto divide-y divide-gray-50 bg-white text-sm">
				<thead>
					<tr className="bg-gray-50">
						{selectable && <th className="px-4 py-3 w-8" />}
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Researcher ID</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Stellar TX</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Failure Reason</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Requested</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-50">
					{requests.map((r) => (
						<tr key={r._id} className={`hover:bg-blue-50/20 transition-colors ${selected?.has(r._id) ? "bg-blue-50/40" : ""}`}>
							{selectable && (
								<td className="px-4 py-3">
									<input
										type="checkbox"
										checked={selected?.has(r._id) ?? false}
										onChange={(e) => onSelect?.(r._id, e.target.checked)}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
								</td>
							)}
							<td className="px-4 py-3 font-mono text-xs text-gray-500">{truncateHash(r.researcherId)}</td>
							<td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
								{r.amountBCC.toLocaleString(undefined, { minimumFractionDigits: 2 })}
								{" "}<span className="text-xs font-normal text-blue-600">BCC</span>
							</td>
							<td className="px-4 py-3 text-gray-600 text-xs">{r.phoneNumber}</td>
							<td className="px-4 py-3">{requestBadge(r.status)}</td>
							<td className="px-4 py-3">
								{r.stellarTransactionHash ? (
									<div className="flex items-center gap-1.5">
										<span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
											{truncateHash(r.stellarTransactionHash)}
										</span>
										<button onClick={() => copyToClipboard(r.stellarTransactionHash!, "Hash copied!")} className="text-gray-400 hover:text-gray-600">
											<Copy size={12} />
										</button>
										<a
											href={`https://stellar.expert/explorer/testnet/tx/${r.stellarTransactionHash}`}
											target="_blank" rel="noopener noreferrer"
											className="text-blue-400 hover:text-blue-600"
										>
											<ExternalLink size={12} />
										</a>
									</div>
								) : <span className="text-gray-300 text-xs">—</span>}
							</td>
							<td className="px-4 py-3 max-w-[180px]">
								{r.failureReason
									? <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">{r.failureReason.slice(0, 60)}</span>
									: <span className="text-gray-300 text-xs">—</span>}
							</td>
							<td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(r.requestedAt)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = ["Overview", "Cycles", "Pending", "Failed"] as const;
type Tab = typeof TABS[number];

export default function StellarPayoutsPage() {
	const [activeTab, setActiveTab] = useState<Tab>("Overview");
	const [stats, setStats] = useState<PayoutStats | null>(null);
	const [currentCycle, setCurrentCycle] = useState<PayoutCycle | null>(null);
	const [cycles, setCycles] = useState<PayoutCycle[]>([]);
	const [pendingRequests, setPendingRequests] = useState<PayoutRequest[]>([]);
	const [failedRequests, setFailedRequests] = useState<PayoutRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [disbursing, setDisbursing] = useState(false);
	const [retrying, setRetrying] = useState(false);
	const [selectedFailed, setSelectedFailed] = useState<Set<string>>(new Set());
	const [expandedCycleId, setExpandedCycleId] = useState<string | null>(null);

	const load = async () => {
		setLoading(true);
		try {
			const [s, cc, cy, pend, fail] = await Promise.all([
				fetchPayoutStats(axios),
				fetchCurrentCycle(axios),
				fetchPayoutCycles(axios, { limit: 20 }),
				fetchPendingPayouts(axios, { limit: 50 }),
				fetchFailedPayouts(axios, { limit: 50 }),
			]);
			setStats(s);
			setCurrentCycle(cc);
			setCycles(cy.data);
			setPendingRequests(pend.data);
			setFailedRequests(fail.data);
		} catch (e: any) {
			toast.error(e?.message ?? "Failed to load data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, []);

	const handleDisburse = async () => {
		if (!confirm("Trigger a manual disbursement now? This will process all pending payout requests immediately.")) return;
		setDisbursing(true);
		try {
			await triggerDisbursement(axios);
			toast.success("Disbursement triggered successfully!");
			load();
		} catch (e: any) {
			toast.error(e?.message ?? "Disbursement failed");
		} finally {
			setDisbursing(false);
		}
	};

	const handleRetry = async () => {
		if (!selectedFailed.size) { toast.error("Select at least one failed request"); return; }
		setRetrying(true);
		try {
			const { queued } = await retryFailedPayouts(axios, Array.from(selectedFailed));
			toast.success(`${queued} request(s) re-queued for next cycle`);
			setSelectedFailed(new Set());
			load();
		} catch (e: any) {
			toast.error(e?.message ?? "Retry failed");
		} finally {
			setRetrying(false);
		}
	};

	const toggleFailedSelect = (id: string, checked: boolean) => {
		setSelectedFailed((prev) => {
			const next = new Set(prev);
			checked ? next.add(id) : next.delete(id);
			return next;
		});
	};

	return (
		<DashboardLayout>
			<div className="p-6 max-w-7xl mx-auto">

				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
							<Satellite size={20} className="text-white" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">Stellar Payouts</h1>
							<p className="text-sm text-gray-500">Researcher BCC disbursements via Stellar network</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={load}
							disabled={loading}
							className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
						>
							<RefreshCw size={14} className={loading ? "animate-spin" : ""} />
							Refresh
						</button>
						<button
							onClick={handleDisburse}
							disabled={disbursing || loading}
							className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-60"
						>
							{disbursing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
							Trigger Disbursement
						</button>
					</div>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-32 text-gray-400">
						<Loader2 size={28} className="animate-spin mr-3" />
						<span>Loading payout data…</span>
					</div>
				) : (
					<>
						{/* Stats Row */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							<StatCard label="Pending" value={stats?.pending ?? 0} icon={<Clock size={18} className="text-amber-600" />} color="bg-amber-50" />
							<StatCard label="Processing" value={stats?.processing ?? 0} icon={<Loader2 size={18} className="text-blue-600" />} color="bg-blue-50" />
							<StatCard label="Completed" value={stats?.completed ?? 0} sub={`${stats?.totalDisbursedBCC?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "0.00"} BCC total`} icon={<CheckCircle2 size={18} className="text-green-600" />} color="bg-green-50" />
							<StatCard label="Failed" value={stats?.failed ?? 0} icon={<XCircle size={18} className="text-red-600" />} color="bg-red-50" />
						</div>

						{/* Current Cycle Banner */}
						{currentCycle && (
							<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-5 mb-6 shadow-md">
								<div className="flex items-center justify-between flex-wrap gap-4">
									<div>
										<p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">Current Cycle</p>
										<p className="text-2xl font-bold">{currentCycle.cycleKey}</p>
										<div className="flex items-center gap-3 mt-2 text-sm text-blue-100">
											<span>Cutoff: {formatDate(currentCycle.cutoffTime)}</span>
											<span>·</span>
											<span>Disburse: {formatDate(currentCycle.disbursementDate)}</span>
										</div>
									</div>
									<div className="flex items-center gap-6 text-center">
										<div>
											<p className="text-2xl font-bold">{currentCycle.totalRequests}</p>
											<p className="text-blue-200 text-xs">Requests</p>
										</div>
										<div>
											<p className="text-2xl font-bold">{currentCycle.totalAmountBCC.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
											<p className="text-blue-200 text-xs">BCC Queued</p>
										</div>
										<div>{cycleBadge(currentCycle.status)}</div>
									</div>
								</div>
							</div>
						)}

						{/* Tabs */}
						<div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
							{TABS.map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										activeTab === tab
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									{tab}
									{tab === "Pending" && pendingRequests.length > 0 && (
										<span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{pendingRequests.length}</span>
									)}
									{tab === "Failed" && failedRequests.length > 0 && (
										<span className="ml-1.5 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">{failedRequests.length}</span>
									)}
								</button>
							))}
						</div>

						{/* Tab: Overview */}
						{activeTab === "Overview" && (
							<div className="space-y-4">
								<h2 className="text-base font-semibold text-gray-800">Recent Cycles</h2>
								{cycles.length === 0 ? (
									<p className="text-gray-400 text-sm py-8 text-center">No cycles yet</p>
								) : (
									<div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
										<table className="min-w-max w-full table-auto divide-y divide-gray-50 bg-white text-sm">
											<thead>
												<tr className="bg-gray-50">
													<th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Cycle</th>
													<th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
													<th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Requests</th>
													<th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total BCC</th>
													<th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Success / Failed</th>
													<th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Triggered by</th>
													<th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Disbursement Date</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-50">
												{cycles.map((c) => (
													<tr key={c._id} className="hover:bg-blue-50/20 transition-colors">
														<td className="px-5 py-4 font-semibold text-gray-800">{c.cycleKey}</td>
														<td className="px-5 py-4">{cycleBadge(c.status)}</td>
														<td className="px-5 py-4 text-gray-700">{c.totalRequests}</td>
														<td className="px-5 py-4 font-semibold text-gray-900">
															{c.totalAmountBCC.toLocaleString(undefined, { minimumFractionDigits: 2 })}
															{" "}<span className="text-xs font-normal text-blue-600">BCC</span>
														</td>
														<td className="px-5 py-4">
															<span className="text-green-600 font-medium">{c.successCount}</span>
															<span className="text-gray-300 mx-1">/</span>
															<span className="text-red-500 font-medium">{c.failureCount}</span>
														</td>
														<td className="px-5 py-4 text-xs text-gray-500">{c.triggeredBy}</td>
														<td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{formatDate(c.disbursementDate)}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						)}

						{/* Tab: Cycles detail */}
						{activeTab === "Cycles" && (
							<div className="space-y-3">
								{cycles.map((c) => (
									<div key={c._id} className="border border-gray-100 rounded-xl shadow-sm overflow-hidden">
										<button
											onClick={() => setExpandedCycleId(expandedCycleId === c._id ? null : c._id)}
											className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
										>
											<div className="flex items-center gap-3">
												<span className="font-semibold text-gray-800">{c.cycleKey}</span>
												{cycleBadge(c.status)}
											</div>
											<div className="flex items-center gap-6 text-sm text-gray-500">
												<span>{c.totalRequests} requests</span>
												<span className="font-semibold text-gray-800">{c.totalAmountBCC.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-blue-600">BCC</span></span>
												<span className={`transition-transform ${expandedCycleId === c._id ? "rotate-180" : ""}`}>▾</span>
											</div>
										</button>
										{expandedCycleId === c._id && (
											<div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">
												<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
													<div><p className="text-gray-400 text-xs">Cutoff</p><p className="font-medium text-gray-700">{formatDate(c.cutoffTime)}</p></div>
													<div><p className="text-gray-400 text-xs">Triggered</p><p className="font-medium text-gray-700">{formatDate(c.disbursementTriggeredAt)}</p></div>
													<div><p className="text-gray-400 text-xs">Completed</p><p className="font-medium text-gray-700">{formatDate(c.completedAt)}</p></div>
													<div><p className="text-gray-400 text-xs">SDP Disbursement ID</p><p className="font-mono text-xs text-gray-600">{c.sdpDisbursementId ?? "—"}</p></div>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						)}

						{/* Tab: Pending */}
						{activeTab === "Pending" && (
							<div>
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-base font-semibold text-gray-800">
										Pending Requests <span className="ml-2 text-sm text-gray-400 font-normal">({pendingRequests.length})</span>
									</h2>
								</div>
								{pendingRequests.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
										<CheckCircle2 size={32} className="mb-2 text-green-300" />
										<p className="text-sm font-medium">No pending requests</p>
										<p className="text-xs mt-1">All caught up!</p>
									</div>
								) : (
									<RequestsTable requests={pendingRequests} />
								)}
							</div>
						)}

						{/* Tab: Failed */}
						{activeTab === "Failed" && (
							<div>
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-base font-semibold text-gray-800">
										Failed Requests <span className="ml-2 text-sm text-gray-400 font-normal">({failedRequests.length})</span>
									</h2>
									{failedRequests.length > 0 && (
										<button
											onClick={handleRetry}
											disabled={!selectedFailed.size || retrying}
											className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
										>
											{retrying ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
											Re-queue Selected ({selectedFailed.size})
										</button>
									)}
								</div>
								{failedRequests.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
										<CheckCircle2 size={32} className="mb-2 text-green-300" />
										<p className="text-sm font-medium">No failed requests</p>
									</div>
								) : (
									<>
										<div className="flex items-center gap-2 mb-3 text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
											<AlertTriangle size={14} className="text-amber-500" />
											Select failed requests and click Re-queue to include them in the next Friday disbursement cycle.
										</div>
										<RequestsTable
											requests={failedRequests}
											selectable
											selected={selectedFailed}
											onSelect={toggleFailedSelect}
										/>
									</>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</DashboardLayout>
	);
}
