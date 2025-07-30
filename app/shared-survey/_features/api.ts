import axios from "@/app/lib/axios";
import { SurveyEntryData, SurveyEntryResponse } from "@/app/lib/type";

export const createSurveyEntry = async (
	payload: SurveyEntryData
): Promise<SurveyEntryResponse> => {
	const response = await axios.post("/survey-mgt/create-entry", payload);
	return response.data;
};