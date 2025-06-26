import { z } from "zod";

export const pipeLineSchema = z.object({
  dataPointName: z.string().min(1, "Enter the data point name"),
  dataPointDescription: z.string().min(1, "Enter the desciption"),
});

export const departmentSchema = z.object({
  departmentName: z.string().min(1, "Enter the department name"),
  departmentDescription: z.string().min(1, "Enter the department desciption"),
});

export const surveySchema = z.object({
  surveyName: z.string().min(1, "Enter the survey name"),
  surveyDescription: z.string().min(1, "Enter the description name"),
});
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 98b4a89 (Survey test implementation)

export const surveyPaymentSchema = z.object({
  amount: z.string(),
  title: z.string(),
  email: z.string(),
  description: z.string().optional(),
});
<<<<<<< HEAD
=======
>>>>>>> f134ea7 (Display the list of surveys)
=======
>>>>>>> 98b4a89 (Survey test implementation)
