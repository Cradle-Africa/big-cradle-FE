import { z } from "zod";
import { dataPointSchema, departmentSchema } from "./validationSchemas";

export type DataPoint = {
  businessusinessUserId?: string | null;
  employeeUserId?: string | null;
  dataPointName: string;
  dataPointDescription: string;
}
export type DataPointSchema = z.infer<typeof dataPointSchema>;

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
