import { Employee, InviteEmployee } from "@/app/lib/type";
import { AxiosInstance } from "axios";



export const fetchEmployees = async (
    axios: AxiosInstance,
    queryParams?: {
        page?: number;
        limit?: number;
        businessUserId?: string;
    }
): Promise<{
    data: Employee[];
    limit: number;
    page: number;
    total: number;
}> => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
            businessUserId: queryParams?.businessUserId ?? undefined,
        };

        const res = await axios.get(`/manage-employee/all-business-user-employeees`, { params });

        return {
            data: res.data.employeeUser ?? [],
            limit: Number(res.data.limit),
            page: Number(res.data.page),
            total: Number(res.data.total),
        };
    } catch (error: any) {
        console.error("Failted to fetch data:", JSON.stringify(error));
        return {
            data: [],
            limit: 10,
            page: 1,
            total: 0,
        };
    }
};

export const inviteEmployee = async (
    axios: AxiosInstance,
    data: InviteEmployee
) => {
    try {
        const res = await axios.post(`/manage-employee/invite-employee-user`, data);
        return res.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

        switch (statusCode) {
            case 400:
                message = error?.response?.data?.message;
                break;

            default:
                message = "An unexpected error occurred";
        }

        const customError = new Error(message);
        throw customError;
    }
};

export const suspendEmployee = async (axios: AxiosInstance, id: string) => {
    try {
        const response = await axios.put(`/manage-employee/${id}/suspendEmployeeAccount`);
        return response.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

        switch (statusCode) {
            case 400:
                message = error?.response?.data?.message || 'Invalid request';
                break;
            case 401:
                message = 'Unauthorized';
                break;
            case 404:
                message = 'Not found';
                break;
            default:
                message = 'An unexpected error occurred';
        }

        throw new Error(message);
    }
};

export const activateEmployee = async (axios: AxiosInstance, id: string) => {
    try {
        const response = await axios.put(`/manage-employee/${id}/activateEmployeeAccount`);
        return response.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

        switch (statusCode) {
            case 400:
                message = error?.response?.data?.message || 'Invalid request';
                break;
            case 401:
                message = 'Unauthorized';
                break;
            case 404:
                message = 'Not found';
                break;
            default:
                message = 'An unexpected error occurred';
        }

        throw new Error(message);
    }
};

