import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { BASE_URL } from './base';
import { getToken, removeUser, updateUserKycStatus } from '../utils/user/userData';

// Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor with type
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        } else {
            throw new Error('No authentication token found');
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor with type
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            removeUser();
        }
        return Promise.reject(error);
    }
);

// POST or PUT service
export const apiPostService = async <T extends object>(endPoint: string, method: string, payload: T) => {
    try {
        const response = await apiClient.request({
            url: endPoint,
            method,
            data: payload,
        });

        updateUserKycStatus(endPoint);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ message?: string | string[] }>;
        const message = err.response?.data?.message;

        if (err.response?.status === 400 && message) {
            const errorMessage = Array.isArray(message) ? message.join('\n') : message;
            throw new Error(errorMessage);
        }

        throw new Error(typeof message === 'string' ? message : 'Request failed');
    }
};

// GET service
export const apiGetService = async (endPoint: string) => {
    try {
        const response = await apiClient.get(endPoint);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        throw new Error(err.response?.data?.message || 'Request failed');
    }
};

// GET with pagination
export const apiGetPaginateService = async (
    endpoint: string,
    queryParams?: { page?: number; limit?: number; businessUserId?: string | null }
) => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
            businessUserId: queryParams?.businessUserId || undefined,
        };

        const response = await apiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        throw new Error(err.response?.data?.message || 'Request failed');
    }
};
