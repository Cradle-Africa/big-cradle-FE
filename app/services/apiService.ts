import { ApiRequestOptions } from '../types/User';
import { BASE_URL } from './base';
import { getToken} from '../utils/user/userData';

export const apiPostService = async (endPoint: string, method: string, payload: ApiRequestOptions) => {
    const response = await fetch(`${BASE_URL}/${endPoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'request failed');
    }
    return data;
};


export const apiGetService = async (endPoint: string, method: string) => {
    const response = await fetch(`${BASE_URL}/${endPoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'request failed');
    }
    return data;
};


export const apiGetPaginateService = async (
    endpoint: string,
    queryParams?: { page?: number; limit?: number },
) => {
    const accessToken = getToken();

    if (!accessToken) {
        throw new Error('No authentication token found');
    }

    const queryString = new URLSearchParams({
            page: String(queryParams?.page || 1),
            limit: String(queryParams?.limit || 10),
        }).toString()
    const response = await fetch(
        `${BASE_URL}/${endpoint}?${queryString}`,
        {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Add the token
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
            // Clear invalid token
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            throw new Error('Unauthorized');
        }
        throw new Error(errorData.message || 'Failed to fetch data');
    }


    const data = await response.json();
    return data;
};