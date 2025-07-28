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