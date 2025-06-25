
import { getEmployeeUserId, getUser, removeUser } from '@/app/utils/user/userData';
import { DataEntry, DataPoint, Pipeline } from './../../../lib/type';
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
            const pagination = {
                ...res.data.pagination,
                page: Number(res.data.pagination.page),
                limit: Number(res.data.pagination.limit),
                pages: Number(res.data.pagination.pages),
            };

            return {
                data: res.data.data,
                pagination,
            };
        } else {
            const res = await axios.get(`/data-point-mgt/pipeline-fields-employee?employeeUserId=${employeeUserId}`, { params });
            return res.data;
        }
    } catch (error: any) {
        console.log(JSON.stringify(error));
        return []; // fallback return
    }
};

export const fetchSingleDataPoint = async (axios: AxiosInstance, id: string) => {
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

export const createDataEntry = async (
    axios: AxiosInstance,
    data: DataEntry
) => {
    try {
        const res = await axios.post(`/data-point-mgt/pipeline-fields-entry`, data);
        return res.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.data?.message || error?.response?.message;

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


export const fetchDataEntries = async (
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

        const res = await axios.get(`/data-point-mgt/pipeline-fields-entry?businessUserId=${businessUserId}`, {
            params,
        });

        if (res?.status === 401) {
            removeUser();
        }

        // Coerce pagination values to numbers
        const pagination = {
            ...res.data.pagination,
            page: Number(res.data.pagination.page),
            limit: Number(res.data.pagination.limit),
            pages: Number(res.data.pagination.pages),
        };

        return {
            data: res.data.data,
            pagination,
        };
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.data?.message || error?.response?.message;

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
        // return {
        //     data: [],
        //     pagination: { page: 1, limit: 10, pages: 1, total: 0 },
        // };
    }
};
