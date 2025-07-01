import { getAdminUserId, removeUser } from '@/app/utils/user/userData';
import { Business, InviteBusiness } from '@/app/lib/type';
import { AxiosInstance } from "axios";

const adminUserId = getAdminUserId()

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
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
            adminUserId: adminUserId || undefined,
        };

        const res = await axios.get(`/manage-business/all-admin-user-businesses`, { params });

        if (res?.status === 401) {
            removeUser();
        }

        return {
            data: res.data.businessUser ?? [],
            limit: Number(res.data.limit),
            page: Number(res.data.page),
            total: Number(res.data.total),
        };
    } catch (error: any) {
        console.log(JSON.stringify(error));

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
