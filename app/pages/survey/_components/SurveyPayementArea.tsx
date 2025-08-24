"use client";

import ErrorMessage from "@/app/components/form/ErrorMessage";
import axios, { INTERNAL_URL } from "@/app/lib/axios";
import {
	CountryAndCity,
	CreateTransactionPayload,
	DataPointForm,
	FlutterWavePaymentSubmit,
	Survey,
	SurveyPaymentSchema,
} from "@/app/lib/type";
import { surveyPaymentSchema } from "@/app/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Check, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
	useCreateSurvey,
	useFlutterwavePaymentMethods,
	useSurveyPay,
} from "../_features/hooks";

import {
	getBusinessId,
	getEmployeeUserId,
	getUser,
} from "@/app/utils/user/userData";
import toast from "react-hot-toast";
import Spinner from "@/app/components/Spinner";
import { useFetchWallet } from "../../wallet/_features/hook";
import FlutterwaveCountrySelect from "@/app/components/FlutterwaveCountrySelect";
import { createTransaction } from "../../wallet/_features/api";

type Props = {
	form: DataPointForm;
	setForm: React.Dispatch<React.SetStateAction<DataPointForm>>;
	surveyName: string;
	surveyDescription: string;
	sector: string;
	surveyGoal: string;
	surveyType: string;
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
	surveyType,
	locationAndDemographic,
	countriesAndCities,
	gender,
}: Props) => {
	const router = useRouter();
	const user = getUser();
	let businessUserId: string | null = null;
	const employeeUserId = getEmployeeUserId();
	const [selectedCountry, setSelectedCountry] = useState("");
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{ code: string; currency: string; } | null>(null);

	const { mutateAsync: createSurvey, isPending: isCreatingSurvey } = useCreateSurvey({ axios });

	const { mutateAsync: makePayment, isPending: isMakingPayment } =
		useSurveyPay({ axios });

	const { data: wallet, error: walletError, isPending: isPendingWallet } = useFetchWallet({
		axios,
		userId: user?.id || "",
		enabled: !!user,
	});

	// Get Flutterwave payment methods
	const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } = useFlutterwavePaymentMethods(
		selectedCountry,
		Boolean(selectedCountry)
	);

	if (user?.role === "business") {
		businessUserId = getBusinessId() || null;
	} else {
		businessUserId = user?.businessUserId || null;
	}

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setValue,
	} = useForm<SurveyPaymentSchema>({
		resolver: zodResolver(surveyPaymentSchema),
	});

	// Watch the useWallet checkbox
	const useWallet = watch("useWallet", false);

	const submitSurveyPayment = async (data: FlutterWavePaymentSubmit) => {
		try {
			await makePayment(
				{
					tx_ref: data.tx_ref,
					amount: data.amount,
					country: data.country,
					currency: data.currency,
					redirect_url: data.redirect_url,
					payment_options: data.payment_options, // the code from selected payment method
					customer: data.customer,
					customizations: data.customizations,
				},
				{
					onSuccess: (response) => {
						window.location.href = response.data.link;
						toast.success("Survey payment initialized");
					},
					onError: (error: any) => {
						toast.error(
							error?.response?.data?.message || error?.response?.message || error?.message || "Failed to fetch wallet"
						);
					},
				}
			);
		} finally { }
	};


	const submitSurvey = async (data: SurveyPaymentSchema) => {
		const demographicsToPost = countriesAndCities.map((v) => ({
			country: v.country,
			state: v.state,
			city: v.city,
		}));

		const payload: Survey = {
			businessUserId,
			employeeUserId,
			surveyName,
			surveyDescription,
			sector,
			surveyGoal,
			surveyType,
			startDate,
			endDate,
			amount: parseInt(`${data.amount}`),
			field: form.field,
			surveyLocations: demographicsToPost,
			ageDemographics: locationAndDemographic,
			gender,
		};

		await createSurvey(payload, {
			onSuccess: async (createdSurvey) => {
				setForm({ dataPointId: "", field: [] });

				// Case 1: Internal survey + Wallet
				if (surveyType === "internal" && data.useWallet) {
					if (isPendingWallet) {
						toast.loading("Please wait, checking your wallet...");
						return;
					}

					if (!wallet?.data?.id) {
						toast.error("You do not have a valid wallet. Please create one in your profile.");
						return;
					}

					// Safe to continue
					const transactionPayload: CreateTransactionPayload = {
						walletId: wallet.data.id,
						type: "debit",
						amount: Number(data.amount),
						description: `Survey paid with Big Cradle wallet`,
					};

					try {
						await createTransaction(axios, transactionPayload);
						toast.success("Survey created successfully and wallet debited.");
						router.push(`/pages/survey?status=all`);
					} catch (error: any) {
						toast.error(error?.message || "Failed to debit wallet");
					}
					return;
				}


				// Case 2: Internal survey + Flutterwave
				if (surveyType === "internal" && !data.useWallet) {
					if (!selectedPaymentMethod) {
						toast.error("Please select a payment method to proceed");
						return;
					}

					submitSurveyPayment({
						tx_ref: createdSurvey.data.tx_ref,
						amount: parseInt(data.amount),
						country: selectedCountry,
						currency: selectedPaymentMethod.currency,
						payment_options: selectedPaymentMethod.code,
						redirect_url: `${INTERNAL_URL}/pages/survey/payment-made?${createdSurvey.data.tx_ref}`,
						customer: { email: user?.email || "" },
						customizations: {
							title: "Survey Budget",
							description: "Budget allocated to the survey " + surveyName,
						},
					});
					return;
				}

				// Case 3: External survey
				if (surveyType === "external") {
					toast.success("Survey created successfully");
					router.push(`/pages/survey?status=all`);
				}
			},
		});
	};



	return (
		<div className="my-5 flex flex-col gap-4 max-w-xl 2xl:max-w-3xl mx-auto">
			{/* Header */}
			<div className="relative flex justify-around">
				<button
					type="button"
					className="absolute left-0 bg-gray-100 w-10 h-10 flex justify-start items-center rounded-full p-2 hover:cursor-pointer hover:bg-blue-600 hover:text-white transition duration-500"
					onClick={() => router.back()}
				>
					<ChevronLeft size={30} />
				</button>
				<div className="flex flex-col justify-center">
					<div className="bg-blue-100 p-2 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
						<Banknote size={20} />
					</div>
				</div>
			</div>

			<h3 className="flex w-full justify-center font-semibold text-lg mt-2">Payment Details</h3>

			<p className="mb-8">
				Please enter the amount you wish to allocate as your survey budget. Once you have specified your budget, you can proceed to make a secure payment to launch your survey.
			</p>

			<form onSubmit={handleSubmit(submitSurvey)} className="flex flex-col gap-2">
				<div className="flex flex-col xl:flex-wrap gap-4">
					{/* Amount */}
					<div className="w-full">
						<input
							{...register("amount")}
							placeholder="Amount"
							className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
						/>
						<ErrorMessage>{errors.amount?.message}</ErrorMessage>
					</div>

					{/* Wallet Checkbox */}
					{user?.role === "business" && (
						<div className="w-full">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									{...register("useWallet")}
									className="h-4 w-4 border-gray-300 rounded"
								/>
								<span>Would you like to use Big Cradle Wallet to pay for this survey?</span>
							</label>
							<ErrorMessage>{errors.useWallet?.message}</ErrorMessage>
						</div>
					)}

					{(useWallet && walletError) && (
						<div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-600">
							You do not have a wallet yet. Please create one in your profile before proceeding with survey payments.
						</div>
					)}

					{/* Show country + payment methods only if not using wallet */}
					{!useWallet && (
						<div className="w-full">
							<FlutterwaveCountrySelect
								value={selectedCountry}
								onChange={(value) => {
									setSelectedCountry(value);
									setValue("country", value);
								}}
							/>

							{isLoadingPaymentMethods && <Spinner />}
							<ErrorMessage>{errors.country?.message}</ErrorMessage>

							{paymentMethodsData?.paymentMethods?.methods?.length ? (
								<ul className="mt-2 space-y-2">
									{paymentMethodsData.paymentMethods.methods.map((method) => (
										<li key={method.code} className="border border-gray-300 p-2 rounded">
											<label className="flex items-center gap-2 cursor-pointer">
												<input
													type="radio"
													name="paymentMethod"
													value={method.code}
													onChange={() =>
														setSelectedPaymentMethod({
															code: method.code,
															currency: paymentMethodsData?.paymentMethods.currency || "",
														})
													}
												/>
												{method.label} ({method.code})
											</label>
										</li>
									))}
								</ul>
							) : null}
						</div>
					)}
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isMakingPayment || isCreatingSurvey || isPendingWallet}
					className="w-full flex items-center justify-center bg-blue-600 rounded-md py-2 px-8 mr-auto mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
				>
					<span className="flex items-center text-white">
						{isMakingPayment || isCreatingSurvey || isPendingWallet ? (
							<>
								<span className="mr-2">Processing</span>
								<Spinner />
							</>
						) : (
							<>
								<Check
									size={15}
									className="mr-1 inline text-blue-600 bg-white p-[2px] rounded-full"
								/>
								Proceed
							</>
						)}
					</span>
				</button>

			</form>
		</div>
	);
};

export default SurveyPayementArea;
