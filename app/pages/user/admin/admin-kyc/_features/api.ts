import { removeUser } from '@/app/utils/user/userData';
import { AdminKyc, PaginationMeta, ReviewAdminKyc } from '@/app/lib/type';
import { AxiosInstance } from "axios";

export const fetchAdminKyc = async (
  axios: AxiosInstance,
  queryParams?: {
    page?: number;
    limit?: number;
    adminUserId?: string | null;
    businessUserId?: string | null;
  }
): Promise<{
  data: AdminKyc[];
  pagination: PaginationMeta;
}> => {
  try {
    const params = {
      page: queryParams?.page || 1,
      limit: queryParams?.limit || 10,
      adminUserId: queryParams?.adminUserId ?? undefined,
      businessUserId: queryParams?.businessUserId ?? undefined,
    };

    const res = await axios.get("/super-admin-auth/all-admin-kyc-review", { params });

    const pagination: PaginationMeta = {
      page: Number(res.data.pagination.page),
      limit: Number(res.data.pagination.limit),
      total: Number(res.data.pagination.total),
      pages: Number(res.data.pagination.pages),
    };

    return {
      data: res.data.data ?? [],
      pagination,
    };
  } catch (error: any) {
    console.error("Fetch Admin KYC error:", JSON.stringify(error));

    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        pages: 1,
        total: 0,
      },
    };
  }
};


export const reviewAdminKyc = async (
  axios: AxiosInstance,
  data: ReviewAdminKyc
) => {
  try {
    const res = await axios.post(`/super-admin-auth/review-admin-kyc`, data);
    return res.data;
  } catch (error: any) {
    const statusCode = error?.response?.status;
    let message = error?.response?.data?.message || "An unexpected error occurred";

    switch (statusCode) {
      case 400:
        message = error?.response?.data?.message;
        break;
      case 401:
        removeUser();
        break;
      default:
        message = "An unexpected error occurred";
    }

    const customError = new Error(message);
    throw customError;
  }
};

