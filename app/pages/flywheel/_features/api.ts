import { removeUser } from '@/app/utils/user/userData';
import { DataPoint, Pipeline } from './../../../lib/type';
import { getBusinessId } from '@/app/utils/user/userData';
import { AxiosInstance } from "axios";

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




export const fetchPipelines = async (
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
        const res = await axios.get(`/data-point-mgt/pipeline-fields/business/${getBusinessUserId}`, {params});
        if (res?.status === 401){
            removeUser();
        } 
        return res.data;
    } catch (error: any) {
        console.log(JSON.stringify(error));
        return []; // fallback return
    }
};

export const createPipeline = async (
    axios: AxiosInstance,
    data: Pipeline
) => {
    try {
        const res = await axios.post(`/data-point-mgt/create-pipeline-via-fields`, data);
        return res.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

        switch (statusCode) {
            case 400:
                message =  message;
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