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

export type ReviewAdminKyc = {
  action: string;
  reason: string;
  businessUserId: string;
  adminUserId: string;
};

export type CountryAndCity = { country: string; state: string; city: string };

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

export type InviteBusinessSchema = z.infer<typeof inviteBusinessSchema>;

export type ReviewBusinessKycSchema = z.infer<typeof reviewBusinessKycSchema>;

export type ReviewAdminKycSchema = z.infer<typeof reviewAdminKycSchema>;

export type SurveySchema = z.infer<typeof surveySchema>;

export type DemographicSchema = z.infer<typeof demographicSchema>;

export type SurveyPaymentSchema = z.infer<typeof surveyPaymentSchema>;

// export type FieldType =
//   | "text"
//   | "email"
//   | "tel"
//   | "select"
//   | "radio"
//   | "checkbox"
//   | "textarea"
//   | "number"
//   | "date";

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


export interface Survey {
  id?: string;
  businessUserId: string | null;
  employeeUserId: string | null;
  surveyName: string;
  surveyDescription: string;
  sector: string;
  surveyGoal: string;
  surveyLocations: {
    country: string;
    state: string;
    city: string;
  }[];
  ageDemographics: string;
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
  surveyName: string;
  sector: string;
  surveyGoal: string;
  amount: number;
  surveyDescription: string;
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

// export type SurveyListField = {
//   label: string;
//   key: string;
//   type: string; // consider using a union like 'text' | 'number' | 'select' etc. if known
//   required: boolean;
//   options?: string[]; // assuming options are strings
//   id: string;
//   createdAt: string;
//   updatedAt: string;
// };

export type FlutterWavePaymentSubmit = {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  payment_options: string;
  customer: {
    email: string;
  };
  customizations: {
    title: string;
    description?: string;
  };
};
