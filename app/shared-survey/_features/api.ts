import { axiosWithoutAuth } from "@/app/lib/axios";
import { SurveyEntryData, SurveyEntryResponse } from "@/app/lib/type";

export const createSurveyEntry = async (
	payload: SurveyEntryData
): Promise<SurveyEntryResponse> => {
	const response = await axiosWithoutAuth.post("/survey-mgt/create-entry", payload);
	return response.data;
};