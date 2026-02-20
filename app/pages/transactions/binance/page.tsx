"use client";

import DashboardLayout from "@/app/DashboardLayout";
import { Spinner } from "@radix-ui/themes";
import axios from "@/app/lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFetchBinanceTransactions, useTriggerBinanceSync } from "./_features/hook";
import BinanceTransactionsTable from "./components/BinanceTransactionsTable";
import { RefreshCw, ArrowDownToLine, ArrowUpFromLine, LayoutGrid } from "lucide-react";

function toISODateOnly(value: string): string | undefined {
	if (!value?.trim()) return undefined;
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

function toYYYYMMDD(ms: number): string {
	return new Date(ms).toISOString().slice(0, 10);
}

function formatAmount(value: number): string {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4,
	});
}

function formatBalance(value: number): string {
	const formatted = formatAmount(Math.abs(value));
	return value > 0 ? `+${formatted}` : value < 0 ? `-${formatted}` : formatted;
}

function formatDateRange(startISO: string | undefined, endISO: string | undefined): string {
	if (!startISO && !endISO) return "All time";
	if (startISO && endISO) {
		const start = new Date(startISO).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
		const end = new Date(endISO).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
		return `${start} – ${end}`;
	}
	if (startISO) return `From ${new Date(startISO).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
	if (endISO) return `Until ${new Date(endISO).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
	return "All time";
}

const Page = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const startISO = toISODateOnly(startDate);
	const endISO = toISODateOnly(endDate);
	const dateError =
		startISO && endISO && new Date(startISO) > new Date(endISO)
			? "End date must be on or after start date."
			: null;

	const queryParams = {
		page,
		limit,
		sortOrder,
		startDate: dateError ? undefined : startISO,
		endDate: dateError ? undefined : endISO,
	};

	const { data, isLoading, isError, error, refetch } = useFetchBinanceTransactions({
		axios,
		queryParams,
		enabled: !dateError,
	});
	const syncMutation = useTriggerBinanceSync({ axios });

	const dateRange = data?.dateRange ?? null;
	const summary = data?.summary ?? null;
	const minDateStr = dateRange ? toYYYYMMDD(dateRange.minDate) : undefined;
	const maxDateStr = dateRange ? toYYYYMMDD(dateRange.maxDate) : undefined;
	const filtersDisabled = dateRange === null;

	const pagination = {
		page: data?.pagination?.page ?? 1,
		limit: data?.pagination?.limit ?? 20,
		total: data?.pagination?.total ?? 0,
		pages: data?.pagination?.pages ?? 0,
	};

	const handleSync = () => {
		syncMutation.mutate(undefined, {
			onSuccess: (res) => {
				toast.success(res?.message ?? "Sync completed successfully.");
			},
			onError: (err: { response?: { data?: { message?: string } }; message?: string }) => {
				toast.error(
					err?.response?.data?.message ?? err?.message ?? "Sync failed. Try again later."
				);
			},
		});
	};

	const clearFilters = () => {
		setStartDate("");
		setEndDate("");
		setPage(1);
	};

	if (isLoading) {
		return (
			<DashboardLayout>
				<div className="flex justify-center items-center min-h-[200px]">
					<Spinner size="3" />
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="w-full mt-5">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
					<div>
						<h2 className="font-bold text-lg text-black">Binance transaction history</h2>
						<p className="text-gray-600 text-sm mt-1">
							View Binance deposits and withdrawals synced from Binance. Data is read from
							our database; use &quot;Sync now&quot; to refresh from Binance.
						</p>
					</div>
					<button
						type="button"
						onClick={handleSync}
						disabled={syncMutation.isPending}
						className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#004484] text-white hover:bg-[#003366] disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
						aria-busy={syncMutation.isPending}
					>
						<RefreshCw
							size={16}
							className={syncMutation.isPending ? "animate-spin" : ""}
							aria-hidden
						/>
						{syncMutation.isPending ? "Syncing…" : "Sync now"}
					</button>
				</div>

				{/* Summary cards – first */}
				{!isError && (
					<section className="mt-6" aria-label="Summary">
						{summary !== null ? (
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								{/* Total Amount card */}
								<div className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm">
									<div className="flex items-center gap-2 text-gray-500 mb-1">
										<LayoutGrid size={18} aria-hidden />
										<span className="text-sm font-medium">Total</span>
									</div>
									<p className="text-xl font-semibold text-gray-900">
										{summary.totalCount.toLocaleString()} transaction{summary.totalCount !== 1 ? "s" : ""}
									</p>
									<p className="text-sm text-gray-600 mt-1">
										Net flow: {formatBalance(summary.balance)} USDT
									</p>
								</div>
								{/* Deposits card */}
								<div className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm">
									<div className="flex items-center gap-2 text-gray-500 mb-1">
										<ArrowDownToLine size={18} aria-hidden />
										<span className="text-sm font-medium">Deposits</span>
									</div>
									<p className="text-xl font-semibold text-gray-900">
										{summary.byType.deposit.count} deposit{summary.byType.deposit.count !== 1 ? "s" : ""}
									</p>
									<p className="text-sm text-gray-600 mt-1">
										{formatAmount(summary.byType.deposit.totalAmount)} USDT
									</p>
								</div>
								{/* Withdrawals card */}
								<div className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm">
									<div className="flex items-center gap-2 text-gray-500 mb-1">
										<ArrowUpFromLine size={18} aria-hidden />
										<span className="text-sm font-medium">Withdrawals</span>
									</div>
									<p className="text-xl font-semibold text-gray-900">
										{summary.byType.withdrawal.count} withdrawal{summary.byType.withdrawal.count !== 1 ? "s" : ""}
									</p>
									<p className="text-sm text-gray-600 mt-1">
										{formatAmount(summary.byType.withdrawal.totalAmount)} USDT
									</p>
								</div>
							</div>
						) : (
							<div className="rounded-[8px] border border-gray-200 bg-gray-50 p-4">
								<p className="text-sm text-gray-500">No transactions in this range.</p>
							</div>
						)}
					</section>
				)}

				{/* Unified filter & sort toolbar */}
				<section className="mt-6 p-4 rounded-[8px] border border-gray-200 bg-gray-50" aria-label="Filters and sort">
					{filtersDisabled && (
						<p className="text-sm text-gray-600 mb-4">
							No transaction data available; date filters are disabled.
						</p>
					)}
					<div className="flex flex-wrap items-end gap-4">
						<div>
							<label htmlFor="binance-sort" className="block text-sm font-medium text-gray-700 mb-1">
								Sort
							</label>
							<select
								id="binance-sort"
								value={sortOrder}
								onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
								className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white min-w-[140px]"
							>
								<option value="desc">Newest first</option>
								<option value="asc">Oldest first</option>
							</select>
						</div>
						<div>
							<label htmlFor="binance-start" className="block text-sm font-medium text-gray-700 mb-1">
								Start date
							</label>
							<input
								id="binance-start"
								type="date"
								value={startDate}
								min={minDateStr}
								max={maxDateStr}
								disabled={filtersDisabled}
								onChange={(e) => {
									setStartDate(e.target.value);
									setPage(1);
								}}
								className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white disabled:opacity-60 disabled:cursor-not-allowed"
							/>
						</div>
						<div>
							<label htmlFor="binance-end" className="block text-sm font-medium text-gray-700 mb-1">
								End date
							</label>
							<input
								id="binance-end"
								type="date"
								value={endDate}
								min={minDateStr}
								max={maxDateStr}
								disabled={filtersDisabled}
								onChange={(e) => {
									setEndDate(e.target.value);
									setPage(1);
								}}
								className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white disabled:opacity-60 disabled:cursor-not-allowed"
							/>
						</div>
						<button
							type="button"
							onClick={clearFilters}
							disabled={filtersDisabled}
							className="px-3 py-2 text-sm rounded-[8px] border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed font-medium"
						>
							Clear filters
						</button>
					</div>
					{dateError && (
						<p className="text-red-600 text-sm font-medium mt-3" role="alert">
							{dateError}
						</p>
					)}
					{/* Active filters display */}
					{!dateError && data && (
						<div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2">
							<span className="text-sm text-gray-500">Showing:</span>
							<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#004484]/10 text-[#004484] text-sm font-medium">
								{pagination.total} transaction{pagination.total !== 1 ? "s" : ""}
							</span>
							<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-sm">
								{sortOrder === "desc" ? "Newest first" : "Oldest first"}
							</span>
							<span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-200 text-gray-700 text-sm">
								{formatDateRange(startISO ?? undefined, endISO ?? undefined)}
							</span>
						</div>
					)}
				</section>

				{isError && (
					<div className="mt-6 p-4 rounded-[8px] border border-red-200 bg-red-50 text-red-800">
						<p className="font-medium">Failed to load transactions</p>
						<p className="text-sm mt-1">{error?.message ?? "An error occurred."}</p>
						<button
							type="button"
							onClick={() => refetch()}
							className="mt-3 px-3 py-2 text-sm rounded-[8px] bg-red-100 hover:bg-red-200"
						>
							Retry
						</button>
					</div>
				)}

				{!isError && (
					<div className="mt-6">
						<BinanceTransactionsTable
							transactionsData={data?.data}
							pagination={pagination}
							onPageChange={setPage}
							onLimitChange={(newLimit) => {
								setLimit(newLimit);
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
