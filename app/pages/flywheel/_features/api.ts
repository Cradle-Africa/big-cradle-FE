import { getEmployeeUserId, getUser, removeUser } from '@/app/utils/user/userData';
import { DataPoint, Pipeline } from './../../../lib/type';
import { getBusinessId } from '@/app/utils/user/userData';
import { AxiosInstance } from "axios";

const user = getUser()
const employeeUserId = getEmployeeUserId()
let businessUserId: string | null = null;

if (user?.role === 'business') {
    businessUserId = getBusinessId() || null;
} else {
    businessUserId = user?.businessUserId || null;
}

export const fetchPipelines = async (
    axios: AxiosInstance,
    queryParams?: {
        page?: number;
        limit?: number;
        total?: number;
    }
) => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
            total: queryParams?.total
        };
        if (user?.role === 'business') {
            const res = await axios.get(`/data-point-mgt/pipeline-fields-business?businessUserId=${businessUserId}`, { params });
            return res.data;
        } else {
            const res = await axios.get(`/data-point-mgt/pipeline-fields-employee?employeeUserId=${employeeUserId}`, { params });
            return res.data;
        }
    } catch (error: any) {
        console.log(JSON.stringify(error));
        return []; // fallback return
    }
};

export const fetchSinglePipeline = async (axios: AxiosInstance, id: string) => {
    try {
        const res = await axios.get(`/data-point-mgt/pipeline-fields/${id}`);
        if (res.status === 401) {
            removeUser();
        }
        return res.data.data;
    } catch (error: any) {
        console.error("Fetch single data type error:", error);
    }
};


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
        const res = await axios.get(`/data-point-mgt/data-point?businessUserId=${businessUserId}`, { params });
        if (res?.status === 401) {
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
        const res = await axios.post(`/data-point-mgt/data-point`, data);
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


export const createDataPoint = async (
    axios: AxiosInstance,
    data: DataPoint
) => {
    try {
        const res = await axios.post(`/data-point-mgt/create-pipeline-via-fields`, data);
        return res.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

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

export const editPipeline = async (
    axios: AxiosInstance,
    id: string,
    data: Pipeline
) => {
    try {
        const res = await axios.put(`/data-point-mgt/data-point/${id}`, data);
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
