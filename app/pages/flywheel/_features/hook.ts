import { DataEntry, DataPoint, Pagination, PaginationMeta, Pipeline } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { analyseData, createDataEntry, createDataPoint, createPipeline, fetchDataEntries, fetchDataPoints, fetchPipelines, fetchSingleDataPoint } from "./api";

type UseFetchDataPoints = {
	axios: AxiosInstance;
	queryParams?: {
		page?: number;
		limit?: number;
		total?: number;
	};
}

type UseFetchPipelines = {
	axios: AxiosInstance;
	queryParams?: {
		page?: number;
		limit?: number;
		total?: number;
	};
}

export const useFetchDataPoints = ({
	axios, queryParams
}: UseFetchDataPoints) => {
	return useQuery<{
	    	data: DataPoint[]
			  pagination: Pagination;
		}>({
		queryKey: ["pipelines", queryParams],
		queryFn: () => fetchPipelines(axios, queryParams),
		staleTime: 60 * 1000 * 5,
		// retry: 3,
	});
};


export const useFetchSingleDataPoint = ({
    axios,
    id,
    enabled = true, //disable query if ID is undefined
}: {
    axios: AxiosInstance;
    id: string;
    enabled?: boolean;
}) => {
    return useQuery<DataPoint>({
        queryKey: ["single-pipeline", id],
        queryFn: () => fetchSingleDataPoint(axios, id),
        enabled: !!id && enabled,
        staleTime: 1000 * 60 * 5,
    });
};

export const useEditPipeline = ({ axios }: { axios: AxiosInstance }) => {
    return useMutation({
        mutationFn: async (payload: DataPoint) => {
            const res = await axios.put(`/data-point-mgt/pipeline-fields/${payload.dataPointId}`, payload);
            return res.data.data;
        },
    });
};

export const useCreatePipeline = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, Pipeline>({
		mutationFn: (data: Pipeline) => createPipeline(axios, data),
	});
};

export const useFetchPipelines = ({
  axios,
  queryParams
}: UseFetchPipelines) => {
  return useQuery<{
    dataPoint: Pipeline[];
    pagination: PaginationMeta;
  }>({
    queryKey: ["data-points", queryParams],
    queryFn: () => fetchDataPoints(axios, queryParams),
    staleTime: 60 * 1000 * 5,
  });
};

export const useCreateDataPoint = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, DataPoint>({
		mutationFn: (data: DataPoint) => createDataPoint(axios, data),
	});
};

export const useCreateDataEntry = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, DataEntry>({
		mutationFn: (data: DataEntry) => createDataEntry(axios, data),
	});
};



type UseFetchDataEntries = {
	axios: AxiosInstance;
	queryParams?: {
		page?: number;
		limit?: number;
		total?: number;
	};
}

export const useFetchDataEntries = ({
  axios,
  queryParams,
}: UseFetchDataEntries) => {
  return useQuery<{
    data: DataEntry[]; 
    pagination: PaginationMeta;
  }>({
    queryKey: ["data-entries", queryParams],
    queryFn: () => fetchDataEntries(axios, queryParams),
    staleTime: 5 * 60 * 1000,
  });
};

interface AnalyseDataParams {
    endpoint: string;
    businessUserId: string;
    prompt: string;
}

export const useAnalyseData = ({ axios }: { axios: AxiosInstance }) => {
    return useMutation<any, Error, AnalyseDataParams>({
        mutationFn: ({ endpoint, businessUserId, prompt }) =>
            analyseData(axios, endpoint, businessUserId, prompt),
    });
};
