import { BusinessKyc, PaginationMeta, ReviewBusinessKyc } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { reviewBusinessKyc , fetchBusinessKyc } from "./api";

type UseFetchBusinessKyc = {
    axios: AxiosInstance;
    queryParams?: {
        page?: number;
        limit?: number;
    };
};

export const useFetchBusinessKyc = ({ axios, queryParams }: UseFetchBusinessKyc) => {
  return useQuery<{
    data: BusinessKyc[];
    pagination: PaginationMeta;
  }>({
    queryKey: ["businesses-kyc", queryParams],
    queryFn: () => fetchBusinessKyc(axios, queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewBusinessKyc = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<void, Error, ReviewBusinessKyc>({
    mutationFn: (data: ReviewBusinessKyc) => reviewBusinessKyc(axios, data),
  });
};






