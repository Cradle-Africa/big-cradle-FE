import {z} from "zod";

export const pipeLineSchema = z.object({
  pipelineName: z.string().min(1, "Enter the data point name"),
  pipelineDescription: z.string().min(1, "Enter the desciption"),
});

export const departmentSchema = z.object({
  departmentName: z.string().min(1, "Enter the department name"),
  departmentDescription: z.string().min(1, "Enter the department desciption"),
});
