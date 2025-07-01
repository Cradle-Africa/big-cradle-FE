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
): Promise<{
  data: Department[];
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

    const res = await axios.get(`/department-mgt/all-business-departments`, { params });

    return {
      data: res.data.department ?? [],
      limit: Number(res.data.limit),
      page: Number(res.data.page),
      total: Number(res.data.total),
    };
  } catch (error: any) {
    console.error("Fetch Departments Error:", JSON.stringify(error));
    return {
      data: [],
      limit: 10,
      page: 1,
      total: 0,
    };
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

export const updateDepartment = async (
  axios: AxiosInstance,
  id: string,
  data: Department
) => {
  try {
    const res = await axios.put(`/department-mgt/update-department/${id}`, data);
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
        break;

      default:
        message = "An unexpected error occurred";
    }

    throw new Error(message);
  }
};
