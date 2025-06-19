import { z } from "zod";
import { dataPointSchema } from "./validationSchemas";

export type DataPoint = {
  businessusinessUserId?: string | null;
  employeeUserId?: string | null;
  dataPointName: string;
  dataPointDescription: string;
}

export type DataPointSchema = z.infer<typeof dataPointSchema>;