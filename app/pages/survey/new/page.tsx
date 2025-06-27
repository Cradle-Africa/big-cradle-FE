"use client";

import DashboardLayout from "@/app/DashboardLayout";
import { DataPointForm, SurveySchema } from "@/app/lib/type";
import { surveySchema } from "@/app/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
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

const NewSurveyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramSurvey = searchParams.get("survey");

  const [form, setForm] = useState<DataPointForm>({
    dataPointId: "",
    field: [],
  });

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SurveySchema>({
    resolver: zodResolver(surveySchema),
  });

  const surveyName = watch("surveyName");
  const surveyDescription = watch("surveyDescription");
  const user = getUser();

  const onSubmit = (data: SurveySchema) => {
    console.log(JSON.stringify(data));
    router.push(`/pages/survey/new?survey=survey-questions`);
  };

  // const { data : singleSurvey, isLoading: isLoadingSingleSurvey } = useFetchSingleSurvey({
  //   axios,
  //   surveyId: surveyId || "",
  //   enabled: !!surveyId,
  // });

  return (
    <DashboardLayout>
      <div className="flex gap-4 items-center justify-center">
        {/* Survey buttons area */}
        {/* {surveyMenuList.map((survey: string) => (
          <SurveyTabButton
            onClick={() => router.push(`/pages/survey/new?survey=${survey}`)}
            key={survey}
            isSelected={paramSurvey === survey}
          >
            <p>{survey}</p>
          </SurveyTabButton>
        ))} */}
        <SurveyTabButton
          // onClick={() =>
          //   router.push(`/pages/survey/new?survey=survey-name-and-description`)
          // }
          isSelected={paramSurvey === "survey-name-and-description"}
        >
          <div className="flex gap-4 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>1</p>
            </div>
            <p>Survey name and description</p>
          </div>
        </SurveyTabButton>

        <SurveyTabButton
          // onClick={() =>
          //   router.push(`/pages/survey/new?survey=survey-questions`)
          // }
          isSelected={paramSurvey === "survey-questions"}
        >
          <div className="flex gap-4 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>2</p>
            </div>
            <p>Survey questions</p>
          </div>
        </SurveyTabButton>


       {user?.role === "business" && <SurveyTabButton
          // onClick={() =>
          //   router.push(`/pages/survey/new?survey=survey-questions`)
          // }
          isSelected={paramSurvey === "survey-payment"}
        >
          <div className="flex gap-4 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>3</p>
            </div>
            <p>Survey payment</p>
          </div>
        </SurveyTabButton>}

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
        // surveysList={surveysListResponse?.survey || []}
        form={form}
        setForm={setForm}
        //
        register={register}
        surveyName={surveyName}
        surveyDescription={surveyDescription}
        //
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
      />
    </DashboardLayout>
  );
};

// const surveyMenuList = [
//   "Survey name and description",
//   "Surveys list",
//   "Settings",
// ];

type FormAreaProps = {
  survey: string;
  // surveysList: SurveyListItem[];
  form: DataPointForm;
  setForm: React.Dispatch<React.SetStateAction<DataPointForm>>;

  //
  register: UseFormRegister<SurveySchema>;
  surveyName: string;
  surveyDescription: string;

  //
  handleSubmit: UseFormHandleSubmit<SurveySchema>;
  onSubmit: (data: SurveySchema) => void;
  errors: FieldErrors<SurveySchema>;
};

const FormArea = ({
  survey,
  form,
  setForm,
  register,
  surveyName,
  surveyDescription,
  handleSubmit,
  onSubmit,
  errors,
}: FormAreaProps) => {
  if (survey === "survey-name-and-description") {
    return (
      <SurveyNameAndDescription
        register={register}
        // surveyName={surveyName}
        // surveyDescription={surveyDescription}
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
        form={form}
        setForm={setForm}
      />
    );
  } else if (survey === "survey-payment") {
    return (
      <SurveyPayementArea
        surveyName={surveyName}
        surveyDescription={surveyDescription}
        form={form}
        setForm={setForm}
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
