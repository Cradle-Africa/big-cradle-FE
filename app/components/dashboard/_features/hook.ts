// hooks/useSurveySummary.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDatFlywheelSummary, fetchFlywheelAverageEntries, fetchSentimentBreackDown, fetchSurveyEngagement, fetchSurveySummary, fetchTopDataPoints, fetchTopSurveys, getAllAdminUserBusinesses, getEntryVolumeData, getSurveyPaymentStats } from "./api";
import { EntryVolumeItem, FlywheelSummaryResponse, SentimentResponse, TopPipelineDataResponse, TopSurveyType } from "./types";
import { Business } from "@/app/lib/type";

export const useSurveySummary = (businessUserId: string, role: string) => {
	return useQuery({
		queryKey: ["surveySummary", businessUserId, role],
		queryFn: () => fetchSurveySummary(businessUserId, role),
		enabled: !!businessUserId && role === 'admin',
	});
};


export const useDatFlywheelSummary = (businessUserId: string, role: string) => {
	return useQuery<FlywheelSummaryResponse>({
		queryKey: ["dataflywheelSummary", businessUserId, role],
		queryFn: () => fetchDatFlywheelSummary(businessUserId, role),
	});
};

type FetchSentimentBreackDown = {
	businessUserId: string;
	role: string;
	startDate: string;
	endDate: string;
};

export const useFetchSentiments = ({
	businessUserId,
	role,
	startDate,
	endDate,
}: FetchSentimentBreackDown) => {
	return useQuery<SentimentResponse>({
		queryKey: ["sentiment-data", businessUserId, role, startDate, endDate],
		queryFn: () =>
			fetchSentimentBreackDown(businessUserId, role, startDate, endDate),
	});
};

export const useSurveyEngagement = (
	businessUserId: string,
	role: string,
	period: string
) => {
	return useQuery({
		queryKey: ["survey-engagement", businessUserId, role, period],
		queryFn: () => fetchSurveyEngagement(businessUserId, role, period),
	});
};

export const useFlywheelAverageEntries = (
	businessUserId: string,
	period: string
) => {
	return useQuery({
		queryKey: ["flywheel-average-entries", businessUserId, period],
		queryFn: () => fetchFlywheelAverageEntries(businessUserId, period),
	});
};

type FetchTopSurveys = {
	businessUserId: string;
	role: string;
	// startDate: string;
	// endDate: string;
};

export const useFetchTopSurveys = ({
	businessUserId,
	role,
}: // startDate,
	// endDate,
	FetchTopSurveys) => {
	return useQuery<TopSurveyType[]>({
		queryKey: [
			"top-survey-type",
			businessUserId,
			role,
			// startDate, endDate
		],
		queryFn: () =>
			fetchTopSurveys(
				businessUserId,
				role
				// startDate, endDate
			),
	});
};

type FetchTopPipelines = {
	businessUserId: string;
	role: string;
};

export const useFetchTopPipelines = ({
	businessUserId,
	role,
}: FetchTopPipelines) => {
	return useQuery<TopPipelineDataResponse>({
		queryKey: ["top-data-pipeline", businessUserId, role],
		queryFn: () => fetchTopDataPoints(businessUserId, role),
	});

}
interface UseEntryVolumeParams {
	businessUserId: string;
	role: string;
	startDate?: string;
	endDate?: string;
}

export const useEntryVolume = (params: UseEntryVolumeParams) => {
	return useQuery<EntryVolumeItem[]>({
		queryKey: ["entry-volume", params],
		queryFn: () => getEntryVolumeData(params)
	});
};

export const useSurveyPaymentStats = ({
	businessUserId,
	role,
	startDate,
	endDate,
	enabled
}: {
	businessUserId: string;
	role: string;
	startDate?: string;
	endDate?: string;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: ["payment-stats", businessUserId, role, startDate, endDate],
		queryFn: () =>
			getSurveyPaymentStats({ businessUserId, role, startDate, endDate }),
		enabled: enabled && role === 'admin',
	});
};

export const useAdminUserBusinesses = ({
	adminUserId,
	page,
	limit,
}: {
	adminUserId: string;
	page: number;
	limit: number;
}) => {
	return useQuery<Business[]>({
		queryKey: ["admin-user-businesses", adminUserId, page, limit],
		queryFn: () => getAllAdminUserBusinesses({ adminUserId, page, limit }),
		enabled: !!adminUserId
	});
};