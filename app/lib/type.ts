import { z } from "zod";
import {
	pipeLineSchema,
	departmentSchema,
	inviteBusinessSchema,
	surveySchema,
	surveyPaymentSchema,
	reviewBusinessKycSchema,
	reviewAdminKycSchema,
	demographicSchema,
	analyseSocialMediaSchema,
	transactionSchema,
	inviteEmployeeSchema,
	reviewResearcherKycSchema,
} from "./validationSchemas";
import { ReactNode } from "react";

export type LocationOption = {
	id: number;
	name: string;
};

export type AgeGroupOption = {
	label: string;
	value: string;
};

export type Country = {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	numeric_code: string;
	phone_code: string;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	tld: string;
	native: string;
	region: string;
	subregion: string;
	latitude: string;
	longitude: string;
	emoji: string;
	hasStates: boolean;
};

export type State = {
	id: number;
	name: string;
	state_code: string;
	hasCities: boolean;
};

export interface PaginationMeta {
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export interface Pagination {
	total: number;
	page: number;
	limit: number;
	pages?: number;
}

export type Department = {
	id?: string;
	businessUserId: string | null;
	departmentName: string;
	departmentDescription: string;
};

export type InviteBusiness = {
	email: string;
	adminBusinessUserId: string;
};

export type ReviewBusinessKyc = {
	action: string;
	reason: string;
	businessUserId: string;
	adminUserId: string;
};

export type ReviewResearcherKyc = {
	businessUserId: string,
	adminUserId: string,
	researcherUserId: string,
	action: string,
	reason: string
}

export type ReviewAdminKyc = {
	action: string;
	reason: string;
	businessUserId: string;
	adminUserId: string;
};

// export type CountryAndCity = {
// 	country: string;
// 	state: string;
// 	city: string,
// };


export type CountryAndCity = {
  country: string;
  state: string;
  city: string;
  ageDemographics: string[];
  gender: string[];
};


export type Business = {
	id: string;
	businessName: string;
	contactPersonFirstName: string;
	contactPersonLastName: string;
	contactName: string;
	countryCode: string;
	contactNumber: string;
	businessAddress: string;
	businessCity: string;
	businessState: string;
	businessCountry: string;
	sector: string;
	organizationSize: string;
	email: string;
	isActive: string;
	kycStatus: string;
	password: string;
	confirmPassword: string;
	businessLogo: string;
	role: string;
};

export type BusinessKyc = {
	id: string;
	businessName: string;
	contactPersonFirstName: string;
	contactPersonLastName: string;
	contactName: string;
	countryCode: string;
	contactNumber: string;
	businessAddress: string;
	businessCity: string;
	businessState: string;
	businessCountry: string;
	sector: string;
	organizationSize: string;
	email: string;
	isActive: string;
	kycStatus: string;
	kycReviewReason: string;
	certificateOfIncorporation: string;
};


export type Admin = {
	kycReviewReason: string | null;
	id: string;
	userType: string;
	fullName: string;
	businessName: string;
	firstName: string;
	lastName: string;
	email: string;
	countryCode: string;
	phoneNumber: string;
	address: string;
	city: string;
	state: string;
	country: string;
	role: string;
	hash: string;
	certificateOfIncorporation: string | null;
	individualValidMeansOfId: string | null;
	kycStatus: string;
}

export type ResearcherKyc = {
	kycReviewReason: string | null;
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	countryCode: string;
	phoneNumber: string;
	address: string;
	city: string;
	state: string;
	country: string;
	isMobileUser: boolean;
	role: string;
	image: string;
	individualValidMeansOfId: string;
	kycStatus: string;
	isVerified: boolean;
};


export type AdminKyc = {
	id: string;
	userType: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	country: string;
	city: string;
	state: string;
	kycStatus: string;
	createdAt: string;
	email: string;
	isActive: string;
	kycReviewReason: string;
	certificateOfIncorporation: string;
};

export type DepartmentSchema = z.infer<typeof departmentSchema>;

export type InviteEmployeeSchema = z.infer<typeof inviteEmployeeSchema>;

export type InviteBusinessSchema = z.infer<typeof inviteBusinessSchema>;

export type ReviewBusinessKycSchema = z.infer<typeof reviewBusinessKycSchema>;

export type ReviewResearcherKycSchema = z.infer<typeof reviewResearcherKycSchema>;

export type ReviewAdminKycSchema = z.infer<typeof reviewAdminKycSchema>;

export type SurveySchema = z.infer<typeof surveySchema>;

export type DemographicSchema = z.infer<typeof demographicSchema>;

export type SurveyPaymentSchema = z.infer<typeof surveyPaymentSchema>;

export type TransactionSchema = z.infer<typeof transactionSchema>;

export type FieldType =
	| "text"
	| "email"
	| "tel"
	| "select"
	| "radio"
	| "checkbox"
	| "textarea"
	| "number"
	| "date"
	| "file"
	| "time"
	| "rating";


export type Field = {
	id?: string;
	label: string;
	key: string;
	type: FieldType;
	required: boolean;
	options?: string[];
	createdAt?: string;
	updatedAt?: string;
};

export type DashboardAnalyticsResponse = {
	success: boolean;
	message: string;
	data: {
		totalSurveys: number;
		totalEntries: number;
		totalAmount: number;
	};
};

export interface DataPointForm {
	dataPointId: string;
	field: Field[];
}

export interface SurveyForm {
	surveyId: string;
	field: Field[];
}

export interface DataPoint {
	id?: string;
	businessUserId: string | null;
	employeeUserId: string | null;
	dataPointId: string;
	field: Field[];
	createdAt?: string;
	dataPointName?: string;
}


// In your type definitions file
// export interface DemographicFormValues {
// 	country: string;
// 	state: string;
// 	city: string;
// 	ageDemographics: string[];
// 	gender: string[];
// }

export type DemographicFormValues = {
  country: string;
  ageDemographics: string[];
  gender: string[];
  state?: string;  // make optional
  city?: string;   // make optional
};



export type DemographicSubmitValues = DemographicFormValues;


export interface Survey {
	id?: string;
	businessUserId: string | null;
	employeeUserId: string | null;
	surveyName: string;
	surveyDescription: string;
	sector: string;
	surveyGoal: string;
	surveyType: string;
	startDate: string;
	endDate: string;
	surveyLocations: {
		country: string;
		state: string;
		city: string;
	}[];
	ageDemographics: string[];
	gender: string[];
	amount: number;
	field: Field[];
}


export type Pipeline = {
	id?: string;
	businessUserId?: string | null;
	employeeUserId?: string | null;
	departmentId: string;
	dataPointName: string;
	dataPointDescription: string;
	createdAt?: string | undefined;
	fieldId?: string;
	isActive?: boolean;
};

export type PipeLineSchema = z.infer<typeof pipeLineSchema>;

export type AnalyseSocialMedia = {
	platform: string;
	link: string;
	prompt: string;
};

export type AnalyseSocialMediaSchema = z.infer<typeof analyseSocialMediaSchema>;

export type DataFlyOverview = {
	totalDataPoints: string,
	totalFields: string,
	totalEntries: string
}
// export type DataEntryField = {
//   key: string;
//   value: string;
// }

export interface DataEntry {
	businessUserId: string | null;
	employeeUserId: string | null;
	fieldId: string;
	dataPointId: string;
	data: Record<string, any>;
	createdAt?: string;
	dataPointName?: string;
}

export interface SurveyEntry {
	businessUserId: string | null;
	employeeUserId: string | null;
	fieldId: string;
	dataPointId: string;
	data: Record<string, any>;
	createdAt?: string;
	surveyName?: string;
}


export type DashboardMenu = {
	title: string;
	subTitle: string;
	value: string;
	icon: ReactNode;
};

export type MeResponse = {
	success: boolean;
	message: string;
	data: Me;
};

export type Me = {
	lockUntil: string | null;
	id: string;
	businessName: string;
	contactPersonFirstName: string;
	contactPersonLastName: string;
	countryCode: string;
	contactNumber: string;
	businessAddress: string;
	businessCity: string;
	businessState: string;
	businessCountry: string;
	sector: string;
	organizationSize: string;
	email: string;
	role: string;
	isVerified: boolean;
	certificateOfIncorporation: string;
	kycStatus: string;
	failedLoginAttempts: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
	kycReviewReason: string;
	firstName: string;
	businessFirstName: string;
	fullName: string;
	userType: string;
};

export type SurveyListResponse = {
	success: boolean;
	message: string;
	survey: SurveyListItem[];
	pagination: Pagination;
};

export type SuperAdminSurveyListResponse = {
	success: boolean;
	message: string;
	data: SurveyListItem[];
	pagination: Pagination;
};

export type FlutterwaveHostedLinkResponse = {
	status: string;
	message: string;
	data: {
		link: string;
	};
};

export type SingleSurveyResponse = {
	success: boolean;
	message: string;
	data: SurveyListItem;
};

export type SurveyListItem = {
	id: string;
	businessUserId: string;
	employeeUserId: string;
	surveyName: string;
	sector: string;
	surveyGoal: string;
	surveyType: string;
	startDate: string;
	endDate: string;
	amount: number;
	surveyDescription: string;
	surveyLocations: {
		country: string;
		state: string;
		city: string;
		location: Location;
	}[];
	field: Field[];
	isActive: boolean;
	paymentStatus: "not-paid" | "paid"; // adjust based on actual possible values
	tx_ref: string;
	createdAt: string; // ISO date string
	updatedAt: string;
	__v: number;
};

export type PaymentVerificationResponse = {
	success: boolean;
	message: string;
	paymentResult: {
		status: string;
		message: string;
		data: {
			id: number;
			tx_ref: string;
			flw_ref: string;
			device_fingerprint: string;
			amount: number;
			currency: string;
			charged_amount: number;
			app_fee: number;
			merchant_fee: number;
			processor_response: string;
			auth_model: string;
			ip: string;
			narration: string;
			status: string;
			payment_type: string;
			created_at: string; // ISO date string
			account_id: number;
			meta: {
				__CheckoutInitAddress: string;
				originatorname: string;
				bankname: string;
				originatoramount: string;
				originatoraccountnumber: string;
			};
			amount_settled: number;
			customer: {
				id: number;
				name: string;
				phone_number: string;
				email: string;
				created_at: string; // ISO date string
			};
		};
	};
};


export type TransactionVerificationResponse = {
	success: boolean;
	message: string;
	data: {
		_id: string;
		walletId: string;
		type: 'credit' | 'debit';
		amount: number;
		paymentStatus: string;
		tx_ref: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
};

export type FlutterWavePaymentSubmit = {
	tx_ref: string;
	amount: number;
	country: string; // selected country
	currency: string; // currency from selected payment method
	redirect_url: string;
	payment_options: string; // code from selected payment method
	customer: {
		email: string;
	};
	customizations: {
		title: string;
		description?: string;
	};
};

export type PaymentProvider = 'flutterwave' | 'kuvarpay';

export type InitializePaymentPayload = {
	reference: string;
	amount: number;
	currency: string;
	redirectUrl: string;
	customerEmail: string;
	customerName?: string;
	title: string;
	description: string;
	provider?: PaymentProvider;
	country?: string;
};

export type InitializePaymentResponse = {
	paymentUrl: string;
	reference: string;
	sessionId?: string;
};

// types/flutterwave.ts
export interface FlutterwavePaymentMethod {
	code: string;
	label: string;
}

export interface FlutterwavePaymentMethodsResponse {
	success: boolean;
	message: string;
	paymentMethods: {
		country: string;
		currency: string;
		methods: FlutterwavePaymentMethod[];
	};
}


export type Location = {
	type: "Point";
	coordinates: [number, number]; // [longitude, latitude]
};

export interface SurveyAnswer {
	fieldId: string;
	answer: any;
}

export interface SurveyEntryData {
	businessUserId: string;
	surveyId: string;
	researcherId: string;
	location: Location;
	answers: SurveyAnswer[];
}

export interface SurveyEntryResponse {
	success: boolean;
	message: string;
	data?: any;
}

// types/wallet.ts

export type CreateWalletPayload = {
	userId: string;
	userType: string;
	balance: number;
	lockedBalance: number;
};


export type WalletSuccessResponse = {
	success: true;
	message: string;
	data: {
		id: string;
		userId: string;
		userType: string;
		balance: number;
		lockedBalance: number;
		createdAt: string;
		updatedAt: string;
		__v?: number;
		temporaryBalance?: number;
	};
};

export type WalletErrorResponse = {
	message: string;
	error: string;
	statusCode: 400;
};


export type TransactionProvider = 'flutterwave' | 'kuvarpay' | 'stellar' | 'internal';

export type WalletTransactionList = {
	id: string;
	walletId: string;
	type: 'credit' | 'debit';
	amount: number;
	paymentStatus: string;
	payoutStatus: string;
	phoneNumber: string;
	paymentType: string;
	accountName: string;
	accountNumber: string;
	bank: string;
	businessName: string;
	researcherFirstName: string;
	researcherLastName: string;
	tx_ref: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	// BCC / multi-currency fields
	amountBCC?: number;
	originalAmount?: number;
	originalCurrency?: string;
	exchangeRateAtTime?: number;
	stellarTxHash?: string;
	provider?: TransactionProvider;
}

/** Super-admin inflow row (credit); backend may include extra fields */
export type InflowTransactionRow = WalletTransactionList & {
	currency?: string;
	gatewayTransactionId?: string;
};

export type InflowSummaryQueryParams = {
	startDate?: string;
	endDate?: string;
	paymentStatus?: string;
	provider?: TransactionProvider;
	businessName?: string;
	researcherName?: string;
};

// ─── Stellar Payout Types ─────────────────────────────────────────────────────

export type PayoutRequestStatus = 'pending' | 'locked' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PayoutCycleStatus = 'open' | 'processing' | 'completed' | 'partially_failed' | 'failed';

export type PayoutRequest = {
	_id: string;
	researcherId: string;
	walletId: string;
	amountBCC: number;
	phoneNumber: string;
	status: PayoutRequestStatus;
	cycleId?: string;
	sdpDisbursementId?: string;
	sdpPaymentId?: string;
	stellarTransactionHash?: string;
	failureReason?: string;
	requestedAt?: string;
	processedAt?: string;
	requeuedForNextCycle: boolean;
	createdAt: string;
	updatedAt: string;
};

export type PayoutCycle = {
	_id: string;
	cycleKey: string;
	disbursementDate: string;
	cutoffTime: string;
	disbursementTriggeredAt?: string;
	status: PayoutCycleStatus;
	sdpDisbursementId?: string;
	totalRequests: number;
	totalAmountBCC: number;
	successCount: number;
	failureCount: number;
	triggeredBy: string;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type PayoutStats = {
	pending: number;
	processing: number;
	completed: number;
	failed: number;
	totalDisbursedBCC: number;
};

export type InflowListQueryParams = InflowSummaryQueryParams & {
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "amount";
	sortOrder?: "asc" | "desc";
};

export type InflowSummaryData = {
	totals: { count: number; totalAmount: number };
	byStatus: Array<{ paymentStatus: string; count: number; totalAmount: number }>;
	byProvider: Array<{ provider: string; count: number; totalAmount: number }>;
	counts: { paid: number; pending: number; failed: number; notPaid: number };
	successRatePercent: number | null;
};

export type InflowTransactionsListResult = {
	data: InflowTransactionRow[];
	pagination: PaginationMeta;
	filters?: Record<string, unknown>;
};

export type PayoutSummaryQueryParams = {
	startDate?: string;
	endDate?: string;
	payoutStatus?: string;
	paymentType?: string;
	businessName?: string;
	researcherName?: string;
};

export type PayoutListQueryParams = PayoutSummaryQueryParams & {
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "amount";
	sortOrder?: "asc" | "desc";
};

export type PayoutSummaryData = {
	totals: { count: number; totalAmount: number };
	byStatus: Array<{ payoutStatus: string; count: number; totalAmount: number }>;
	byPaymentType: Array<{ paymentType: string; count: number; totalAmount: number }>;
	counts: { paid: number; notPaid: number };
};

export type PayoutTransactionsListResult = {
	data: WalletTransactionList[];
	pagination: PaginationMeta;
	filters?: Record<string, unknown>;
};

// Binance transaction history (super-admin)
export type BinanceTransaction = {
	id: string;
	type: "deposit" | "withdrawal";
	coin: string;
	amount: string;
	network?: string;
	txId?: string | null;
	address?: string | null;
	status: number;
	timestamp: number;
	transactionFee?: string | null;
	raw?: Record<string, unknown>;
};

export type BinanceDateRange = {
	minDate: number;
	maxDate: number;
};

export type BinanceSummaryByType = {
	count: number;
	totalAmount: number;
};

export type BinanceSummary = {
	totalCount: number;
	byType: {
		deposit: BinanceSummaryByType;
		withdrawal: BinanceSummaryByType;
	};
	balance: number;
};

export type BinanceTransactionsResponse = {
	success: boolean;
	data: BinanceTransaction[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	dateRange: BinanceDateRange | null;
	summary: BinanceSummary | null;
};

export type BinanceSyncResponse = {
	success: boolean;
	message: string;
};

export type CreateTransactionPayload = {
	walletId: string;
	type: "credit" | "debit";
	amount: number;
	description: string;
	provider?: 'flutterwave' | 'kuvarpay';
};


export type CreateTransactionResponse = {
	walletId: string;
	type: "credit" | "debit";
	amount: number;
	paymentStatus: "not-paid" | "paid";
	tx_ref: string;
	description: string;
	id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
};


export type Employee = {
	id: string;
	businessUserId: string;
	departmentId: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	invitationToken: string;
	invitationStatus: string;
	hashedRt: string | null;
	refreshToken: string | null;
	failedLoginAttempts: number;
	lockUntil: string | null;
	isVerified: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
};


export type InviteEmployee = {
	businessUserId: string,
	departmentId: string,
	email: string,
}


