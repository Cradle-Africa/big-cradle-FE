
import { getEmployeeUserId, getToken, getUser, removeUser } from '@/app/utils/user/userData';
import { DataEntry, DataPoint, Pipeline } from './../../../lib/type';
import { getBusinessId } from '@/app/utils/user/userData';
import { AxiosInstance } from "axios";
import { axiosWithoutAuth } from '@/app/lib/axios';

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
    const params = {
        page: queryParams?.page || 1,
        limit: queryParams?.limit || 10,
        total: queryParams?.total,
    };

    let endpoint = '';
    let userIdParam = '';

    if (user?.role === 'business') {
        const businessUserId = getBusinessId() || null;
        endpoint = `/data-point-mgt/pipeline-fields-business`;
        userIdParam = `businessUserId=${businessUserId}`;
    } else {
        endpoint = `/data-point-mgt/pipeline-fields-employee`;
        userIdParam = `employeeUserId=${employeeUserId}`;
    }

    try {
        const res = await axios.get(`${endpoint}?${userIdParam}`, { params });

        const pagination = res.data.pagination
            ? {
                  ...res.data.pagination,
                  page: Number(res.data.pagination.page),
                  limit: Number(res.data.pagination.limit),
                  pages: Number(res.data.pagination.pages),
              }
            : null;

        return {
            data: res.data.data || [],
            pagination,
        };
    } catch (error: any) {
        console.error('Fetch pipeline error:', JSON.stringify(error));
        return {
            data: [],
            pagination: null,
        };
    }
};



export const fetchSingleDataPoint = async (axios: AxiosInstance, id: string) => {
    try {
        const res = await axiosWithoutAuth.get(`/data-point-mgt/pipeline-fields/${id}`, {
            headers: {
                Authorization: null, 
            }});
       
        return res.data.data;
    } catch (error: any) {
        console.error("Fetch single data type error:", error);
        return []
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
    const params = {
        page: queryParams?.page || 1,
        limit: queryParams?.limit || 10,
    };

    let endpoint = '';
    let userIdParam = '';

    if (user?.role === 'business') {
        const businessUserId = getBusinessId() || null;
        endpoint = `/data-point-mgt/pipeline-fields-entry-business`;
        userIdParam = `businessUserId=${businessUserId}`;
    } else {
        endpoint = `/data-point-mgt/pipeline-fields-entry-employee`;
        userIdParam = `employeeUserId=${employeeUserId}`;
    }

    try {
        const res = await axios.get(`${endpoint}?${userIdParam}`, { params });

        if (res?.status === 401) {
            removeUser();
        }

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
    }
};


export const analyseData = async (
    axios: AxiosInstance,
    endpoint: string,
    businessUserId: string,
    prompt: string
) => {
    try {
        const res = await axios.post(
            `/ai/analyze/${endpoint}?businessUserId=${businessUserId}`,
            { prompt },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`, 
                },
            }
        );
        return res.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message =
            error?.response?.data?.message || error?.message || "An unexpected error occurred";

        if (statusCode === 401) {
            removeUser(); 
            message = "Unauthorized access. Please log in again.";
        }

        return Promise.reject({ message });
    }
};
