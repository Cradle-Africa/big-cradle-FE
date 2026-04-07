"use client";

import DashboardLayout from "@/app/DashboardLayout";
import { Spinner } from "@radix-ui/themes";
import axios from "@/app/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { usePayoutSummary, usePayoutTransactions } from "../_features/hook";
import PayoutFlowTable from "./components/PayoutflowTable";
import { ArrowLeftRight, ArrowUpDown, LayoutGrid, SlidersHorizontal, Wallet, X } from "lucide-react";

const PAYOUT_STATUSES = ["not-paid", "paid"] as const;
type PayoutFilterStatus = (typeof PAYOUT_STATUSES)[number];

function toISODateOnly(value: string): string | undefined {
	if (!value?.trim()) return undefined;
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

function formatDateRange(startISO: string | undefined, endISO: string | undefined): string {
	if (!startISO && !endISO) return "All time";
	if (startISO && endISO) {
		const start = new Date(startISO).toLocaleDateString(undefined, {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
		const end = new Date(endISO).toLocaleDateString(undefined, {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
		return `${start} – ${end}`;
	}
	if (startISO)
		return `From ${new Date(startISO).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
	if (endISO)
		return `Until ${new Date(endISO).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
	return "All time";
}

function formatAmount(value: number): string {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

const Page = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedStatuses, setSelectedStatuses] = useState<Set<PayoutFilterStatus>>(new Set());
	const [paymentTypeDraft, setPaymentTypeDraft] = useState("");
	const [paymentType, setPaymentType] = useState("");
	const [researcherNameDraft, setResearcherNameDraft] = useState("");
	const [researcherName, setResearcherName] = useState("");
	const [sortBy, setSortBy] = useState<"createdAt" | "amount">("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [sortOpen, setSortOpen] = useState(false);

	const startISO = toISODateOnly(startDate);
	const endISO = toISODateOnly(endDate);
	const dateError =
		startISO && endISO && new Date(startISO) > new Date(endISO)
			? "End date must be on or after start date."
			: null;

	const payoutStatusComma =
		selectedStatuses.size > 0 && selectedStatuses.size < PAYOUT_STATUSES.length
			? [...selectedStatuses].join(",")
			: undefined;

	const summaryQueryParams = useMemo(
		() => ({
			startDate: dateError ? undefined : startISO,
			endDate: dateError ? undefined : endISO,
			payoutStatus: payoutStatusComma,
			paymentType: paymentType.trim() || undefined,
			researcherName: researcherName.trim() || undefined,
		}),
		[startISO, endISO, dateError, payoutStatusComma, paymentType, researcherName]
	);

	const listQueryParams = useMemo(
		() => ({
			...summaryQueryParams,
			page,
			limit: Math.min(100, limit),
			sortBy,
			sortOrder,
		}),
		[summaryQueryParams, page, limit, sortBy, sortOrder]
	);

	// Debounce text search (payment type + researcher) to avoid refetching on every keystroke.
	useEffect(() => {
		const t = window.setTimeout(() => {
			setPaymentType(paymentTypeDraft);
			setPage(1);
		}, 600);
		return () => window.clearTimeout(t);
	}, [paymentTypeDraft]);

	useEffect(() => {
		const t = window.setTimeout(() => {
			setResearcherName(researcherNameDraft);
			setPage(1);
		}, 600);
		return () => window.clearTimeout(t);
	}, [researcherNameDraft]);

	const enabled = !dateError;

	const summary = usePayoutSummary({ axios, queryParams: summaryQueryParams, enabled });
	const list = usePayoutTransactions({ axios, queryParams: listQueryParams, enabled });

	const isError = summary.isError || list.isError;
	const errorMessage =
		summary.error?.message || list.error?.message || "An error occurred.";

	const isBootstrapping =
		(summary.isPending || list.isPending) && !summary.isError && !list.isError;

	const pagination = {
		page: list.data?.pagination.page ?? page,
		limit: list.data?.pagination.limit ?? limit,
		total: list.data?.pagination.total ?? 0,
		pages: list.data?.pagination.pages ?? 0,
	};

	const toggleStatus = (s: PayoutFilterStatus) => {
		setSelectedStatuses((prev) => {
			const next = new Set(prev);
			if (next.has(s)) next.delete(s);
			else next.add(s);
			return next;
		});
		setPage(1);
	};

	const clearFilters = () => {
		setStartDate("");
		setEndDate("");
		setSelectedStatuses(new Set());
		setPaymentTypeDraft("");
		setPaymentType("");
		setResearcherNameDraft("");
		setResearcherName("");
		setSortBy("createdAt");
		setSortOrder("desc");
		setPage(1);
	};

	const clearFilterGroup = () => {
		setSelectedStatuses(new Set());
		setPaymentTypeDraft("");
		setPaymentType("");
		setResearcherNameDraft("");
		setResearcherName("");
		setPage(1);
	};

	const clearSortGroup = () => {
		setStartDate("");
		setEndDate("");
		setSortBy("createdAt");
		setSortOrder("desc");
		setPage(1);
	};

	const selectAllStatuses = () => {
		setSelectedStatuses(new Set());
		setPage(1);
	};

	const activeFilterCriteriaCount =
		(selectedStatuses.size > 0 ? 1 : 0) +
		(paymentType.trim() ? 1 : 0) +
		(researcherName.trim() ? 1 : 0);

	const activeSortCriteriaCount =
		(startDate.trim() || endDate.trim() ? 1 : 0) +
		(sortBy !== "createdAt" ? 1 : 0) +
		(sortOrder !== "desc" ? 1 : 0);

	const isAnyActive = activeFilterCriteriaCount > 0 || activeSortCriteriaCount > 0;

	if (isBootstrapping) {
		return (
			<DashboardLayout>
				<div className="flex justify-center items-center min-h-[200px]">
					<Spinner size="3" />
				</div>
			</DashboardLayout>
		);
	}

	const s = summary.data;

	return (
		<DashboardLayout>
			<div className="w-full mt-5">
				<div className="mb-4">
					<h2 className="font-bold text-lg text-black">Payout transactions</h2>
					<p className="text-gray-600 text-sm mt-1">
						Outflows to researchers and businesses. Summary and table share the same filters.
					</p>
				</div>

				{!isError && (
					<section className="mt-6" aria-label="Summary">
						{s?.totals ? (
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm">
									<div className="flex items-center gap-2 text-gray-500 mb-1">
										<LayoutGrid size={18} aria-hidden />
										<span className="text-sm font-medium">Total</span>
									</div>
									<p className="text-xl font-semibold text-gray-900">
										{(s.totals.count ?? 0).toLocaleString()} payout
										{(s.totals.count ?? 0) !== 1 ? "s" : ""}
									</p>
									<p className="text-sm text-gray-600 mt-1">
										Amount: {formatAmount(s.totals.totalAmount ?? 0)}
									</p>
								</div>
								<div className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm">
									<div className="flex items-center gap-2 text-gray-500 mb-1">
										<Wallet size={18} aria-hidden />
										<span className="text-sm font-medium">By status</span>
									</div>
									<ul className="text-sm text-gray-700 space-y-1 mt-1">
										{s.byStatus?.map((row) => (
											<li key={row.payoutStatus} className="capitalize">
												<span className="font-medium">{row.payoutStatus.replace("-", " ")}</span>:{" "}
												{row.count.toLocaleString()} · {formatAmount(row.totalAmount)}
											</li>
										))}
									</ul>
									<p className="text-xs text-gray-500 mt-2">
										Counts — Paid: {(s.counts?.paid ?? 0).toLocaleString()} · Not paid:{" "}
										{(s.counts?.notPaid ?? 0).toLocaleString()}
									</p>
								</div>
								<div className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm">
									<div className="flex items-center gap-2 text-gray-500 mb-1">
										<ArrowLeftRight size={18} aria-hidden />
										<span className="text-sm font-medium">By payment type</span>
									</div>
									{s.byPaymentType?.length ? (
										<ul className="text-sm text-gray-700 space-y-1 mt-1 max-h-28 overflow-y-auto">
											{s.byPaymentType.map((row) => (
												<li key={row.paymentType}>
													<span className="font-medium">{row.paymentType || "—"}</span>:{" "}
													{row.count.toLocaleString()} · {formatAmount(row.totalAmount)}
												</li>
											))}
										</ul>
									) : (
										<p className="text-sm text-gray-500 mt-1">No breakdown</p>
									)}
								</div>
							</div>
						) : (
							<div className="rounded-[8px] border border-gray-200 bg-gray-50 p-4">
								<p className="text-sm text-gray-500">No summary data for this range.</p>
							</div>
						)}
					</section>
				)}

				<section
					className="mt-6 p-4 rounded-[8px] border border-gray-200 bg-gray-50"
					aria-label="Filters and sort"
				>
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={() => setFiltersOpen(true)}
								className="flex items-center gap-2 px-3 py-2 text-sm rounded-[8px] border border-gray-300 bg-white hover:bg-gray-100 font-medium"
							>
								<SlidersHorizontal size={16} aria-hidden />
								Filters
								{activeFilterCriteriaCount > 0 && (
									<span className="inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-full bg-[#004484] text-white text-xs font-semibold">
										{activeFilterCriteriaCount}
									</span>
								)}
							</button>
							<button
								type="button"
								onClick={() => setSortOpen(true)}
								className="flex items-center gap-2 px-3 py-2 text-sm rounded-[8px] border border-gray-300 bg-white hover:bg-gray-100 font-medium"
							>
								<ArrowUpDown size={16} aria-hidden />
								Sort & Date
								{activeSortCriteriaCount > 0 && (
									<span className="inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-full bg-[#004484] text-white text-xs font-semibold">
										{activeSortCriteriaCount}
									</span>
								)}
							</button>
						</div>

						<div className="flex items-center gap-2">
							{isAnyActive && (
								<button
									type="button"
									onClick={() => {
										clearFilters();
										setFiltersOpen(false);
										setSortOpen(false);
									}}
									className="flex items-center gap-2 px-3 py-2 text-sm rounded-[8px] border border-gray-300 bg-white hover:bg-gray-100 font-medium"
								>
									<X size={14} aria-hidden />
									Clear
								</button>
							)}
							<input
								type="search"
								value={researcherNameDraft}
								onChange={(e) => {
									setResearcherNameDraft(e.target.value);
								}}
								placeholder="Search researcher"
								aria-label="Search researcher"
								className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white w-[260px] max-w-full"
							/>
						</div>
					</div>

					{/* Filters modal */}
					{filtersOpen && (
						<div className="fixed inset-0 z-50">
							<div
								className="fixed inset-0 bg-[#0000004D] bg-opacity-30"
								onClick={() => setFiltersOpen(false)}
								aria-hidden
							/>
							<div className="relative bg-white w-full max-w-xl mx-auto mt-[10vh] rounded-[8px] shadow-lg border border-gray-200 p-6 overflow-y-auto max-h-[80vh]">
								<div className="flex items-start justify-between gap-4">
									<div>
										<h3 className="text-base sm:text-lg font-semibold text-black">Filters</h3>
										<p className="text-sm text-gray-600 mt-1">Status and payment type filters.</p>
									</div>
									<button
										type="button"
										onClick={() => setFiltersOpen(false)}
										className="p-2 rounded-[8px] hover:bg-gray-100"
										aria-label="Close filters"
									>
										<X size={16} aria-hidden />
									</button>
								</div>

								<div className="mt-5 space-y-5">
									<div>
										<span className="block text-sm font-medium text-gray-700 mb-2">Payout status</span>
										<div className="grid grid-cols-2 gap-2">
											{PAYOUT_STATUSES.map((st) => (
												<label
													key={st}
													className="inline-flex items-center gap-2 text-sm text-gray-700"
												>
													<input
														type="checkbox"
														checked={selectedStatuses.has(st)}
														onChange={() => toggleStatus(st)}
														className="rounded border-gray-300"
													/>
													<span className="capitalize">{st.replace("-", " ")}</span>
												</label>
											))}
										</div>
										<button
											type="button"
											onClick={selectAllStatuses}
											className="mt-3 text-sm text-[#004484] font-medium hover:underline"
										>
											All statuses
										</button>
									</div>

									<div>
										<label htmlFor="payout-type-modal" className="block text-sm font-medium text-gray-700 mb-1">
											Payment type
										</label>
										<input
											id="payout-type-modal"
											type="search"
											value={paymentTypeDraft}
											onChange={(e) => {
												setPaymentTypeDraft(e.target.value);
											}}
											placeholder="Contains…"
											className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white w-full"
										/>
									</div>
								</div>

								<div className="mt-6 flex justify-end gap-2">
									<button
										type="button"
										onClick={clearFilterGroup}
										className="px-3 py-2 text-sm rounded-[8px] border border-gray-300 bg-white hover:bg-gray-100 font-medium"
									>
										Reset filters
									</button>
									<button
										type="button"
										onClick={() => setFiltersOpen(false)}
										className="px-3 py-2 text-sm rounded-[8px] bg-[#004484] text-white hover:bg-[#003366] font-medium"
									>
										Done
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Sort & date modal */}
					{sortOpen && (
						<div className="fixed inset-0 z-50">
							<div
								className="fixed inset-0 bg-[#0000004D] bg-opacity-30"
								onClick={() => setSortOpen(false)}
								aria-hidden
							/>
							<div className="relative bg-white w-full max-w-xl mx-auto mt-[10vh] rounded-[8px] shadow-lg border border-gray-200 p-6 overflow-y-auto max-h-[80vh]">
								<div className="flex items-start justify-between gap-4">
									<div>
										<h3 className="text-base sm:text-lg font-semibold text-black">Sort & Date</h3>
										<p className="text-sm text-gray-600 mt-1">Ordering and date range.</p>
									</div>
									<button
										type="button"
										onClick={() => setSortOpen(false)}
										className="p-2 rounded-[8px] hover:bg-gray-100"
										aria-label="Close sort and date"
									>
										<X size={16} aria-hidden />
									</button>
								</div>

								<div className="mt-5 space-y-5">
									<div>
										<label htmlFor="payout-sort-by-modal" className="block text-sm font-medium text-gray-700 mb-1">
											Sort by
										</label>
										<select
											id="payout-sort-by-modal"
											value={sortBy}
											onChange={(e) => {
												setSortBy(e.target.value as "createdAt" | "amount");
												setPage(1);
											}}
											className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white w-full"
										>
											<option value="createdAt">Date</option>
											<option value="amount">Amount</option>
										</select>

										<label htmlFor="payout-sort-order-modal" className="block text-sm font-medium text-gray-700 mt-3 mb-1">
											Order
										</label>
										<select
											id="payout-sort-order-modal"
											value={sortOrder}
											onChange={(e) => {
												setSortOrder(e.target.value as "asc" | "desc");
												setPage(1);
											}}
											className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white w-full"
										>
											<option value="desc">Descending</option>
											<option value="asc">Ascending</option>
										</select>
									</div>

									<div>
										<label htmlFor="payout-start-modal" className="block text-sm font-medium text-gray-700 mb-1">
											Start date
										</label>
										<input
											id="payout-start-modal"
											type="date"
											value={startDate}
											onChange={(e) => {
												setStartDate(e.target.value);
												setPage(1);
											}}
											className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white w-full"
										/>

										<label htmlFor="payout-end-modal" className="block text-sm font-medium text-gray-700 mt-3 mb-1">
											End date
										</label>
										<input
											id="payout-end-modal"
											type="date"
											value={endDate}
											onChange={(e) => {
												setEndDate(e.target.value);
												setPage(1);
											}}
											className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white w-full"
										/>

										{dateError && (
											<p className="text-red-600 text-sm font-medium mt-3" role="alert">
												{dateError}
											</p>
										)}
									</div>
								</div>

								<div className="mt-6 flex justify-end gap-2">
									<button
										type="button"
										onClick={clearSortGroup}
										className="px-3 py-2 text-sm rounded-[8px] border border-gray-300 bg-white hover:bg-gray-100 font-medium"
									>
										Reset sort
									</button>
									<button
										type="button"
										onClick={() => setSortOpen(false)}
										className="px-3 py-2 text-sm rounded-[8px] bg-[#004484] text-white hover:bg-[#003366] font-medium"
									>
										Done
									</button>
								</div>
							</div>
						</div>
					)}
					{dateError && (
						<p className="text-red-600 text-sm font-medium mt-3" role="alert">
							{dateError}
						</p>
					)}
					{!dateError && list.data && (
						<div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2">
							<span className="text-sm text-gray-500">Showing:</span>
							<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#004484]/10 text-[#004484] text-sm font-medium">
								{pagination.total} payout{pagination.total !== 1 ? "s" : ""}
							</span>
							<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-sm">
								{sortBy === "createdAt" ? "Date" : "Amount"} ·{" "}
								{sortOrder === "desc" ? "High → low" : "Low → high"}
							</span>
							<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-sm">
								{formatDateRange(startISO ?? undefined, endISO ?? undefined)}
							</span>
							{payoutStatusComma && (
								<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-sm">
									Status: {payoutStatusComma}
								</span>
							)}
							{paymentType.trim() && (
								<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-sm">
									Type: {paymentType.trim()}
								</span>
							)}
							{researcherName.trim() && (
								<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-sm">
									Researcher: {researcherName.trim()}
								</span>
							)}
						</div>
					)}
				</section>

				{isError && (
					<div className="mt-6 p-4 rounded-[8px] border border-red-200 bg-red-50 text-red-800">
						<p className="font-medium">Failed to load payout data</p>
						<p className="text-sm mt-1">{errorMessage}</p>
						<button
							type="button"
							onClick={() => {
								void summary.refetch();
								void list.refetch();
							}}
							className="mt-3 px-3 py-2 text-sm rounded-[8px] bg-red-100 hover:bg-red-200"
						>
							Retry
						</button>
					</div>
				)}

				{!isError && (
					<div className="mt-6">
						<PayoutFlowTable
							transactionsData={list.data?.data}
							pagination={pagination}
							onPageChange={setPage}
							onLimitChange={(newLimit) => {
								setLimit(Math.min(100, newLimit));
								setPage(1);
							}}
						/>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
};

export default Page;
