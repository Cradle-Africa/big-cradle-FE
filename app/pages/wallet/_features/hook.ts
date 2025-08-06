import { CreateTransactionPayload, CreateTransactionResponse, CreateWalletPayload, FlutterWavePaymentSubmit, PaginationMeta, TransactionVerificationResponse, WalletErrorResponse, WalletSuccessResponse, WalletTransactionList } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { createTransaction, createWallet, fetchTransactions, fetchWallet, initiateTransaction, verifyTransaction } from "./api";

export const useCreateWallet = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<void, Error, CreateWalletPayload>({
    mutationFn: (data: CreateWalletPayload) => createWallet(axios, data),
  });
};

export const useFetchWallet = ({
  axios,
  userId,
  enabled = true,
}: {
  axios: AxiosInstance;
  userId: string;
  enabled?: boolean;
}) => {
  return useQuery<WalletSuccessResponse, WalletErrorResponse>({
    queryKey: ["wallet-info", userId],
    queryFn: () => fetchWallet(axios, userId),
    enabled: !!userId && enabled,
    staleTime: 1000 * 60 * 5,
  });
};

type UseFetchTransactions = {
  axios: AxiosInstance;
  queryParams: {
    userId: string;
  };
  enabled?: boolean;
};


export const useFetchWalletTransactions = ({
  axios,
  queryParams,
  enabled = true,
}: UseFetchTransactions) => {
  return useQuery<{
    data: WalletTransactionList[];
    pagination: PaginationMeta;
  }>({
    queryKey: ['wallet-transactions', queryParams],
    queryFn: () => fetchTransactions(axios, queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled,
  });
};

export const useCreateTransaction = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<{ data: CreateTransactionResponse }, Error, CreateTransactionPayload>({
    mutationFn: (data) => createTransaction(axios, data),
  });
};



export const useInitiateTransaction = ({ axios }: { axios: AxiosInstance }) =>
  useMutation<{ link: string }, Error, FlutterWavePaymentSubmit>({
    mutationFn: (payload) => initiateTransaction(axios, payload),
  });



export const useVerifyTransaction = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<TransactionVerificationResponse, void, string>({
    mutationFn: (txRef: string) => verifyTransaction(axios, txRef),
  });
};
