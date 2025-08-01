import {
    Control,
    FieldErrors,
    UseFormHandleSubmit,
    UseFormRegister,
} from "react-hook-form";

import NewSurveyQuestionsForm from "../_components/NewSurveyQuestionsForm";
import SurveyNameAndDescription from "../_components/SurveyNameAndDescription";
import SurveyPayementArea from "../_components/SurveyPayementArea";
import LocationAndDemographic from "../_components/LocationAndDemographic";
import { CountryAndCity, DataPointForm, DemographicFormValues, DemographicSubmitValues, SurveySchema } from "@/app/lib/type";
import { JSX } from "react";


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
	surveyType: string;
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
	surveyType,
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
				surveyType={surveyType}
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
				surveyType={surveyType}
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

export default FormArea