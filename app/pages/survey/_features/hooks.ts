import { Survey, SurveyListResponse, SurveySchema } from "@/app/lib/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { createSurvey, fetchSurveys } from "./api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveySchema } from "@/app/lib/validationSchemas";

export const useCreateSurvey = ({ axios }: { axios: AxiosInstance }) => {
  return useMutation<void, Error, Survey>({
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

export const useCreateSurveyForm = () => {
  return useForm<SurveySchema>({
    resolver: zodResolver(surveySchema),
  });
};
