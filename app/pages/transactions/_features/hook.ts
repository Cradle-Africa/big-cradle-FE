import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { PaginationMeta, WalletTransactionList } from "@/app/lib/type";
import { fetchInFlowTransactions, fetchOutFlowTransactions, fetchPayoutTransactions, payOut } from "./api";

//fetch inflow transactions
export const useFetchInflowTransactions = ({
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
        queryKey: ["transactions", queryParams],
        queryFn: () => fetchInFlowTransactions(axios, queryParams),
        staleTime: 5 * 60 * 1000,
        retry: 3,
    });
};

// fetch outflow transactions
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
        queryKey: ["transactions", queryParams],
        queryFn: () => fetchOutFlowTransactions(axios, queryParams),
        staleTime: 5 * 60 * 1000,
        retry: 3,
    });
};

//fetch payout transactions
export const useFetchPayoutTransactions = ({
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
        queryKey: ["transactions", queryParams],
        queryFn: () => fetchPayoutTransactions(axios, queryParams),
        staleTime: 5 * 60 * 1000,
        retry: 3,
    });
};

// payout status mutation
export const usePayout = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<void, Error, { payoutId: string, payoutStatus: string }>({
    mutationFn: ({ payoutId, payoutStatus }) => payOut(axios, payoutId, payoutStatus),
  });
};

