import { AxiosInstance } from "axios";
import { WalletTransactionList, PaginationMeta } from "@/app/lib/type";

// In your api.ts file
export const fetchInFlowTransactions = async (
    axios: AxiosInstance,
    queryParams?: { page?: number; limit?: number }
): Promise<{ data: WalletTransactionList[]; pagination: PaginationMeta }> => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
        };

        const res = await axios.get(`/transaction/transaction-inflow`, { params });

        const total = Number(res.data.pagination?.total ?? 0);
        const page = Number(res.data.pagination?.page ?? 1);
        const limit = Number(res.data.pagination?.limit ?? 10);
        const pages = Number(res.data.pagination?.pages ?? 0);

        
        return {
            data: res.data.data ?? [],
            pagination: {
                total: total,
                page: page,
                limit: limit,
                pages: pages
            },
        };
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return {
            data: [],
            pagination: { total: 0, page: 1, limit: 10, pages: 0 },
        };
    }
};



export const fetchOutFlowTransactions = async (
    axios: AxiosInstance,
    queryParams?: { page?: number; limit?: number }
): Promise<{ data: WalletTransactionList[]; pagination: PaginationMeta }> => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
        };

        const res = await axios.get(`/transaction/transaction-outflow`, { params });

        return {
            data: res.data.data ?? [],
            pagination: {
                total: Number(res.data.pagination.total ?? 0),
                page: Number(res.data.pagination.page ?? 1),
                limit: Number(res.data.pagination.limit ?? 10),
                pages: Number(res.data.pagination.pages ?? 0),
            },
        };
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return {
            data: [],
            pagination: { total: 0, page: 1, limit: 10, pages: 0 },
        };
    }
};




export const fetchPayoutTransactions = async (
    axios: AxiosInstance,
    queryParams?: { page?: number; limit?: number }
): Promise<{ data: WalletTransactionList[]; pagination: PaginationMeta }> => {
    try {
        const params = {
            page: queryParams?.page || 1,
            limit: queryParams?.limit || 10,
        };

        const res = await axios.get(`/transaction/payout-outflow`, { params });

        return {
            data: res.data.data ?? [],
            pagination: {
                total: Number(res.data.pagination.total ?? 0),
                page: Number(res.data.pagination.page ?? 1),
                limit: Number(res.data.pagination.limit ?? 10),
                pages: Number(res.data.pagination.pages ?? 0),
            },
        };
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return {
            data: [],
            pagination: { total: 0, page: 1, limit: 10, pages: 0 },
        };
    }
};

export const payOut = async (
    axios: AxiosInstance,
    payoutId: string,
    payoutStatus: string
): Promise<void> => {
    try {
        await axios.put(`/transaction/payout/status`, { payoutId, payoutStatus });
    } catch (error: any) {
        console.error("Error processing payout:", error);
        throw new Error(error?.response?.data?.message || 'Failed to process payout');
    }
};