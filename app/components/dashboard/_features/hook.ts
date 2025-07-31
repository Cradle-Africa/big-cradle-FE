// hooks/useSurveySummary.ts
import { useQuery } from "@tanstack/react-query";
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
