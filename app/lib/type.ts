import { z } from "zod";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 98b4a89 (Survey test implementation)
import {
  pipeLineSchema,
  departmentSchema,
  surveySchema,
  surveyPaymentSchema,
} from "./validationSchemas";
<<<<<<< HEAD
=======
import { pipeLineSchema, departmentSchema, surveySchema } from "./validationSchemas";
>>>>>>> f134ea7 (Display the list of surveys)
=======
>>>>>>> 98b4a89 (Survey test implementation)
import { ReactNode } from "react";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Pagination {
<<<<<<< HEAD
<<<<<<< HEAD
  total: number;
  page: number;
  limit: number;
=======
	total: number;
	page: number;
	limit: number;
>>>>>>> f134ea7 (Display the list of surveys)
=======
  total: number;
  page: number;
  limit: number;
>>>>>>> 98b4a89 (Survey test implementation)
  pages?: number;
}

export type Department = {
  businessUserId: string | null;
  departmentName: string;
  departmentDescription: string;
};

export type DepartmentSchema = z.infer<typeof departmentSchema>;

export type SurveySchema = z.infer<typeof surveySchema>;

<<<<<<< HEAD
<<<<<<< HEAD
export type SurveyPaymentSchema = z.infer<typeof surveyPaymentSchema>;

=======
>>>>>>> f134ea7 (Display the list of surveys)
=======
export type SurveyPaymentSchema = z.infer<typeof surveyPaymentSchema>;

>>>>>>> 98b4a89 (Survey test implementation)
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
};

export interface DataPointForm {
  dataPointId: string;
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
<<<<<<< HEAD
<<<<<<< HEAD
  surveyDescription: string;
  amount: number;
=======
  surveyDescription : string;
  amount : number,
>>>>>>> f134ea7 (Display the list of surveys)
=======
  surveyDescription: string;
  amount: number;
>>>>>>> 98b4a89 (Survey test implementation)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 98b4a89 (Survey test implementation)
  title: string;
  subTitle: string;
  value: string;
  icon: ReactNode;
};
<<<<<<< HEAD
=======
  title: string, 
  subTitle: string,
  value: string,
  percentage: string,
  icon: ReactNode,
}
>>>>>>> f134ea7 (Display the list of surveys)
=======
>>>>>>> 98b4a89 (Survey test implementation)

export type SurveyListResponse = {
  success: boolean;
  message: string;
  survey: SurveyListItem[];
  pagination: Pagination;
};

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 98b4a89 (Survey test implementation)
export type FlutterwaveHostedLinkResponse = {
  status: string;
  message: string;
  data: {
    link: string;
  };
};

<<<<<<< HEAD
export type SingleSurveyResponse = {
  success: boolean;
  message: string;
  data: SurveyListItem;
};

=======
>>>>>>> f134ea7 (Display the list of surveys)
=======
=======
>>>>>>> 98b4a89 (Survey test implementation)
export type SingleSurveyResponse = {
  success: boolean;
  message: string;
  data: SurveyListItem;
};

>>>>>>> 4027abe (Display survey details)
export type SurveyListItem = {
  id: string;
  businessUserId: string;
  surveyName: string;
  amount: number;
  surveyDescription: string;
  field: SurveyListField[];
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

export type SurveyListField = {
  label: string;
  key: string;
  type: string; // consider using a union like 'text' | 'number' | 'select' etc. if known
  required: boolean;
  options: string[]; // assuming options are strings
  id: string;
  createdAt: string;
  updatedAt: string;
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e6e6d7e (Build the survey stepper)
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
<<<<<<< HEAD
<<<<<<< HEAD
    description?: string;
  };
};
=======
>>>>>>> f134ea7 (Display the list of surveys)
=======
    description: string;
  };
};


>>>>>>> e6e6d7e (Build the survey stepper)
=======
    description?: string;
  };
};
>>>>>>> 98b4a89 (Survey test implementation)
