import { AnalyseSocialMedia } from "@/app/lib/type";
import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { analyseSocialMediaApi } from "./api";

export const useAnalyseSocialMedia = ({ axios }: { axios: AxiosInstance }) => {
    return useMutation<any, { message: string }, AnalyseSocialMedia>({
        mutationFn: (data: AnalyseSocialMedia) => analyseSocialMediaApi(axios, data),
    });
};
