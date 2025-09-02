import {
  DashboardAnalyticsResponse,
  FlutterwaveHostedLinkResponse,
  FlutterwavePaymentMethodsResponse,
  FlutterWavePaymentSubmit,
  PaginationMeta,
  // PaymentVerificationResponse,
  SingleSurveyResponse,
  SuperAdminSurveyListResponse,
  Survey,
  SurveyEntry,
  SurveyListItem,
  SurveyListResponse,
  SurveySchema,
} from "@/app/lib/type";
import { surveySchema } from "@/app/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { useForm } from "react-hook-form";
import {
  activateSurvey,
  analyseSurveyData,
  createSurvey,
  fetchSurvey,
  fetchSurveyDataEntries,
  fetchSurveys,
  fetchSurveysAnalytics,
  getFlutterwavePaymentMethods,
  surveyPay,
  suspendSurvey,
  updateSurvey,
  verifySurvey,
  verifyWalletTrx,
} from "./api";

export const useSurveyPay = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<FlutterwaveHostedLinkResponse, Error, FlutterWavePaymentSubmit>({
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
  page: number;
  limit: number;
  search: string
  startDate: string,
  endDate: string,
  enabled: boolean;
  onSuccess?: (data: any) => void;
};

export const useFetchSuperAdminSurvey = ({
  axios,
  page,
  limit,
  search,
  startDate,
  endDate,
  enabled,
}: UseFetchSuperAdminSurvey) => {
  return useQuery<SuperAdminSurveyListResponse>({
    queryKey: ["surveys", page, limit],
    queryFn: () => fetchSurveys(axios, page, limit, null, search, startDate, endDate),
    staleTime: 60 * 1000 * 60,
    retry: 3,
    enabled,
  });
};

type UseFetchSurvey = {
  axios: AxiosInstance;
  search: string,
  startDate: string,
  endDate: string,
  page: number;
  limit: number;
  businessUserId: string | null;
  enabled: boolean
  onSuccess?: (data: any) => void;
};

export const useFetchSurvey = ({
  axios,
  businessUserId,
  page,
  limit,
  search,
  startDate,
  endDate,
  enabled,
}: UseFetchSurvey) => {
  return useQuery<SurveyListResponse>({
    queryKey: ["surveys", businessUserId, page, limit],
    queryFn: () => fetchSurveys(axios, page, limit, businessUserId, search, startDate, endDate),
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
  return useMutation<SurveyListItem, void, string>({
    mutationFn: (txRef: string) => verifySurvey(axios, txRef),
  });
};

export const useVerifyWalletTrx = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<SurveyListItem, void, string>({
    mutationFn: (tx_ref: string) => verifyWalletTrx(axios, tx_ref),
  });
};


export const useFlutterwavePaymentMethods = (
  country: string,
  enabled: boolean
) => {
  return useQuery<FlutterwavePaymentMethodsResponse>({
    queryKey: ["flutterwave-payment-methods", country],
    queryFn: () => getFlutterwavePaymentMethods(country),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

type UseFetchSingleSurvey = {
  axios: AxiosInstance;
  surveyId: string;
};

export const useFetchSingleSurvey = ({
  axios,
  surveyId,
}: UseFetchSingleSurvey) => {
  return useQuery<SingleSurveyResponse>({
    queryKey: ["survey", surveyId],
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


export const useFetchSurveysDataEntries = ({
  axios,
  queryParams,
}: {
  axios: AxiosInstance;
  queryParams: {
    businessUserId?: string;
    page?: number;
    surveyId?: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
  };
}) => {
  return useQuery<{
    data: SurveyEntry[];
    pagination: PaginationMeta;
  }>({
    queryKey: ["survey-data-entries", queryParams],
    queryFn: () => fetchSurveyDataEntries(axios, queryParams),
    staleTime: 5 * 60 * 1000
  });
};


export const useActivateSurvey = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => activateSurvey(axios, id),
  });
};

export const useSuspendSurvey = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<void, Error, { id: string }>({
    mutationFn: ({ id }) => suspendSurvey(axios, id),
  });
};

export const useAnalyseSurveyData = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<any, Error, { surveyId: string }>({
    mutationFn: ({ surveyId }) =>
      analyseSurveyData(axios, surveyId),
  });
};

