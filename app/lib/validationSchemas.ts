import { z } from "zod";

export const pipeLineSchema = z.object({
  departmentId:  z.string().min(1, "Select the department"),
  dataPointName: z.string().min(1, "Enter the data point name"),
  dataPointDescription: z.string().min(1, "Enter the desciption"),
});



const validDomains: Record<string, string> = {
  facebook: "facebook.com",
  twitter: "twitter.com",
  instagram: "instagram.com",
  linkedin: "linkedin.com",
  tiktok: "tiktok.com",
  youtube: "youtube.com",
  github: "github.com",
};

export const analyseSocialMediaSchema = z
  .object({
    platform: z.string().min(1, "Select media type"),
    link: z
      .string()
      .min(1, "Enter social media link")
      .url("Enter a valid URL")
      .refine((val) => val.startsWith("https://"), {
        message: "URL must start with https://",
      }),
    prompt: z.string().min(1, "Enter the prompt"),
  })
  .superRefine(({ platform, link }, ctx) => {
    const domain = validDomains[platform.toLowerCase()];
    if (domain && !link.includes(domain)) {
      ctx.addIssue({
        path: ["link"],
        code: z.ZodIssueCode.custom,
        message: `The link must be a valid ${platform} URL`,
      });
    }
  });




export const departmentSchema = z.object({
  departmentName: z.string().min(1, "Enter the department name"),
  departmentDescription: z.string().min(1, "Enter the department desciption"),
});

export const inviteBusinessSchema = z.object({
  email: z.string().min(1, "Enter the email"),
});

export const reviewBusinessKycSchema = z.object({
  reason: z.string().min(1, "Enter the reason"),
  action: z.string().min(1, "Enter the action"),
});

export const reviewAdminKycSchema = z.object({
  reason: z.string().min(1, "Enter the reason"),
  action: z.string().min(1, "Enter the action"),
});

export const demographicSchema = z.object({
  country: z.string().min(1, "Select a country please"),
  state: z.string().min(1, "Select a state please"),
  city: z.string().min(1, "Select a city please"),
  ageDemographics: z.string().min(1, "Select the age demographic"),
});

export const surveySchema = z.object({
  surveyName: z.string().min(1, "Enter the survey name"),
  surveyGoal: z.string().min(1, "Enter the survey goal"),
  startDate: z.string().min(1, "Enter the survey start date"),
  endDate: z.string().min(1, "Enter the survey end date"),
  surveyDescription: z.string().min(1, "Enter the description name"),
});

export const surveyPaymentSchema = z.object({
  amount: z.string(),
  title: z.string().optional(),
  email: z.string().optional(),
  description: z.string().optional(),
});
