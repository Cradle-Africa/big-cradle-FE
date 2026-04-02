import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import type {
	InflowListQueryParams,
	InflowSummaryData,
	InflowSummaryQueryParams,
	InflowTransactionsListResult,
	PaginationMeta,
	PayoutListQueryParams,
	PayoutSummaryData,
	PayoutSummaryQueryParams,
	PayoutTransactionsListResult,
	WalletTransactionList,
} from "@/app/lib/type";
import {
	fetchInflowSummary,
	fetchInflowTransactions,
	fetchOutFlowTransactions,
	fetchPayoutSummary,
	fetchPayoutTransactions,
	payOut,
} from "./api";

export function useInflowSummary({
	axios,
	queryParams,
	enabled = true,
}: {
	axios: AxiosInstance;
	queryParams: InflowSummaryQueryParams;
	enabled?: boolean;
}) {
	return useQuery<InflowSummaryData>({
		queryKey: ["admin-inflow-summary", queryParams],
		queryFn: () => fetchInflowSummary(axios, queryParams),
		staleTime: 5 * 60 * 1000,
		retry: 2,
		enabled,
	});
}

export function useInflowTransactions({
	axios,
	queryParams,
	enabled = true,
}: {
	axios: AxiosInstance;
	queryParams: InflowListQueryParams;
	enabled?: boolean;
}) {
	return useQuery<InflowTransactionsListResult>({
		queryKey: ["admin-inflow", queryParams],
		queryFn: () => fetchInflowTransactions(axios, queryParams),
		staleTime: 5 * 60 * 1000,
		retry: 2,
		enabled,
	});
}

export function usePayoutSummary({
	axios,
	queryParams,
	enabled = true,
}: {
	axios: AxiosInstance;
	queryParams: PayoutSummaryQueryParams;
	enabled?: boolean;
}) {
	return useQuery<PayoutSummaryData>({
		queryKey: ["admin-payout-summary", queryParams],
		queryFn: () => fetchPayoutSummary(axios, queryParams),
		staleTime: 5 * 60 * 1000,
		retry: 2,
		enabled,
	});
}

export function usePayoutTransactions({
	axios,
	queryParams,
	enabled = true,
}: {
	axios: AxiosInstance;
	queryParams: PayoutListQueryParams;
	enabled?: boolean;
}) {
	return useQuery<PayoutTransactionsListResult>({
		queryKey: ["admin-payout", queryParams],
		queryFn: () => fetchPayoutTransactions(axios, queryParams),
		staleTime: 5 * 60 * 1000,
		retry: 2,
		enabled,
	});
}

export const useFetchOutFlowTransactions = ({
	axios,
	queryParams,
}: {
	axios: AxiosInstance;
	queryParams: { page: number; limit: number };
}) => {
	return useQuery<{
		data: WalletTransactionList[];
		pagination: PaginationMeta;
	}>({
		queryKey: ["admin-outflow", queryParams],
		queryFn: () => fetchOutFlowTransactions(axios, queryParams),
		staleTime: 5 * 60 * 1000,
		retry: 3,
	});
};

export const usePayout = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, { payoutId: string; payoutStatus: string }>({
		mutationFn: ({ payoutId, payoutStatus }) => payOut(axios, payoutId, payoutStatus),
	});
};
