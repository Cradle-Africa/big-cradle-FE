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
import {
	Control,
	FieldErrors,
	useForm,
	UseFormHandleSubmit,
	UseFormRegister,
} from "react-hook-form";
import NewSurveyQuestionsForm from "../_components/NewSurveyQuestionsForm";
import SurveyNameAndDescription from "../_components/SurveyNameAndDescription";
import SurveyPayementArea from "../_components/SurveyPayementArea";
import SurveyTabButton from "../_components/SurveyTabButton";
import { getUser } from "@/app/utils/user/userData";
import LocationAndDemographic from "../_components/LocationAndDemographic";
import toast from "react-hot-toast";
import { Spinner } from "@radix-ui/themes";

const NewSurveyPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	type TabKey = 'survey-name-and-description' | 'location-and-demographic' | 'survey-questions' | 'survey-payment' | '';
	const paramSurvey = (searchParams.get("survey") ?? "") as TabKey;


	const [countriesAndCities, setCountriesAndCities] = useState<
		CountryAndCity[]
	>([]);

	const [form, setForm] = useState<DataPointForm>({
		dataPointId: "",
		field: [
			{
				label: "",
				key: "",
				type: "text",
				required: false,
				options: [],
			}
		],
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

	const {
		register: registerDemographic,
		watch: watchDemographic,
		handleSubmit: handleSubmitDemographic,
		control: controlDemographic,
		formState: { errors: errorsDemographic },
	} = useForm<DemographicFormValues, any, DemographicFormValues>({
		resolver: zodResolver(demographicSchema),
	});


	const surveyName = watch("surveyName");
	const sector = getUser()?.sector ?? '';
	const surveyGoal = watch("surveyGoal");
	const surveyDescription = watch("surveyDescription");
	const country = watchDemographic("country");
	const state = watchDemographic("state");
	const city = watchDemographic("city");
	const startDate = watch('startDate');
	const endDate = watch('endDate');
	const ageDemographics = watchDemographic("ageDemographics");
	const gender = watchDemographic("gender");
	const user = getUser();

	// In parent component
	const onDemographicSubmit = (data: DemographicFormValues) => {
		// Handle adding to countriesAndCities list
		const valueExist = countriesAndCities.some((v) => v.city === data.city);
		if (!valueExist) {
			setCountriesAndCities((prev: CountryAndCity[]) => [
				...(prev ?? []),
				{ city: data.city, state: data.state, country: data.country },
			]);
			toast.success("Country, region, age and gender added successfully to the list");
		}
		// else {
		//   toast.error("City or region already exist in the list, please select a new one");
		// }
	};

	// Create a separate handler for the final submission
	const handleFinalDemographicSubmit = (data: DemographicSubmitValues) => {
		// This will be called when user clicks "Next"
		// You can process the array data here if needed
		console.log("Final demographic data:", data);
	};

	const onDeleteClick = (data: CountryAndCity) => {
		const filteredList = countriesAndCities.filter((v) => v.city !== data.city);
		setCountriesAndCities([...filteredList]);
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
				{user?.role === "business" && (
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
				sector={sector}
				surveyGoal={surveyGoal}
				startDate={startDate}
				endDate={endDate}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				onSubmitDemographic={onDemographicSubmit}
				handleFinalDemographicSubmit={handleFinalDemographicSubmit}
				errors={errors}
				country={country}
				city={city}
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
				state={state}
			/>

		</DashboardLayout>
	);
};

type FormAreaProps = {
	surveyTab: JSX.Element
	survey: string;
	control: Control<SurveySchema>;
	form: DataPointForm;
	setForm: React.Dispatch<React.SetStateAction<DataPointForm>>;

	countryAndCitiesList: CountryAndCity[];
	setCountriesAndCities: (val: CountryAndCity[]) => void;
	onNextClicked: () => void;

	// demographic
	ageDemographics: string[];
	gender: string[];
	onSubmitDemographic: (data: DemographicSubmitValues) => void;
	handleSubmitDemographic: UseFormHandleSubmit<DemographicFormValues>;
	handleFinalDemographicSubmit: (data: DemographicSubmitValues) => void;

	registerDemographic: UseFormRegister<DemographicFormValues>;
	controlDemographic: Control<DemographicFormValues>;
	errorsDemographic: FieldErrors<DemographicFormValues>;

	//
	countriesAndCities: CountryAndCity[];

	// name and description
	register: UseFormRegister<SurveySchema>;
	surveyName: string;
	surveyDescription: string;
	sector: string;
	surveyGoal: string;
	startDate: string;
	endDate: string;
	country: string;
	state: string;
	city: string;

	//
	handleSubmit: UseFormHandleSubmit<SurveySchema>;
	onSubmit: (data: SurveySchema) => void;
	errors: FieldErrors<SurveySchema>;

	//
	onDeleteClick: (val: CountryAndCity) => void;
};

const FormArea = ({
	surveyTab,
	survey,
	form,
	setForm,
	register,
	registerDemographic,
	handleSubmitDemographic,
	surveyName,
	surveyDescription,
	sector,
	surveyGoal,
	startDate,
	endDate,
	ageDemographics,
	gender,
	handleSubmit,
	onSubmit,
	onSubmitDemographic,
	handleFinalDemographicSubmit,
	errors,
	errorsDemographic,
	controlDemographic,

	//
	countriesAndCities,

	//
	onDeleteClick,
	onNextClicked,

	//
	countryAndCitiesList,
}: FormAreaProps) => {
	// Convert string values to arrays as needed
	const ageArray = typeof ageDemographics === 'string' ? [ageDemographics] : ageDemographics;
	const genderArray = typeof gender === 'string' ? [gender] : gender;

	if (survey === "survey-name-and-description") {
		return (
			<SurveyNameAndDescription
				surveyTab={surveyTab}
				register={register}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				errors={errors}
			/>
		);
	} else if (survey === "location-and-demographic") {
		return (
			<LocationAndDemographic
				surveyTab={surveyTab}
				register={registerDemographic}
				handleSubmit={handleSubmitDemographic}
				onSubmit={handleFinalDemographicSubmit}  // Pass the final submit handler
				control={controlDemographic}
				errors={errorsDemographic}
				countryAndCitiesList={countryAndCitiesList}
				onDeleteClick={onDeleteClick}
				onNextClicked={onNextClicked}
				onAddLocation={onSubmitDemographic}
			/>
		);
	} else if (survey === "survey-questions") {
		return (
			<NewSurveyQuestionsForm
				surveyTab={surveyTab}
				surveyName={surveyName}
				surveyDescription={surveyDescription}
				sector={sector}
				surveyGoal={surveyGoal}
				startDate={startDate}
				endDate={endDate}
				form={form}
				setForm={setForm}
				countriesAndCities={countriesAndCities}
				locationAndDemographic={ageArray}
				gender={genderArray}
			/>
		);
	} else if (survey === "survey-payment") {
		return (
			<SurveyPayementArea
				surveyName={surveyName}
				surveyDescription={surveyDescription}
				sector={sector}
				surveyGoal={surveyGoal}
				form={form}
				setForm={setForm}
				startDate={startDate}
				endDate={endDate}
				countriesAndCities={countriesAndCities}
				locationAndDemographic={ageDemographics}
				ageDemographics={ageArray}
				gender={genderArray}
			/>
		);
	}
};

export default NewSurveyPage;
