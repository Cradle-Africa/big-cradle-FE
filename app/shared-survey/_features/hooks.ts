
import { useMutation } from "@tanstack/react-query";
import { SurveyEntryData, SurveyEntryResponse } from "@/app/lib/type";
import { createSurveyEntry } from "./api";


export const useCreateSurveyDataEntry = ({ }: { axios: any }) => {
	return useMutation<SurveyEntryResponse, Error, SurveyEntryData>({
		mutationFn: createSurveyEntry,
	});
};
