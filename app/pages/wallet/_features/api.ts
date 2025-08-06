import { CreateTransactionPayload, CreateWalletPayload, FlutterWavePaymentSubmit, PaginationMeta, WalletTransactionList } from "@/app/lib/type";
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
        return res.data; // Return the full response data
    } catch (error: any) {
        // Throw the error properly so React Query can catch it
        throw error.response?.data || new Error('Failed to fetch wallet');
    }
};


export const fetchTransactions = async (
    axios: AxiosInstance,
    queryParams: { userId: string }
): Promise<{
    data: WalletTransactionList[];
    pagination: PaginationMeta;
}> => {
    try {
        const { userId } = queryParams;

        const res = await axios.get('/transaction/history', {
            params: { userId },
        });

        const pagination = res.data.pagination || {};

        return {
            data: res.data.data ?? [],
            pagination: {
                limit: Number(pagination.limit) || 10,
                page: Number(pagination.page) || 1,
                total: Number(pagination.total) || 0,
                pages: Number(pagination.pages) || 1,
            },
        };
    } catch (error: any) {
        console.error('Transaction fetch error:', error?.response?.data || error.message);

        return {
            data: [],
            pagination: {
                limit: 10,
                page: 1,
                total: 0,
                pages: 1,
            },
        };
    }
};


export const createTransaction = async (
    axios: AxiosInstance,
    data: CreateTransactionPayload
) => {
    try {
        const response = await axios.post('/transaction', data);
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


export const initiateTransaction = async (
    axios: AxiosInstance,
    payload: FlutterWavePaymentSubmit
): Promise<{ link: string }> => {
    const response = await axios.post('/payments/flutterwave/initialize', payload);
    return { link: response.data.data?.link };
};



export const verifyTransaction = async (axios: AxiosInstance, txRef: string) => {
    try {
        const res = await axios.post(
            `/transaction/verify?tx_ref=${txRef}`
        );
        return res.data;
    } finally {
    }
};