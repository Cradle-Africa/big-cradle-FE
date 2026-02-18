"use client";

import DashboardLayout from "@/app/DashboardLayout";
import { Spinner } from "@radix-ui/themes";
import axios from "@/app/lib/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFetchBinanceTransactions, useTriggerBinanceSync } from "./_features/hook";
import BinanceTransactionsTable from "./components/BinanceTransactionsTable";
import { RefreshCw } from "lucide-react";

function toISODateOnly(value: string): string | undefined {
	if (!value?.trim()) return undefined;
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

function toYYYYMMDD(ms: number): string {
	return new Date(ms).toISOString().slice(0, 10);
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

				{/* Sort order */}
				<div className="flex flex-wrap items-center gap-4 mt-6">
					<div>
						<label htmlFor="binance-sort" className="block text-sm font-medium text-gray-700 mb-1">
							Sort order
						</label>
						<select
							id="binance-sort"
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
							className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm bg-white"
						>
							<option value="desc">Newest first</option>
							<option value="asc">Oldest first</option>
						</select>
					</div>
				</div>

				{/* Date filters */}
				<div className="flex flex-wrap items-end gap-4 mt-6 p-4 rounded-[8px] border border-gray-200 bg-gray-50">
					{filtersDisabled && (
						<p className="text-sm text-gray-600 w-full">
							No transaction data available; date filters are disabled.
						</p>
					)}
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
							className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
							className="rounded-[8px] border border-gray-200 px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
						/>
					</div>
					<button
						type="button"
						onClick={clearFilters}
						disabled={filtersDisabled}
						className="px-3 py-2 text-sm rounded-[8px] border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						Clear filters
					</button>
					{dateError && (
						<p className="text-red-600 text-sm font-medium w-full" role="alert">
							{dateError}
						</p>
					)}
				</div>

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
						{pagination.total > 0 && (
							<p className="text-sm text-gray-600 mb-2">
								Total: {pagination.total} transaction{pagination.total !== 1 ? "s" : ""}
							</p>
						)}
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
