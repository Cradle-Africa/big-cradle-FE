import { useState } from "react";
import NewSurveyForm from "./NewSurveyQuestionsForm";
import { useCreateSurveyForm } from "../_features/hooks";
import { useRouter } from "next/navigation";

const SurveyNameAndDescription = () => {
  const {
    register,
    resetField,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useCreateSurveyForm();
  const router = useRouter();

  const surveyName = watch("surveyName");
  const surveyDescription = watch("surveyDescription");

  return (
    <div className="my-8 flex flex-col gap-4 max-w-3xl mx-auto">
      <input
        {...register("surveyName")}
        placeholder="Survey name"
        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        required
      />
      <textarea
        {...register("surveyDescription")}
        placeholder="Survey Description"
        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        required
      />
      <button
        onClick={() => router.push(`/pages/survey/new?survey=survey-questions`)}
        className="bg-blue-600 rounded-md py-2 px-8 mr-auto"
      >
        <span className="text-white">Next</span>
      </button>
    </div>
  );
};

export default SurveyNameAndDescription;
