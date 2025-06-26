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

const NewSurveyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramSurvey = searchParams.get("survey");

  const [form, setForm] = useState<DataPointForm>({
    dataPointId: "",
    field: [],
  });

  const txRef = searchParams.get("tx_ref");
  const {
    mutateAsync: verifyPayment,
    isPending: isVerifing,
    data: paymentMadeData,
    isSuccess: isVerifyPaymentSuccess,
    isError,
  } = useVerifySurveyPayment({
    axios,
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

  const onSubmit = (data: SurveySchema) => {
    console.log(JSON.stringify(data));
    router.push(`/pages/survey/new?survey=survey-questions`);
  };

  const filteredSurveys = useMemo(() => {
    const surveys: SurveyListItem[] = surveysListResponse?.survey || [];
    if (!surveyStatus || surveyStatus === "all") return surveys;
    if (surveyStatus.toLowerCase() === "active") {
      return surveys.filter((survey) => survey.isActive);
    } else {
      return surveys.filter((survey) => !survey.isActive);
    }
  }, [surveyStatus, surveysListResponse?.survey]);

  return (
    <DashboardLayout>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />
          <div
            className="text-center bg-white px-5 py-5 md:px-8 md:py-8 rounded-lg w-82 md:w-full max-w-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ref={menuRef}
          >
            <h2 className="text-gray-800 text-lg font-normal">
              How would you like to collect your data?
            </h2>
            <p className="mt-5 text-gray-700">
              Choose an integration method or build your own feedback tool
            </p>
            <div className="flex justify-between gap-5 mt-10">
              <div className="w-1/2 px-6 py-6 bg-[#FCEBFF] rounded-lg cursor-pointer">
                <div className="flex justify-center">
                  <Image alt="api icon" src={api_icon} width={40} height={40} />
                </div>
                <p className="mt-3 text-md text-gray-800">Connect via API</p>
                <p className="text-sm mt-3">
                  Integrate with your existing apps, websites, or CRM
                </p>
              </div>

              <div className="w-1/2 px-6 py-6 bg-[#E6E9FF] rounded-lg cursor-pointer">
                <div className="flex justify-center">
                  <Image
                    alt="build icon"
                    src={build_pipeline}
                    width={40}
                    height={40}
                  />
                </div>
                <p className="mt-3 text-md text-gray-800">
                  Build Custom Pipeline
                </p>
                <p className="text-sm mt-3">
                  Use our form builder to create your own survey
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-black">Surveys</p>
          <p>
            View, manage, and track your survey tasks. Create new surveys to
            collect insights in real time
          </p>
        </div>
        <button
          className="bg-[#3352FF] rounded-[8px] px-4 h-[36px] cursor-pointer"
          //   onClick={() => setOpen(true)}
        >
          <Link href="/pages/survey/new?survey=survey-name-and-description">
            <div className="flex fgap2 items-center gap-2">
              <Plus size={18} color="white" />
              <span className="text-white">Create new survey</span>
            </div>
          </Link>
        </button>
      </div>
      {/* Build the cards area */}
      {/* <div className="flex gap-6 mt-8">
        {[...Array(3)].map((_, index) => (
          <SurveyCard key={`${index}`} isHighLighted={index === 0} />
        ))}
      </div> */}

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
    return <NewSurveyQuestionsForm form={form} setForm={setForm} />;
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
