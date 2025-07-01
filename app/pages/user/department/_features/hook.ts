import { Department } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { createDepartment , fetchDepartments } from "./api";

type UseFetchDepartments = {
  axios: AxiosInstance;
  queryParams?: {
    page?: number;
    limit?: number;
    businessUserId?: string;
  };
}

export const useFetchDepartments = ({ axios, queryParams }: UseFetchDepartments) => {
  return useQuery<{
    data: Department[];
    page: number;
    limit: number;
    total: number;
  }>({
    queryKey: ["departments", queryParams],
    queryFn: () => fetchDepartments(axios, queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


export const useCreateDepartment = ({ axios }: {axios: AxiosInstance}) => {
  return useMutation<void, Error, Department>({
    mutationFn: (data: Department) => createDepartment(axios, data),
  });
};