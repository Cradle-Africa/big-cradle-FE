"use client";

import DashboardLayout from "@/app/DashboardLayout";
import {
  CountryAndCity,
  DataPointForm,
  DemographicSchema,
  SurveySchema,
} from "@/app/lib/type";
import { demographicSchema, surveySchema } from "@/app/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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

const NewSurveyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramSurvey = searchParams.get("survey");
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
  } = useForm<DemographicSchema>({
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
  const user = getUser();

  const onDemographicSubmit = (data: DemographicSchema) => {
    // Make sure the region doesn't exist in the list
    const valueExist = countriesAndCities.some((v) => v.city === data.city);

    if (!valueExist) {
      setCountriesAndCities((prev: CountryAndCity[]) => [
        ...(prev ?? []),
        { city: data.city, state: data.state, country: data.country },
      ]);
      toast.success("Country and region added successfully to the list");
    } else {
      toast.error(
        "City or region already exist in the list, please select a new one"
      );
    }
    // router.push(`/pages/survey/new?survey=survey-name-and-description`);
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
    // console.log(JSON.stringify(data));
    router.push(`/pages/survey/new?survey=location-and-demographic`);
  };

  // const { data : singleSurvey, isLoading: isLoadingSingleSurvey } = useFetchSingleSurvey({
  //   axios,
  //   surveyId: surveyId || "",
  //   enabled: !!surveyId,
  // });

  return (
    <DashboardLayout>
      <div className="lg:flex lg:gap-3 items-center justify-center">

        <SurveyTabButton
          isSelected={paramSurvey === "survey-name-and-description"}
        >
          <div className="flex justify-center gap-1 lg:gap-2 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>1</p>
            </div>
            <p>Survey name and description</p>
          </div>
        </SurveyTabButton>

        <SurveyTabButton
          // onClick={() =>
          //   router.push(`/pages/survey/new?survey=survey-name-and-description`)
          // }
          isSelected={paramSurvey === "location-and-demographic"}
        >
          <div className="flex justify-center gap-1 lg:gap-2 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>2</p>
            </div>
            <p>Location and demographic</p>
          </div>
        </SurveyTabButton>


        <SurveyTabButton
          // onClick={() =>
          //   router.push(`/pages/survey/new?survey=survey-questions`)
          // }
          isSelected={paramSurvey === "survey-questions"}
        >
          <div className="flex justify-center gap-1 lg:gap-2 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>3</p>
            </div>
            <p>Survey questions</p>
          </div>
        </SurveyTabButton>

        {user?.role === "business" && (
          <SurveyTabButton
            // onClick={() =>
            //   router.push(`/pages/survey/new?survey=survey-questions`)
            // }
            isSelected={paramSurvey === "survey-payment"}
          >
            <div className="flex justify-center gap-1 lg:gap-2 items-center">
              <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
                <p>4</p>
              </div>
              <p>Survey payment</p>
            </div>
          </SurveyTabButton>
        )}

        {/* <SurveyTabButton
          onClick={() => router.push(`/pages/survey/new?survey=Surveys list`)}
          isSelected={false}
        >
          <div>Surveys list</div>
        </SurveyTabButton> */}
      </div>

      {/* Forms area */}
      <FormArea
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
        errors={errors}
        country={country}
        city={city}
        ageDemographics={ageDemographics}
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
  survey: string;
  // surveysList: SurveyListItem[];
  control: Control<SurveySchema>;
  form: DataPointForm;
  setForm: React.Dispatch<React.SetStateAction<DataPointForm>>;

  countryAndCitiesList: CountryAndCity[];
  setCountriesAndCities: (val: CountryAndCity[]) => void;
  onNextClicked: () => void;

  // demographic
  ageDemographics: string;
  handleSubmitDemographic: UseFormHandleSubmit<DemographicSchema>;
  registerDemographic: UseFormRegister<DemographicSchema>;
  controlDemographic: Control<DemographicSchema>;
  errorsDemographic: FieldErrors<DemographicSchema>;

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
  onSubmitDemographic: (data: DemographicSchema) => void;
  errors: FieldErrors<SurveySchema>;

  //
  onDeleteClick: (val: CountryAndCity) => void;
};

const FormArea = ({
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
  handleSubmit,
  onSubmit,
  onSubmitDemographic,
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
  if (survey === "location-and-demographic") {
    return (
      <>
      
      <LocationAndDemographic
        register={registerDemographic}
        handleSubmit={handleSubmitDemographic}
        onSubmit={onSubmitDemographic}
        control={controlDemographic}
        errors={errorsDemographic}
        countryAndCitiesList={countryAndCitiesList}
        onDeleteClick={onDeleteClick}
        onNextClicked={onNextClicked}
      // setCountriesAndCities={setCountriesAndCities}
      />

      </>
      
    );
  } else if (survey === "survey-name-and-description") {
    return (
      <SurveyNameAndDescription
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
      />
    );
  } else if (survey === "survey-questions") {
    return (
      <NewSurveyQuestionsForm
        surveyName={surveyName}
        surveyDescription={surveyDescription}
        sector={sector}
        surveyGoal={surveyGoal}
        startDate={startDate}
        endDate={endDate}
        form={form}
        setForm={setForm}
        countriesAndCities={countriesAndCities}
        locationAndDemographic={ageDemographics}
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
        ageDemographics={ageDemographics}
      />
    );
  }

  // else if (survey === "Surveys list") {
  //   return <SurveysListArea data={surveysList} />;
  // } else {
  //   return <SettingsArea />;
  // }
};

export default NewSurveyPage;
