import {z} from "zod";

export const pipeLineSchema = z.object({
  dataPointName: z.string().min(1, "Enter the data point name"),
  dataPointDescription: z.string().min(1, "Enter the desciption"),
});

export const departmentSchema = z.object({
  departmentName: z.string().min(1, "Enter the department name"),
  departmentDescription: z.string().min(1, "Enter the department desciption"),
});
