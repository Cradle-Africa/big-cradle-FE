import { AxiosInstance, isAxiosError } from "axios";
import type {
	InflowListQueryParams,
	InflowSummaryData,
	InflowSummaryQueryParams,
	InflowTransactionsListResult,
	PaginationMeta,
	PayoutListQueryParams,
	PayoutSummaryData,
	PayoutSummaryQueryParams,
	PayoutTransactionsListResult,
	WalletTransactionList,
} from "@/app/lib/type";

function axiosErrorMessage(error: unknown): string {
	if (isAxiosError(error)) {
		const data = error.response?.data as { message?: string } | undefined;
		if (data?.message && typeof data.message === "string") return data.message;
		return error.message || "Request failed";
	}
	if (error instanceof Error) return error.message;
	return "Request failed";
}

/** Only defined, non-empty string values; numbers as-is. Omits unused filters. */
function toQueryRecord(
	entries: Array<[string, string | number | undefined | null]>
): Record<string, string | number> {
	const out: Record<string, string | number> = {};
	for (const [key, val] of entries) {
		if (val === undefined || val === null) continue;
		if (typeof val === "string") {
			const t = val.trim();
			if (t.length === 0) continue;
			out[key] = t;
		} else {
			out[key] = val;
		}
	}
	return out;
}

function normalizePagination(raw: {
	total?: unknown;
	page?: unknown;
	limit?: unknown;
	pages?: unknown;
}): PaginationMeta {
	return {
		total: Number(raw?.total ?? 0),
		page: Number(raw?.page ?? 1),
		limit: Number(raw?.limit ?? 10),
		pages: Number(raw?.pages ?? 0),
	};
}

function unwrapData<T>(resData: unknown): T {
	if (resData && typeof resData === "object" && "data" in resData) {
		return (resData as { data: T }).data;
	}
	return resData as T;
}

export async function fetchInflowSummary(
	axios: AxiosInstance,
	params: InflowSummaryQueryParams = {}
): Promise<InflowSummaryData> {
	try {
		const query = toQueryRecord([
			["startDate", params.startDate],
			["endDate", params.endDate],
			["paymentStatus", params.paymentStatus],
			["provider", params.provider],
			["businessName", params.businessName],
			["researcherName", params.researcherName],
		]);
		const res = await axios.get("/transaction/transaction-inflow/summary", { params: query });
		return unwrapData<InflowSummaryData>(res.data);
	} catch (e) {
		console.error("fetchInflowSummary:", e);
		throw new Error(axiosErrorMessage(e));
	}
}

export async function fetchInflowTransactions(
	axios: AxiosInstance,
	params: InflowListQueryParams = {}
): Promise<InflowTransactionsListResult> {
	try {
		const page = params.page ?? 1;
		const limit = Math.min(100, Math.max(1, params.limit ?? 10));
		const query = toQueryRecord([
			["startDate", params.startDate],
			["endDate", params.endDate],
			["paymentStatus", params.paymentStatus],
			["provider", params.provider],
			["businessName", params.businessName],
			["researcherName", params.researcherName],
			["page", page],
			["limit", limit],
			["sortBy", params.sortBy],
			["sortOrder", params.sortOrder],
		]);
		const res = await axios.get("/transaction/transaction-inflow", { params: query });
		const body = res.data as {
			data?: unknown[];
			pagination?: Record<string, unknown>;
			filters?: Record<string, unknown>;
		};
		return {
			data: (body.data ?? []) as InflowTransactionsListResult["data"],
			pagination: normalizePagination(body.pagination ?? {}),
			filters: body.filters,
		};
	} catch (e) {
		console.error("fetchInflowTransactions:", e);
		throw new Error(axiosErrorMessage(e));
	}
}

export async function fetchPayoutSummary(
	axios: AxiosInstance,
	params: PayoutSummaryQueryParams = {}
): Promise<PayoutSummaryData> {
	try {
		const query = toQueryRecord([
			["startDate", params.startDate],
			["endDate", params.endDate],
			["payoutStatus", params.payoutStatus],
			["paymentType", params.paymentType],
			["businessName", params.businessName],
			["researcherName", params.researcherName],
		]);
		const res = await axios.get("/transaction/payout-outflow/summary", { params: query });
		return unwrapData<PayoutSummaryData>(res.data);
	} catch (e) {
		console.error("fetchPayoutSummary:", e);
		throw new Error(axiosErrorMessage(e));
	}
}

export async function fetchPayoutTransactions(
	axios: AxiosInstance,
	params: PayoutListQueryParams = {}
): Promise<PayoutTransactionsListResult> {
	try {
		const page = params.page ?? 1;
		const limit = Math.min(100, Math.max(1, params.limit ?? 10));
		const query = toQueryRecord([
			["startDate", params.startDate],
			["endDate", params.endDate],
			["payoutStatus", params.payoutStatus],
			["paymentType", params.paymentType],
			["businessName", params.businessName],
			["researcherName", params.researcherName],
			["page", page],
			["limit", limit],
			["sortBy", params.sortBy],
			["sortOrder", params.sortOrder],
		]);
		const res = await axios.get("/transaction/payout-outflow", { params: query });
		const body = res.data as {
			data?: unknown[];
			pagination?: Record<string, unknown>;
			filters?: Record<string, unknown>;
		};
		return {
			data: (body.data ?? []) as WalletTransactionList[],
			pagination: normalizePagination(body.pagination ?? {}),
			filters: body.filters,
		};
	} catch (e) {
		console.error("fetchPayoutTransactions:", e);
		throw new Error(axiosErrorMessage(e));
	}
}

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
	} catch (error: unknown) {
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
	} catch (error: unknown) {
		console.error("Error processing payout:", error);
		throw new Error(axiosErrorMessage(error));
	}
};
