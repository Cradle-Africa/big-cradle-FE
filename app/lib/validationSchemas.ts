import { isAfter, isBefore, parseISO, startOfToday } from "date-fns";
import { z } from "zod";

export const pipeLineSchema = z.object({
	departmentId: z.string().min(1, "Select the department"),
	dataPointName: z.string().min(1, "Enter the data point name"),
	dataPointDescription: z.string().min(1, "Enter the desciption"),
});

export const inviteEmployeeSchema = z.object({
	departmentId: z.string().min(1, "Select the department"),
	email: z.string().min(1, "Enter the email"),
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

export const reviewResearcherKycSchema = z.object({
	reason: z.string().min(1, "Enter the reason"),
	action: z.string().min(1, "Enter the action"),
});

export const reviewAdminKycSchema = z.object({
	reason: z.string().min(1, "Enter the reason"),
	action: z.string().min(1, "Enter the action"),
});

export const demographicSchema = z.object({
	country: z.string().min(1, "Select a country please"),
	state: z.string().optional().default(""),
	city: z.string().optional().default(""),
	// state: z.string().min(1, "Select a state please"),
	// city: z.string().min(1, "Select a city please"),
	ageDemographics: z.array(z.string()).min(1, "Select an age group"),
	gender: z.array(z.string()).min(1, "Select a gender"),
});

export type DemographicFormValues = z.infer<typeof demographicSchema>;


export const surveySchema = z
	.object({
		surveyName: z.string().min(1, "Enter the survey name"),
		surveyGoal: z.string().min(1, "Enter the survey goal"),
		surveyType: z.string().min(1, "Select the survey type"),
		startDate: z.string().min(1, "Enter the survey start date"),
		endDate: z.string().min(1, "Enter the survey end date"),
		surveyDescription: z.string().min(1, "Enter the description"),
	})
	.refine((data) => {
		const today = startOfToday();
		const start = parseISO(data.startDate);
		return !isBefore(start, today);
	}, {
		message: "Start date cannot be in the past",
		path: ["startDate"],
	})
	.refine((data) => {
		const start = parseISO(data.startDate);
		const end = parseISO(data.endDate);
		return isAfter(end, start);
	}, {
		message: "End date must be after start date",
		path: ["endDate"],
	});


export const surveyPaymentSchema = z
  .object({
    amount: z
      .string()
      .refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 500;
        // return !isNaN(num) && num >= 2000;
      }, {
        message: "The amount must be greater or equal to 2000",
      }),
    country: z.string().optional(),
    provider: z.enum(["flutterwave", "kuvarpay"]).optional(),
    title: z.string().optional(),
    email: z.string().optional(),
    description: z.string().optional(),
    useWallet: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Only require country when using Flutterwave (not wallet, not KuvarPay)
    const needsCountry = !data.useWallet && data.provider !== "kuvarpay";
    if (needsCountry && (!data.country || data.country.trim() === "")) {
      ctx.addIssue({
        path: ["country"],
        code: "custom",
        message: "Select a country when not using wallet",
      });
    }
  });


export const transactionSchema = z.object({
	amount: z.coerce.number().positive("Amount must be greater than zero"),
	description: z.string().min(1, "Description is required"),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
