import { Admin } from "@/app/lib/type";
import { AxiosInstance } from "axios";

export const fetchAdmins = async (
    axios: AxiosInstance,
    queryParams?: { 
        page?: number; 
        limit?: number; 
    }
): Promise<{
    data: Admin[];
    limit: number;
    page: number;
    total: number;
}> => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
        };
        const endpoint = 'admin-auth/get-all-admins?page=1&limit=10';

        const res = await axios.get(endpoint, { params });

        return {
            data: res.data.adminUsers ?? [],
            limit: Number(res.data.limit),
            page: Number(res.data.page),
            total: Number(res.data.total),
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            data: [],
            limit: 10,
            page: 1,
            total: 0,
        };
    }
};


