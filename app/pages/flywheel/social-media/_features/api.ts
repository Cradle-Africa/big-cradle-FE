import { AnalyseSocialMedia } from "@/app/lib/type";
import { removeUser } from "@/app/utils/user/userData";
import { AxiosInstance } from "axios";

export const analyseSocialMediaApi = async (
    axios: AxiosInstance,
    data: AnalyseSocialMedia
) => {
    try {
        const res = await axios.post(`/data-point-mgt/analyze-socials`, data);
        return res.data; 
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message =
            error?.response?.data?.message || error?.message || "An unexpected error occurred";
     
        switch (statusCode) {
            case 400:
                if (Array.isArray(message)) {
                    message = message.join('\n');
                }
                break;
            case 401:
                removeUser();
                message = "Unauthorized access. Please log in again.";
                break;
            default:
                message = typeof message === 'string' ? message : "An unexpected error occurred";
        }

        return Promise.reject({ message });
    }
};
