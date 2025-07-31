// hooks/useSurveySummary.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDatFlywheelSummary, fetchFlywheelAverageEntries, fetchSurveyEngagement } from "./api";
import { FlywheelSummaryResponse } from "./types";
import {
  fetchSentimentBreackDown,
  fetchSurveySummary,
  fetchTopSurveys,
} from "./api";
import { SentimentResponse, TopSurveyType } from "./types";

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


type FetchTopSurveys = {
  businessUserId: string;
  role: string;
  // startDate: string;
  // endDate: string;
};

export const useFetchTopSurveys = ({
  businessUserId,
  role,
  // startDate,
  // endDate,
}: FetchTopSurveys) => {
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
