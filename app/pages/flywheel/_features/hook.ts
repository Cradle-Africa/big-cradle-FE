import { DataPoint, Pipeline } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { createDataPoint, createPipeline, fetchDataPoints, fetchPipelines } from "./api";

type UseFetchDataPoints = {
	axios: AxiosInstance;
	queryParams?: {
		page?: number;
		limit?: number;
	};
}

interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export const useFetchDataTypes = ({
	axios, queryParams
}: UseFetchDataPoints) => {
	return useQuery<DataPoint[]>({
		queryKey: ["data-points", queryParams],
		queryFn: () => fetchDataPoints(axios, queryParams),
		staleTime: 60 * 1000 * 5,
		// retry: 3,
	});
};

export const useCreateDataPoint = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, DataPoint>({
		mutationFn: (data: DataPoint) => createDataPoint(axios, data),
	});
};


type UseFetchPipelines = {
	axios: AxiosInstance;
	queryParams?: {
		page?: number;
		limit?: number;
	};
}

export const useFetchPipelines = ({
  axios,
  queryParams
}: UseFetchPipelines) => {
  return useQuery<{
    data: Pipeline[];
    pagination: PaginationMeta;
  }>({
    queryKey: ["pipelines", queryParams],
    queryFn: () => fetchPipelines(axios, queryParams),
    staleTime: 60 * 1000 * 5,
  });
};


export const useCreatePipeline = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, Pipeline>({
		mutationFn: (data: Pipeline) => createPipeline(axios, data),
	});
};
