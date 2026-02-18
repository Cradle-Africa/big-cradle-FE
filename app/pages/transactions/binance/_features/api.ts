import { AxiosInstance } from "axios";
import type {
	BinanceTransaction,
	BinanceTransactionsResponse,
	BinanceSyncResponse,
	BinanceSummary,
	PaginationMeta,
} from "@/app/lib/type";

export type FetchBinanceTransactionsParams = {
	startDate?: string;
	endDate?: string;
	page?: number;
	limit?: number;
	sortOrder?: "asc" | "desc";
};

export type FetchBinanceTransactionsResult = {
	data: BinanceTransaction[];
	pagination: PaginationMeta;
	dateRange: { minDate: number; maxDate: number } | null;
	summary: BinanceSummary | null;
};

export async function fetchBinanceTransactions(
	axios: AxiosInstance,
	params: FetchBinanceTransactionsParams = {}
): Promise<FetchBinanceTransactionsResult> {
	const { startDate, endDate, page = 1, limit = 20, sortOrder = "desc" } = params;
	const query: Record<string, string | number> = { page, limit, sortOrder };
	if (startDate) query.startDate = startDate;
	if (endDate) query.endDate = endDate;

	const res = await axios.get<BinanceTransactionsResponse>("/binance/transactions", {
		params: query,
	});
	const d = res.data;
	return {
		data: d.data ?? [],
		pagination: {
			total: d.pagination?.total ?? 0,
			page: d.pagination?.page ?? 1,
			limit: d.pagination?.limit ?? 20,
			pages: d.pagination?.totalPages ?? 0,
		},
		dateRange: d.dateRange ?? null,
		summary: d.summary ?? null,
	};
}

export async function triggerBinanceSync(
	axios: AxiosInstance
): Promise<BinanceSyncResponse> {
	const res = await axios.get<BinanceSyncResponse>("/binance/sync");
	return res.data;
}
