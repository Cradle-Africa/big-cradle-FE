import { AdminKyc, PaginationMeta, ReviewAdminKyc } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { reviewAdminKyc , fetchAdminKyc } from "./api";

type UseFetchAdminKyc = {
    axios: AxiosInstance;
    queryParams?: {
        page?: number;
        limit?: number;
    };
};

export const useFetchAdminKyc = ({ axios, queryParams }: UseFetchAdminKyc) => {
  return useQuery<{
    data: AdminKyc[];
    pagination: PaginationMeta;
  }>({
    queryKey: ["admins-kyc", queryParams],
    queryFn: () => fetchAdminKyc(axios, queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


export const useReviewAdminKyc = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<void, Error, ReviewAdminKyc>({
    mutationFn: (data: ReviewAdminKyc) => reviewAdminKyc(axios, data),
  });
};






