import axios from "@/app/lib/axios";

export const fetchSurveySummary = async (
	businessUserId: string,
	role: string
) => {
	const response = await axios.get(`/survey-dashboard/summary`, {
		params: {
			businessUserId,
			role,
		},
	});
	return response.data.data;
};

export const fetchDatFlywheelSummary = async (
	businessUserId: string,
	role: string
) => {
	const response = await axios.get(`/data-flywheel-dashboard/summary`, {
		params: {
			businessUserId,
			role,
		},
	});
	return response.data.data;
};

export const fetchSentimentBreackDown = async (
	businessUserId: string,
	role: string,
	startDate: string,
	endDate: string
) => {
	const response = await axios.get(
		`/survey-dashboard/sentiment-breakdown?businessUserId=${businessUserId}&role=${role}&startDate=${startDate}&endDate=${endDate}`
	);
	return response.data;
};


export const fetchSurveyEngagement = async (
	businessUserId: string,
	role: string,
	period: string
) => {
	const response = await axios.get("/survey-dashboard/engagement", {
		params: { businessUserId, role, period },
	});
	return response.data ?? [];
};


export const fetchFlywheelAverageEntries = async (
	businessUserId: string,
	period: string
) => {
	const response = await axios.get("/data-flywheel-dashboard/average-entries", {
		params: { businessUserId, period },
	});
	return response.data ?? [];
};



