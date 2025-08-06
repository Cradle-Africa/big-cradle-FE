import axios from "@/app/lib/axios";
import { CreatedDataPipelines, EntryVolumeItem, EntryVolumeResponse, PeriodType } from "./types";

export const fetchSurveySummary = async (
	businessUserId: string,
	role: string,
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

export const fetchTopSurveys = async (
	businessUserId: string,
	role: string
	// startDate: string,
	// endDate: string
) => {
	const response = await axios.get(
		`/survey-dashboard/top-surveys?businessUserId=${businessUserId}&role=${role}`
	);
	return response.data;
};

export const fetchTopDataPoints = async (
	businessUserId: string,
	role: string
) => {
	const response = await axios.get(
		`/data-flywheel-dashboard/top-data-points?businessUserId=${businessUserId}&role=${role}`
	);
	return response.data;
};

interface EntryVolumeParams {
	businessUserId: string;
	role: string;
	startDate?: string;
	endDate?: string;
}
export const getEntryVolumeData = async (
	params: EntryVolumeParams
): Promise<EntryVolumeItem[]> => {
	const response = await axios.get<EntryVolumeResponse>("/data-flywheel-dashboard/entry-volume-heatmap",
		{ params }
	);
	return response.data.data;
};

export const getSurveyPaymentStats = async ({
	businessUserId,
	role,
	startDate,
	endDate,
}: {
	businessUserId: string;
	role: string;
	startDate?: string;
	endDate?: string;
}) => {
	const response = await axios.get("/survey-dashboard/payment-stats", {
		params: {
			businessUserId,
			role,
			startDate,
			endDate,
		},
	});

	return response.data.data;
};


export const getAllAdminUserBusinesses = async ({
	adminUserId,
	page,
	limit,
}: {
	adminUserId: string;
	page: number;
	limit: number;
}) => {
	try {
		const response = await axios.get("/manage-business/all-admin-user-businesses", {
			params: {
				adminUserId,
				page,
				limit,
			},
		});
		return response.data.businessUser;
	} catch (err) {
		console.log(err)
	}
};


//SUPER ADMIN API

export const fetchSuperAdminSummary = async () => {
	const response = await axios.get(`/super-admin-dashboard/summary`);
	return response.data.data;
};

export const fetchCreatedDataPipelines = async ({
	period,
	startDate,
	endDate,
}: {
	period: PeriodType;
	startDate?: string;
	endDate?: string;
}): Promise<CreatedDataPipelines[]> => {
	try {
		const res = await axios.get("/super-admin-dashboard/created-data-point-chat", {
			params: {
				period,
				...(startDate && { startDate }),
				...(endDate && { endDate }),
			},
		});

		return res.data.data;
	} catch (error: any) {
		console.error("Error fetching created data:", error);
		throw new Error("Failed to fetch created data stats.");
	}
};

export const fetchCreatedSurveys = async ({
	period,
	startDate,
	endDate,
}: {
	period: PeriodType;
	startDate?: string;
	endDate?: string;
}): Promise<CreatedDataPipelines[]> => {
	try {
		const res = await axios.get("/super-admin-dashboard/created-survey-chat", {
			params: {
				period,
				...(startDate && { startDate }),
				...(endDate && { endDate }),
			},
		});

		return res.data.data;
	} catch (error: any) {
		console.error("Error fetching created data:", error);
		throw new Error("Failed to fetch created data stats.");
	}
};

export const fetchTopResearchers = async () => {
	try {
		const response = await axios.get(`/super-admin-dashboard/top-researchers`);
		return response.data.data;
	} catch (error: any) {
		console.error("Error fetching data:", error);
		throw new Error("Failed to fetch data");
	}
};