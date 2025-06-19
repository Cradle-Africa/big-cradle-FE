import { removeUser } from '@/app/utils/user/userData';
import { DataPoint } from './../../../lib/type';
import { getBusinessId } from '@/app/utils/user/userData';
import { AxiosInstance } from "axios";
import toast from "react-hot-toast";

const getBusinessUserId = getBusinessId()


export const fetchDataPoints = async (
    axios: AxiosInstance,
    queryParams?: { 
        page?: number; 
        limit?: number; 
    }
) => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
        };
        const res = await axios.get(`/data-point-mgt/data-point/${getBusinessUserId}`, {params});
        if (res?.status === 401){
            removeUser();
        } 
        return res.data;
    } catch (error: any) {
        console.log(JSON.stringify(error));
        // toast.error(JSON.stringify(error))
        return []; // fallback return

    }
};

export const createDataPoint = async (
    axios: AxiosInstance,
    data: DataPoint
) => {
    try {
        const res = await axios.post(`/data-point-mgt/data-point`, data);
        return res.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

        switch (statusCode) {
            case 400:
                message = Array.isArray(message) ? message.join('\n') : message;
                break;

            case 401:
                removeUser();
                        
            default:
                message = "An unexpected error occurred";
        }

        const customError = new Error(message);
        throw customError;
    }
};