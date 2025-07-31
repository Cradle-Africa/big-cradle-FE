// hooks/useSurveySummary.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDatFlywheelSummary, fetchFlywheelAverageEntries, fetchSentimentBreackDown, fetchSurveyEngagement, fetchSurveySummary, getEntryVolumeData } from "./api";
import { EntryVolumeItem, FlywheelSummaryResponse, SentimentResponse } from "./types";

export const useSurveySummary = (businessUserId: string, role: string) => {
	return useQuery({
		queryKey: ["surveySummary", businessUserId, role],
		queryFn: () => fetchSurveySummary(businessUserId, role),
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
	period: string,
) => {
	return useQuery({
		queryKey: ["survey-engagement", businessUserId, role, period],
		queryFn: () => fetchSurveyEngagement(businessUserId, role, period)
	});
};


export const useFlywheelAverageEntries = (
	businessUserId: string,
	period: string,
) => {
	return useQuery({
		queryKey: ["flywheel-average-entries", businessUserId, period],
		queryFn: () => fetchFlywheelAverageEntries(businessUserId, period)
	});
};


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
