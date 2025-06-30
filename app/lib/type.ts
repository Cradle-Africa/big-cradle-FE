import { z } from "zod";
import {
  pipeLineSchema,
  departmentSchema,
  surveySchema,
  surveyPaymentSchema,
} from "./validationSchemas";
import { ReactNode } from "react";

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
  businessUserId: string | null;
  departmentName: string;
  departmentDescription: string;
};

export type DepartmentSchema = z.infer<typeof departmentSchema>;

export type SurveySchema = z.infer<typeof surveySchema>;

export type SurveyPaymentSchema = z.infer<typeof surveyPaymentSchema>;

export type BusinessKyc = {
  businessUserId: string | null;
  departmentName: string;
  departmentDescription: string;
};

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea"
  | "number"
  | "date";

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
}

export interface Survey {
  id?: string;
  businessUserId: string | null;
  employeeUserId: string | null;
  surveyName: string;
  surveyDescription: string;
  amount: number;
  field: Field[];
}

export type Pipeline = {
  businessUserId?: string | null;
  employeeUserId?: string | null;
  dataPointName: string;
  dataPointDescription: string;
  createdAt?: string | undefined;
};
export type PipeLineSchema = z.infer<typeof pipeLineSchema>;

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
}

export type DashboardMenu = {
  title: string;
  subTitle: string;
  value: string;
  icon: ReactNode;
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
