
'use client';

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
import { useCreateTransaction, useFetchWallet } from "../../wallet/_features/hook";

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

	//Create transaction with a debit type
	const {
		mutateAsync: createTransaction,
		// isSuccess: isCreateSuccess,
	} = useCreateTransaction({ axios });

	//Get wallet by user id
	const {
		data: wallet,
	} = useFetchWallet({
		axios,
		userId: user?.id || '',
		enabled: !!user,
	});


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
			surveyType: surveyType,
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
				setForm({ dataPointId: "", field: [] }); // clear the form

				// If the survey is internal and the user is not using the wallet pay with flutterwave
				if (surveyType === 'internal' && (!data.useWallet)) {
					submitSurveyPayment({
						tx_ref: createdSurvey.data.tx_ref,
						amount: parseInt(data.amount),
						currency: "NGN",
						redirect_url: `${INTERNAL_URL}/pages/survey/payment-made?${createdSurvey.data.tx_ref}`,
						payment_options:
							"card,account,banktransfer,ussd,mpesa,ghana_mobilemoney,uganda_mobilemoney,rwanda_mobilemoney,barter,credit",
						customer: {
							email: user?.email || "",
						},
						customizations: {
							title: 'Survey Budget',
							description: 'Budget allocated to the survey ' + surveyName,
						},
					});
				}

				//pay with bigcradle wallet
				if (surveyType === 'internal' && wallet?.data?.id && data.useWallet) {
					const payload: CreateTransactionPayload = {
						walletId: wallet?.data?.id ?? '',
						type: 'debit',
						amount: Number(data.amount),
						description: 'Survey payed with big cradle wallet'
					};
					createTransaction(payload, {
						onSuccess: () => {
							toast.success('Survey has been created successfully and your wallet has been debited for the payment');
							router.push(`/pages/survey?status=all`);
						},
					});
				}

				if (!wallet?.data?.id && data.useWallet) {
					toast.error('You do not have a wallet. Please create a wallet to use this feature.');
				}

				if (surveyType === 'external') {
					toast.success('Survey has been created successfully');
					router.push(`/pages/survey?status=all`);
				}
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
				<div className="flex flex-col xl:flex-wrap gap-4">
					<div className="w-full">
						<input
							{...register("amount")}
							placeholder="Amount"
							className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none "
						/>
						<ErrorMessage>{errors.amount?.message}</ErrorMessage>
					</div>

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
