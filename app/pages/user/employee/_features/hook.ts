import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { activateEmployee, fetchEmployees, inviteEmployee, suspendEmployee } from "./api";
import { Employee, InviteEmployee } from "@/app/lib/type";


type UseFetchEmployees = {
	axios: AxiosInstance;
	queryParams?: {
		page?: number;
		limit?: number;
		businessUserId?: string;
	};
}

export const useFetchEmployees = ({ axios, queryParams }: UseFetchEmployees) => {
	return useQuery<{
		data: Employee[];
		page: number;
		limit: number;
		total: number;
	}>({
		queryKey: ["employees", queryParams],
		queryFn: () => fetchEmployees(axios, queryParams),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useInviteEmployee = ({ axios }: {axios: AxiosInstance}) => {
  return useMutation<void, Error, InviteEmployee>({
	mutationFn: (data: InviteEmployee) => inviteEmployee(axios, data),
  });
};


export const useSuspendEmployee = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, { id: string }>({
		mutationFn: ({ id }) => suspendEmployee(axios, id),
	});
};


export const useActivateEmployee = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, { id: string }>({
		mutationFn: ({ id }) => activateEmployee(axios, id),
	});
};