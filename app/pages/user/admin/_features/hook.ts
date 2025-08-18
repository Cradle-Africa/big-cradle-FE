import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { fetchAdmins } from "./api";

type UseFetchAdmins = {
	axios: AxiosInstance;
	queryParams?: {
		page?: number;
		limit?: number;
	};
};

export const useFetchAdmins = ({ axios, queryParams }: UseFetchAdmins) => {
	return useQuery({
		queryKey: ["admins", queryParams],
		queryFn: () => fetchAdmins(axios, queryParams),
		staleTime: 60 * 1000 * 5,
	});
};

