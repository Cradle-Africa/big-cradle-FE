import { useState } from "react";
import NewSurveyForm from "./NewSurveyForm";
import { useCreateSurveyForm } from "../_features/hooks";

const SurveyQuestionsArea = () => {
  const {
    register,
    resetField,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useCreateSurveyForm();

  const surveyName = watch("surveyName");
  const surveyDescription = watch("surveyDescription");

  return (
    <div className="my-8 flex flex-col gap-4 max-w-3xl">
      <input
        {...register("surveyName")}
        placeholder="Title"
        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        required
      />
      <textarea
        {...register("surveyDescription")}
        placeholder="Description"
        className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        required
      />
      <NewSurveyForm name={surveyName} description={surveyDescription} />
    </div>
  );
};

export default SurveyQuestionsArea;
