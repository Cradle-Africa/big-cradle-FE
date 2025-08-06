import { PaginationMeta, ResearcherKyc, ReviewResearcherKyc } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { fetchResearcherKyc, reviewResearcherKyc } from "./api";

type UseFetchResearcherKyc = {
    axios: AxiosInstance;
    queryParams?: {
        page?: number;
        limit?: number;
    };
};

export const useFetchResearcherKyc = ({ axios, queryParams }: 
  UseFetchResearcherKyc) => {
  return useQuery<{
    data: ResearcherKyc[];
    pagination: PaginationMeta;
  }>({
    queryKey: ["researchers-kyc", queryParams],
    queryFn: () => fetchResearcherKyc(axios, queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewResearcherKyc = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<void, Error, ReviewResearcherKyc>({
    mutationFn: (data: ReviewResearcherKyc) => reviewResearcherKyc(axios, data),
  });
};






