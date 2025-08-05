import { CreateWalletPayload } from "@/app/lib/type";
import { AxiosInstance } from "axios";


export const createWallet = async (
    axios: AxiosInstance,
    data: CreateWalletPayload
) => {
    try {
        const response = await axios.post('/wallet-mgt', data);
        return response.data;
    } catch (error: any) {
        const statusCode = error?.response?.status;
        let message =
            error?.response?.data?.message || error?.message || "An unexpected error occurred";

        switch (statusCode) {
            case 400:
                if (Array.isArray(message)) {
                    message = message.join('\n');
                }
                break;
            default:
                message = typeof message === 'string' ? message : "An unexpected error occurred";
        }

        return Promise.reject({ message });
    }
};


export const fetchWallet = async (axios: AxiosInstance, userId: string) => {
    try {
        const res = await axios.get(`/wallet-mgt/${userId}?userId=${userId}`, {
            headers: {
                Authorization: null,
            }
        });

        return res.data.data;
    } catch (error: any) {
        console.error("Fetch wallet error:", error);
        return []
    }
};


export const fetchTransactions = async (
    axios: AxiosInstance,
    queryParams: {
        businessUserId: string;
        departmentId: string;
        startDate: string;
        endDate: string;
        search: string;
        page: number;
        limit: number;
    }
): Promise<{
    data: Pipeline[];
    limit: number;
    page: number;
    total: number;
    pages: number;

}> => {
    try {
        const { departmentId, businessUserId, startDate, endDate, search, page = 1, limit = 10 } = queryParams;
        const params = { departmentId, businessUserId, startDate, endDate, search, page, limit };

        const res = await axios.get('/data-point-mgt/data-point', {
            params: params, //pass query string
        });
        const pagination = res.data.pagination || {};

        return {
            data: res.data.data ?? [],
            limit: Number(pagination.limit) || limit,
            page: Number(pagination.page) || page,
            total: Number(pagination.total) || 0,
            pages: Number(pagination.pages) || 1,
        };
    } catch (error: any) {
        console.log(JSON.stringify(error));
        return {
            data: [],
            limit: 10,
            page: 1,
            total: 0,
            pages: 1,
        };
    }
};