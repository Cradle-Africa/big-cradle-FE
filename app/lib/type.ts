import { z } from "zod";
import { pipeLineSchema, departmentSchema } from "./validationSchemas";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
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

export type FieldType = "text" | "select" | "date" | "textarea" | "multiselect" | "radio";

export type Field = {
  label: string;
  key: string;
  type: FieldType;
  required: boolean;
  options?: string[];
};

export interface PipelineForm {
  dataPointId: string;
  field: Field[];
}

export interface DataPoint {
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
