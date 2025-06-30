import {
  DashboardAnalyticsResponse,
  FlutterwaveHostedLinkResponse,
  FlutterWavePaymentSubmit,
  PaymentVerificationResponse,
  SingleSurveyResponse,
  SuperAdminSurveyListResponse,
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
  fetchSurveysAnalytics,
  surveyPay,
  updateSurvey,
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

export const useUpdateSurvey = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<SingleSurveyResponse, Error, Survey>({
    mutationFn: (data: Survey) => updateSurvey(axios, data),
  });
};

type UseFetchSuperAdminSurvey = {
  axios: AxiosInstance;
  page: string;
  enabled : boolean;
  onSuccess?: (data: any) => void;
};

export const useFetchSuperAdminSurvey = ({
  axios,
  page,
  enabled,
}: UseFetchSuperAdminSurvey) => {
  return useQuery<SuperAdminSurveyListResponse>({
    queryKey: ["surveys", page],
    queryFn: () => fetchSurveys(axios, page, null),
    staleTime: 60 * 1000 * 60,
    retry: 3,
    enabled,
  });
};

type UseFetchSurvey = {
  axios: AxiosInstance;
  page: string;
  businessUserId: string | null;
  enabled : boolean
  onSuccess?: (data: any) => void;
};

export const useFetchSurvey = ({
  axios,
  businessUserId,
  page,
  enabled,
}: UseFetchSurvey) => {
  return useQuery<SurveyListResponse>({
    queryKey: ["surveys", businessUserId, page],
    queryFn: () => fetchSurveys(axios, page, businessUserId),
    staleTime: 60 * 1000 * 60,
    retry: 3,
    enabled,
  });
};

type UseFetchSurveyAnalyctics = {
  axios: AxiosInstance;
  businessUserId: string;
};

export const useFetchSurveyAnalyctics = ({
  axios,
  businessUserId,
}: UseFetchSurveyAnalyctics) => {
  return useQuery<DashboardAnalyticsResponse>({
    queryKey: ["surveys-analytics", businessUserId],
    queryFn: () => fetchSurveysAnalytics(axios, businessUserId),
    staleTime: 60 * 1000 * 60,
    retry: 3,
  });
};

export const useVerifySurveyPayment = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<PaymentVerificationResponse, void, string>({
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
