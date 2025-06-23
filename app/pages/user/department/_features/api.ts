import { removeUser } from '@/app/utils/user/userData';
import { Department } from './../../../../lib/type';
import { AxiosInstance } from "axios";

export const fetchDepartments = async (
    axios: AxiosInstance,
    queryParams?: { 
        page?: number; 
        limit?: number; 
        businessUserId?: string;
    }
) => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
            businessUserId: queryParams?.businessUserId || null
        };
        const res = await axios.get(`/department-mgt/all-business-departments`, {params});
        if (res?.status === 401){
            removeUser();
        } 

        return res.data.department;
    } catch (error: any) {
        console.log(JSON.stringify(error));
        // toast.error(JSON.stringify(error))
        return []; // fallback return

    }
};

export const createDepartment = async (
    axios: AxiosInstance,
    data: Department
) => {
    try {
        const res = await axios.post(`/department-mgt/create-department`, data);
        return res.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message = error?.response?.message;

        switch (statusCode) {
            case 400:
                message = error?.response?.data?.message;
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