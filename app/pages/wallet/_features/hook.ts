import { CreateWalletPayload, WalletInfo } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { createWallet, fetchWallet } from "./api";

export const useCreateWallet = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, CreateWalletPayload>({
		mutationFn: (data: CreateWalletPayload) => createWallet(axios, data),
	});
};

export const useFetchWallet = ({
	axios,
	userId,
	enabled = true, //disable query if ID is undefined
}: {
	axios: AxiosInstance;
	userId: string;
	enabled?: boolean;
}) => {
	return useQuery<WalletInfo>({
		queryKey: ["wallet-info", userId],
		queryFn: () => fetchWallet(axios, userId),
		enabled: !!userId && enabled,
		staleTime: 1000 * 60 * 5,
	});
};