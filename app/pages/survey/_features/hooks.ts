import {
  FlutterwaveHostedLinkResponse,
  FlutterWavePaymentSubmit,
  SingleSurveyResponse,
  Survey,
  SurveyListResponse,
  SurveySchema,
} from "@/app/lib/type";
import { surveySchema } from "@/app/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { useForm } from "react-hook-form";
import {
  createSurvey,
  fetchSurvey,
  fetchSurveys,
  surveyPay,
  verifySurvey,
} from "./api";

export const useSurveyPay = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<
    FlutterwaveHostedLinkResponse,
    Error,
    FlutterWavePaymentSubmit
  >({
    mutationFn: (data: FlutterWavePaymentSubmit) => surveyPay(axios, data),
  });
};

export const useCreateSurvey = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<SingleSurveyResponse, Error, Survey>({
    mutationFn: (data: Survey) => createSurvey(axios, data),
  });
};

type UseFetchSurvey = {
  axios: AxiosInstance;
  businessUserId: string;
  page: number;
};

export const useFetchSurvey = ({
  axios,
  businessUserId,
  page,
}: UseFetchSurvey) => {
  return useQuery<SurveyListResponse>({
    queryKey: ["surveys", businessUserId, page],
    queryFn: () => fetchSurveys(axios, businessUserId, page),
    staleTime: 60 * 1000 * 60,
    retry: 3,
  });
};
export const useVerifySurvey = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation({
    mutationFn: (txRef: string) => verifySurvey(axios, txRef),
  });
};

// export const useVerifySurvey = ({
//   enabled,
//   axios,
// }: UseVerifySurveySurvey) => {
//   return useQuery({
//     queryKey: ["verify-survey"],
//     queryFn: (txRef : string) => verifySurvey(axios, txRef),
//     enabled,
//   });
// };

type UseFetchSingleSurvey = {
  axios: AxiosInstance;
  surveyId: string;
};

export const useFetchSingleSurvey = ({
  axios,
  surveyId,
}: UseFetchSingleSurvey) => {
  return useQuery<SingleSurveyResponse>({
    queryKey: ["surveys", surveyId],
    queryFn: () => fetchSurvey(axios, surveyId),
    staleTime: 60 * 1000 * 60,
    retry: 3,
  });
};

export const useCreateSurveyForm = () => {
  return useForm<SurveySchema>({
    resolver: zodResolver(surveySchema),
  });
};
