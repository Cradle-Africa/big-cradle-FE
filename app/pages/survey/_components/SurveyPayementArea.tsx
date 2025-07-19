
'use client';

import ErrorMessage from "@/app/components/form/ErrorMessage";
import axios from "@/app/lib/axios";
import {
	CountryAndCity,
	DataPointForm,
	FlutterWavePaymentSubmit,
	Survey,
	SurveyPaymentSchema,
} from "@/app/lib/type";
import { surveyPaymentSchema } from "@/app/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Banknote, Check, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useCreateSurvey, useSurveyPay } from "../_features/hooks";

import {
	getBusinessId,
	getEmployeeUserId,
	getUser,
} from "@/app/utils/user/userData";
import toast from "react-hot-toast";
import Spinner from "@/app/components/Spinner";

type Props = {
	form: DataPointForm;
	setForm: React.Dispatch<React.SetStateAction<DataPointForm>>;
	surveyName: string;
	surveyDescription: string;
	sector: string;
	surveyGoal: string;
	startDate: string;
	endDate: string;
	locationAndDemographic: string[];
	countriesAndCities: CountryAndCity[];
	ageDemographics: string[];
	gender: string[];
};

const SurveyPayementArea = ({
	form,
	setForm,
	surveyName,
	surveyDescription,
	sector,
	startDate,
	endDate,
	surveyGoal,
	locationAndDemographic,
	countriesAndCities,
	gender,
}: Props) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutateAsync: createSurvey, isPending: isCreatingSurvey } =
		useCreateSurvey({ axios });

	const { mutateAsync: makePayment, isPending: isMakingPayment } = useSurveyPay(
		{ axios }
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SurveyPaymentSchema>({
		resolver: zodResolver(surveyPaymentSchema),
	});

	console.log('errors', errors);
	const user = getUser();

	let businessUserId: string | null = null;
	const employeeUserId = getEmployeeUserId();

	if (user?.role === "business") {
		businessUserId = getBusinessId() || null;
	} else {
		businessUserId = user?.businessUserId || null;
	}

	const submitSurveyPayment = async (data: FlutterWavePaymentSubmit) => {
		try {
			await makePayment(
				{
					tx_ref: data.tx_ref,
					amount: data.amount,
					currency: data.currency,
					redirect_url: data.redirect_url,
					payment_options: data.payment_options,
					customer: data.customer,
					customizations: data.customizations,
				},
				{
					onSuccess: (data) => {
						window.location.href = data.data.link;
						toast.success("Survey payment initialized");
					},
				}
			);
		} finally {
		}
	};

	const submitSurvey = async (data: SurveyPaymentSchema) => {
		const demographicsToPost = countriesAndCities.map((v) => ({
			country: v.country,
			state: v.state,
			city: v.city,
		}));

		// console.log(JSON.stringify(JSON.stringify(demographicsToPost)));
		// console.log(JSON.stringify(countriesAndCities));

		const payload: Survey = {
			businessUserId,
			employeeUserId,
			surveyName: surveyName,
			surveyDescription: surveyDescription,
			sector: sector,
			surveyGoal: surveyGoal,
			startDate: startDate,
			endDate: endDate,
			amount: parseInt(`${data.amount}`),
			field: form.field,
			surveyLocations: demographicsToPost,
			ageDemographics: locationAndDemographic,
			gender: gender
		};

		await createSurvey(payload, {
			onSuccess: (createdSurvey) => {
				queryClient.invalidateQueries({ queryKey: ["pipelines"] });
				setForm({ dataPointId: "", field: [] }); // clear the form

				submitSurveyPayment({
					tx_ref: createdSurvey.data.tx_ref,
					amount: parseInt(data.amount),
					currency: "NGN",
					// redirect_url: `https://big-cradle-frontend-eight.vercel.app/pages/survey?${createdSurvey.data.tx_ref}`,
					redirect_url: `https://big-cradle-frontend-eight.vercel.app/pages/survey/payment-made?${createdSurvey.data.tx_ref}`,
					payment_options:
						"card,account,banktransfer,ussd,mpesa,ghana_mobilemoney,uganda_mobilemoney,rwanda_mobilemoney,barter,credit",
					customer: {
						email: user?.email || "",
					},
					customizations: {
						title: 'Survey Budget',  // data.title,
						description: 'Budget allocation for the survey ' + surveyName,  // data.description,
					},
				});
			},
			onError: (error: any) => {
				console.error("Create survey error:", error);
				const message =
					error?.response?.data?.message ||
					error?.message ||
					"Failed to create the survey";
				toast.error(message);
			},
		});
	};

	//   useEffect(() => {
	//     if (isCreateSurveySuccess) {
	//       submitSurveyPayment();
	//     }
	//   }, []);

	return (
		<div className="my-5 flex flex-col gap-4 max-w-xl 2xl:max-w-3xl mx-auto">
			<div className="relative flex justify-around ">
				<button
					type="button"
					className="absolute left-0 bg-gray-100 w-10 h-10 flex justify-start items-center rounded-full p-2 
				    	hover:cursor-pointer hover:bg-blue-600 hover:text-white transition duration-500 "
					onClick={() => router.back()}
				>
					<ChevronLeft size={30} />
				</button>
				<div className="flex flex-col justify-center">
					<div
						className="bg-blue-100 p-2 text-blue-600 rounded-full h-10 w-10
						flex items-center justify-center
					">
						<Banknote size={20} />
					</div>
				</div>
			</div>
			<h3 className="flex w-full justify-center font-semibold teext-lg mt-2">Payment Details</h3>

			<p className="mb-8">
				Please enter the amount you wish to allocate as your survey budget. Once you have specified your budget, you can proceed to make a secure payment to launch your survey.
			</p>
			<form
				onSubmit={handleSubmit(submitSurvey)}
				className="flex flex-col gap-2"
			>
				<div className="flex xl:flex-wrap gap-4">
					<div className="w-full">
						<input
							{...register("amount")}
							placeholder="Amount"
							className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none "
						/>
						<ErrorMessage>{errors.amount?.message}</ErrorMessage>
					</div>
				</div>

				<button
					disabled={isMakingPayment || isCreatingSurvey}
					className="w-full flex items-center justify-center bg-blue-600 rounded-md py-2 px-8 mr-auto mt-4 cursor-pointer"
				>
					<span className="flex items-center text-white">
						{isMakingPayment || isCreatingSurvey ? (
							<>
								<span className="mr-2">Loading</span>
								<Spinner />
							</>
						) : (
							<>
								<Check size={15} className="mr-1 inline text-blue-600 bg-white p-[2px] rounded-full" />
								Proceed
							</>
						)}
					</span>
				</button>
			</form>
		</div>
	);
};

// const paymentMethods = [
//   "card",
//   "account",
//   "banktransfer",
//   "ussd",
//   "mpesa",
//   "ghana_mobilemoney",
//   "uganda_mobilemoney",
//   "rwanda_mobilemoney",
//   "barter",
//   "credit",
// ];

export default SurveyPayementArea;
