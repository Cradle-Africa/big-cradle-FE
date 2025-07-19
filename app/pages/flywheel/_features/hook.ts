import { DataEntry, DataFlyOverview, DataPoint, PaginationMeta, Pipeline } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { analyseData, createBulkDataEntry, createDataEntry, createDataPoint, createPipeline, deleteDataPoint, deletePipeline, fetchDataEntries, fetchDataEntriesOfDataPoints, fetchDataOverview, fetchDataPoints, fetchPipelines, fetchPipelinesByDepartment, fetchSingleDataPoint, fetchSinglePipeline, updatePipeline } from "./api";

type UseFetchDataPoints = {
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
		pagination: PaginationMeta;
	}>({
		queryKey: ["data-points", queryParams],
		queryFn: () => fetchDataPoints(axios, queryParams),
		staleTime: 60 * 1000 * 5,
		retry: 3,
	});
};


export const useFetchSingleDataPoint = ({
	axios,
	id,
	enabled = true,
}: {
	axios: AxiosInstance;
	id: string;
	enabled?: boolean;
}) => {
	return useQuery<DataPoint>({
		queryKey: ["single-datapoint", id],
		queryFn: () => {
			console.log("Running queryFn for fieldId:", id);
			return fetchSingleDataPoint(axios, id); // return the promise
		},
		enabled: !!id && enabled,
		staleTime: 1000 * 60 * 5,
	});
};


export const useFetchSinglePipeline = ({
	axios,
	id,
	enabled = true, //disable query if ID is undefined
}: {
	axios: AxiosInstance;
	id: string;
	enabled?: boolean;
}) => {
	return useQuery<Pipeline>({
		queryKey: ["single-pipeline", id],
		queryFn: () => fetchSinglePipeline(axios, id),
		enabled: !!id && enabled,
		staleTime: 1000 * 60 * 5,
	});
};


export const useEditPipeline = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation({
		mutationFn: async ({id, payload} :{id: string, payload: DataPoint}) => {
			const res = await axios.put(`/data-point-mgt/pipeline-fields/${id}`, payload);
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
	queryParams,
}: {
	axios: AxiosInstance;
	queryParams: {
		businessUserId: string;
		departmentId: string;
		startDate: string;
		endDate: string;
		search: string;
		page: number;
		limit: number;
	};
}) => {
	return useQuery({
		queryKey: ['pipelines', queryParams],
		queryFn: () => fetchPipelines(axios, queryParams),
		staleTime: 5 * 60 * 1000,
		retry: 3,
	});
};



type UseFetchPipelinesByDepartmentArgs = {
	axios: AxiosInstance;
	queryParams: {
		departmentId: string;
		businessUserId: string;
		page?: number;
		limit?: number;
	};
	enabled?: boolean;
};

export const useFetchPipelinesByDepartment = ({
	axios,
	queryParams,
	enabled = true,
}: UseFetchPipelinesByDepartmentArgs) => {
	return useQuery<{
		data: Pipeline[];
		page: number;
		limit: number;
		total: number;
		pages: number;
	}>({
		queryKey: ["pipelines-by-department", queryParams],
		queryFn: () => fetchPipelinesByDepartment(axios, queryParams),
		enabled,
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

export const useCreateBulkDataEntry = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, DataEntry[]>({
		mutationFn: (entries: DataEntry[]) => createBulkDataEntry(axios, entries),
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

export const useFetchDataPointOfDataEntries = ({
	axios,
	queryParams,
}: {
	axios: AxiosInstance;
	queryParams: {
		page?: number;
		limit?: number;
		dataPoint?: string;
	};
}) => {
	return useQuery<{
		entries: DataEntry[];
		pagination: PaginationMeta;
	}>({
		queryKey: ["data-points-data-entries", queryParams],
		queryFn: () => fetchDataEntriesOfDataPoints(axios, queryParams),
		staleTime: 5 * 60 * 1000,
		enabled: !!queryParams.dataPoint,
	});
};

interface AnalyseDataParams {
	endpoint: string;
	businessUserId: string;
	dataPoint: string;
	prompt: string;
	limit?: number;
	page?: number;
}


export const useAnalyseData = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<any, Error, AnalyseDataParams>({
		mutationFn: ({ endpoint, businessUserId, dataPoint, prompt, limit = 10, page = 1 }) =>
			analyseData(axios, endpoint, businessUserId, dataPoint, prompt, limit, page),
	});
};


export const useFetchDataOverview = (
	axios: AxiosInstance
): UseQueryResult<DataFlyOverview> => {
	return useQuery<DataFlyOverview>({
		queryKey: ["data-flywheel-overview"],
		queryFn: () => fetchDataOverview(axios),
		staleTime: 5 * 60 * 1000,
	});
};


export const useUpdatePipeline = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, { id: string; data: Pipeline }>({
		mutationFn: ({ id, data }) => updatePipeline(axios, id, data),
	});
};


export const useDeleteDataPoint = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, { id: string }>({
		mutationFn: ({ id }) => deleteDataPoint(axios, id),
	});
};



export const useDeletePipeline = ({ axios }: { axios: AxiosInstance }) => {
	return useMutation<void, Error, { id: string }>({
		mutationFn: ({ id }) => deletePipeline(axios, id),
	});
};
