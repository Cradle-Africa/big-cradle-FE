"use client";

import DashboardLayout from "@/app/DashboardLayout";
import {
	CountryAndCity,
	DataPointForm,
	DemographicFormValues,
	DemographicSubmitValues,
	SurveySchema,
} from "@/app/lib/type";
import { demographicSchema, surveySchema } from "@/app/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { JSX, useState } from "react";

import SurveyTabButton from "../_components/SurveyTabButton";
import toast from "react-hot-toast";
import { Spinner } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import FormArea from "./Form";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import axios from "@/app/lib/axios";

const NewSurveyPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	type TabKey = 'survey-name-and-description' | 'location-and-demographic' | 'survey-questions' | 'survey-payment' | '';
	const paramSurvey = (searchParams.get("survey") ?? "") as TabKey;

	const { data: user, isLoading } = useFetchMe({ axios });

	const [countriesAndCities, setCountriesAndCities] = useState<
		CountryAndCity[]
	>([]);

	const sector = user?.data?.sector ?? "";

	const [form, setForm] = useState<DataPointForm>({
		dataPointId: "",
		field: [],
	});

	const {
		register,
		watch,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<SurveySchema>({
		resolver: zodResolver(surveySchema),
	});

	// Demographic form ✅ simplified generics
	const {
		register: registerDemographic,
		watch: watchDemographic,
		handleSubmit: handleSubmitDemographic,
		control: controlDemographic,
		formState: { errors: errorsDemographic },
	} = useForm<DemographicFormValues>({
		resolver: zodResolver(demographicSchema),
	});

	const surveyName = watch("surveyName");
	const surveyGoal = watch("surveyGoal");
	const surveyType = watch("surveyType");
	const surveyDescription = watch("surveyDescription");
	const country = watchDemographic("country");
	const state = watchDemographic("state");
	const city = watchDemographic("city");
	const startDate = watch('startDate');
	const endDate = watch('endDate');
	const ageDemographics = watchDemographic("ageDemographics");
	const gender = watchDemographic("gender");

	// In parent component
	const onDemographicSubmit = (data: DemographicFormValues) => {
		// Check if the exact demographic already exists
		const valueExist = countriesAndCities.some(
			(v) =>
			v.country === data.country &&
			v.state === (data.state ?? "") &&
			v.city === (data.city ?? "")
		);

		if (!valueExist) {
			setCountriesAndCities((prev: CountryAndCity[]) => [
			...(prev ?? []),
			{
				country: data.country,
				state: data.state ?? "",
				city: data.city ?? "",
				ageDemographics: data.ageDemographics, // ✅ keep these
				gender: data.gender,                   // ✅ keep these
			} as any, // extend CountryAndCity if needed
			]);
			toast.success(
			"Demographic (country, region, age, gender) added successfully to the list"
			);
		} else {
			toast.error("This demographic already exists in the list");
		}
	};


	if (isLoading || !user) {
		return <Spinner />;
	}
	// Create a separate handler for the final submission
	// This will be called when user clicks "Next"
	const handleFinalDemographicSubmit = (data: DemographicSubmitValues) => {
		const payload = {
			...data,
			surveyName,
			surveyGoal,
			surveyType,
			surveyDescription,
			startDate,
			endDate,
			countriesAndCities,
			sector, // sector guaranteed
		};

		console.log("Final survey payload:", payload);
	};

	const onDeleteClick = (data: CountryAndCity) => {
		const filteredList = countriesAndCities.filter(
			(v) =>
			!(
				v.country === data.country &&
				v.state === data.state &&
				v.city === data.city &&
				JSON.stringify(v.ageDemographics) === JSON.stringify(data.ageDemographics) &&
				JSON.stringify(v.gender) === JSON.stringify(data.gender)
			)
		);
		setCountriesAndCities(filteredList);
	};


	const onNextClicked = () => {
		if (countriesAndCities.length < 1) {
			toast.error("Please select regions");
		} else {
			router.push(`/pages/survey/new?survey=survey-questions`);
			console.log(JSON.stringify(countriesAndCities));
		}
	};

	const onSubmit = () => {
		router.push(`/pages/survey/new?survey=location-and-demographic`);
	};

	const surveyTabs: Record<TabKey, () => JSX.Element> = {

		"": () => (
			<Spinner />
		),

		"survey-name-and-description": () => (
			<SurveyTabButton
				isSelected={paramSurvey === "survey-name-and-description"}
			>
				<div className="flex justify-center gap-1 lg:gap-2 items-center">
					<div className="rounded-full  flex items-center justify-center">
						<p className="italic">step 1 out of 4</p>
					</div>
				</div>
			</SurveyTabButton>
		),

		"location-and-demographic": () => (
			<SurveyTabButton
				isSelected={paramSurvey === "location-and-demographic"}
			>
				<div className="flex justify-center gap-1 lg:gap-2 items-center">
					<div className="rounded-full  flex items-center justify-center">
						<p className="italic">step 2 out of 4</p>
					</div>
				</div>
			</SurveyTabButton>
		),

		"survey-questions": () => (
			<SurveyTabButton
				isSelected={paramSurvey === "survey-questions"}
			>
				<div className="flex justify-center gap-1 lg:gap-2 items-center">
					<div className="rounded-full  flex items-center justify-center">
						<p className="italic">step 3 out of 4</p>
					</div>
				</div>
			</SurveyTabButton>
		),

		"survey-payment": () => (
			<>
				{user?.data.role === "business" && (
					<SurveyTabButton
						isSelected={paramSurvey === "survey-payment"}
					>
						<div className="flex justify-center gap-1 lg:gap-2 items-center">
							<div className="rounded-full  flex items-center justify-center">
								<p className="italic">step 4 out of 4</p>
							</div>
						</div>
					</SurveyTabButton>
				)}
			</>
		)
	}

	return (
		<DashboardLayout>
			{/* Forms area */}
			<FormArea
				surveyTab={surveyTabs[paramSurvey]?.()}
				survey={paramSurvey || ""}
				form={form}
				setForm={setForm}
				control={control}
				controlDemographic={controlDemographic}
				register={register}
				surveyName={surveyName}
				surveyDescription={surveyDescription}
				sector={sector ?? ''}
				surveyGoal={surveyGoal}
				surveyType={surveyType}
				startDate={startDate}
				endDate={endDate}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				onSubmitDemographic={onDemographicSubmit}
				handleFinalDemographicSubmit={handleFinalDemographicSubmit}
				errors={errors}
				country={country}
				city={city ?? ""}
				ageDemographics={Array.isArray(ageDemographics) ? ageDemographics : [ageDemographics]}
				gender={Array.isArray(gender) ? gender : [gender]}
				errorsDemographic={errorsDemographic}
				handleSubmitDemographic={handleSubmitDemographic}
				registerDemographic={registerDemographic}
				countryAndCitiesList={countriesAndCities || []}
				setCountriesAndCities={setCountriesAndCities}
				onDeleteClick={onDeleteClick}
				onNextClicked={onNextClicked}
				countriesAndCities={countriesAndCities}
				state={state ?? ""}
			/>

		</DashboardLayout>
	);
};



export default NewSurveyPage;
