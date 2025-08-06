import { removeUser } from '@/app/utils/user/userData';
import { ResearcherKyc, PaginationMeta, ReviewResearcherKyc } from '@/app/lib/type';
import { AxiosInstance } from "axios";


export const fetchResearcherKyc = async (
  axios: AxiosInstance,
  queryParams?: {
    page?: number;
    limit?: number;
  }
): Promise<{
  data: ResearcherKyc[];
  pagination: PaginationMeta;
}> => {
  try {
    const params = {
      page: queryParams?.page || 1,
      limit: queryParams?.limit || 10,
    };

    const res = await axios.get(`/super-admin-auth/all-researchers-kyc-review`, { params });

    if (res?.status === 401) {
      removeUser();
    }

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
    console.error("Error fetching  data:", JSON.stringify(error));
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


export const reviewResearcherKyc = async (
  axios: AxiosInstance,
  data: ReviewResearcherKyc
) => {
  try {
    const res = await axios.post(`/super-admin-auth/review-researcher-kyc`, data);
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

