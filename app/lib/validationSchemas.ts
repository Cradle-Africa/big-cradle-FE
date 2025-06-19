import {z} from "zod";

export const dataPointSchema = z.object({
  dataPointName: z.string().min(1, "Enter the data point name"),
  dataPointDescription: z.string().min(1, "Enter the desciption"),
});