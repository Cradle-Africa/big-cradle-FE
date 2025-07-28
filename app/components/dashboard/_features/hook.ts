// hooks/useSurveySummary.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSentimentBreackDown, fetchSurveySummary } from "./api";
import { SentimentResponse } from "./types";

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
