"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import type { BinanceTransaction, PaginationMeta } from "@/app/lib/type";
import { fetchBinanceTransactions, triggerBinanceSync } from "./api";

export type BinanceQueryParams = {
	page?: number;
	limit?: number;
	startDate?: string;
	endDate?: string;
	sortOrder?: "asc" | "desc";
};

export type BinanceTransactionsResult = {
	data: BinanceTransaction[];
	pagination: PaginationMeta;
	dateRange: { minDate: number; maxDate: number } | null;
};

export function useFetchBinanceTransactions({
	axios,
	queryParams,
	enabled = true,
}: {
	axios: AxiosInstance;
	queryParams: BinanceQueryParams;
	enabled?: boolean;
}) {
	return useQuery<BinanceTransactionsResult>({
		queryKey: ["binance-transactions", queryParams],
		queryFn: () =>
			fetchBinanceTransactions(axios, {
				page: queryParams.page ?? 1,
				limit: queryParams.limit ?? 20,
				startDate: queryParams.startDate,
				endDate: queryParams.endDate,
				sortOrder: queryParams.sortOrder ?? "desc",
			}),
		staleTime: 2 * 60 * 1000,
		retry: 2,
		enabled,
	});
}

export function useTriggerBinanceSync({ axios }: { axios: AxiosInstance }) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => triggerBinanceSync(axios),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["binance-transactions"] });
		},
	});
}
