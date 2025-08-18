import { getUser, removeUser } from '@/app/utils/user/userData';
import { Business, InviteBusiness } from '@/app/lib/type';
import { AxiosInstance } from "axios";

export const fetchBusinesses = async (
    axios: AxiosInstance,
    queryParams?: {
        page?: number;
        limit?: number;
        adminUserId?: string | null;
    }
): Promise<{
    data: Business[];
    limit: number;
    page: number;
    total: number;
}> => {
    const user = getUser();
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
            adminUserId: queryParams?.adminUserId || undefined,
        };
        let endpoint = ''
        if (user?.role === 'admin' && queryParams?.adminUserId !== null && queryParams?.adminUserId !== undefined) {
            endpoint = `/manage-business/all-admin-user-businesses`;
            const res = await axios.get(endpoint, { params });

            return {
                data: res.data.businessUser ?? res.data.businessUsers ?? [],
                limit: Number(res.data.limit),
                page: Number(res.data.page),
                total: Number(res.data.total),
            };
        } else if (user?.role === 'super admin') {
            endpoint = `/manage-business`;
            const res = await axios.get(endpoint, { params });

            return {
                data: res.data.businessUser ?? res.data.businessUsers ?? [],
                limit: Number(res.data.limit),
                page: Number(res.data.page),
                total: Number(res.data.total),
            };
        }

        return {
            data: [],
            limit: Number(0),
            page: Number(0),
            total: Number(0),
        };


    } catch (error) {
        console.error("Error fetching businesses:", error);
        return {
            data: [],
            limit: 10,
            page: 1,
            total: 0,
        };
    }
};

export const inviteBusiness = async (
    axios: AxiosInstance,
    data: InviteBusiness
) => {
    try {
        const res = await axios.post(`/manage-business/invite-business-user`, data);
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


export const deleteBusinesse = async (
    axios: any,
    businessUserId: string
) => {
    try {
        const res = await axios.delete(`/manage-business/${businessUserId}`);

        if (res?.status === 401) {
            removeUser();
        }

        return res.data;
    } catch (error: any) {
        console.error("Error deleting business:", error);
        throw error;
    }
};



export const resetPasswordBusiness = async (
    axios: any,
    businessUserId: string
) => {
    try {
        const res = await axios.put(`/manage-business/change-password/${businessUserId}`);

        if (res?.status === 401) {
            removeUser();
        }

        return res.data;
    } catch (error: any) {
        console.error("Error resetting business password", error);
        throw error;
    }
};


export const fetchSingleBusiness = async (axios: AxiosInstance, businessUserId: string) => {
    try {
        const res = await axios.get(`/manage-business/${businessUserId}`, {
            headers: {
                Authorization: null,
            }
        });

        return res.data.businessUser;
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return []
    }
};

