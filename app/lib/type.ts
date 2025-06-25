import { z } from "zod";
import { pipeLineSchema, departmentSchema } from "./validationSchemas";
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
}


export type Department = {
  businessUserId: string | null;
  departmentName: string;
  departmentDescription: string;
}

export type DepartmentSchema = z.infer<typeof departmentSchema>;

export type BusinessKyc = {
  businessUserId: string | null;
  departmentName: string;
  departmentDescription: string;
}

export type FieldType =  "text"| "email" | "tel" | "select" | "radio" | "checkbox" | "textarea" | "number" | "date";

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

export type Pipeline = {
  businessUserId?: string | null;
  employeeUserId?: string | null;
  dataPointName: string;
  dataPointDescription: string;
  createdAt?: string | undefined;
}
export type PipeLineSchema = z.infer<typeof pipeLineSchema>;

// export type DataEntryField = {
//   key: string;
//   value: string;
// }

export interface DataEntry {
  businessUserId: string | null;
  employeeUserId: string | null;
  fieldId: string;
  data: Record<string, any>;
  createdAt?: string;
}

export type DashboardMenu = {
  title: string, 
  subTitle: string,
  value: string,
  percentage: string,
  icon: ReactNode,
}