import { BASE_URL } from './base';
import { getToken, removeUser } from '../utils/user/userData';

export const apiPostService = async <T extends object>(endPoint: string, method: string, payload: T) => {
    const accessToken = getToken();
    if (!accessToken) {
        throw new Error('No authentication token found');
    }

    const headers: HeadersInit = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    // Convert payload to JSON string
    const body = JSON.stringify(payload);

    const response = await fetch(`${BASE_URL}/${endPoint}`, {
        method: method,
        headers: headers,
        body: body,
    });

    if (response.status === 401) {
        removeUser();
        throw new Error('Unauthorized');
    }

    const data = await response.json();
    if (!response.ok) {
        if (response.status === 400 && data.message) {
            // Handle validation errors
            const errorMessage = Array.isArray(data.message) ?
                data.message.join('\n') :
                data.message;
            throw new Error(errorMessage);
        }
        throw new Error(data.message || 'Request failed');
    }
    return data;
};


export const apiGetService = async (endPoint: string, method: string) => {
    const accessToken = getToken();
    if (!accessToken) {
        throw new Error('No authentication token found');
    }
    const response = await fetch(`${BASE_URL}/${endPoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401) {
        removeUser()
        throw new Error('Unauthorized');
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'request failed');
    }
    return data;
};


export const apiGetPaginateService = async (endpoint: string, queryParams?: { page?: number; limit?: number; businessUserId?: string | null },) => {
    const accessToken = getToken();

    if (!accessToken) {
        throw new Error('No authentication token found');
    }

    const queryString = new URLSearchParams({
        page: String(queryParams?.page || 1),
        limit: String(queryParams?.limit || 10),
        businessUserId: String(queryParams?.businessUserId || '')
    }).toString()
    const response = await fetch(
        `${BASE_URL}/${endpoint}?${queryString}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        }
    );

    if (response.status === 401) {
        removeUser()
        throw new Error('Unauthorized');
    }
    const data = await response.json();
    return data;
};