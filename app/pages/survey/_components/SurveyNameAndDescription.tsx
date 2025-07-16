"use client";

import ErrorMessage from "@/app/components/form/ErrorMessage";
import { SurveySchema } from "@/app/lib/type";
import { Button } from "@radix-ui/themes";
import "react-country-state-city/dist/react-country-state-city.css";

import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<SurveySchema>;
  errors: FieldErrors<SurveySchema>;
  handleSubmit: UseFormHandleSubmit<SurveySchema>;
  onSubmit: (data: SurveySchema) => void;
};

const SurveyNameAndDescription = ({
  errors,
  handleSubmit,
  onSubmit,
  register
}: Props) => {
  // const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-8 flex flex-col gap-4 max-w-3xl mx-auto"
    >
      <p className="mt-5 mb-8">
        Enter the name and description of your survey. This information will help participants understand the purpose and content of the survey.
      </p>
      {/* <IconButton type="button" onClick={() => router.back()}>
        <ArrowLeft />
      </IconButton> */}
      <div>
        <h6 className="mb-2">Name</h6>
        <input
          {...register("surveyName")}
          placeholder="Survey name"
          className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        />
        <ErrorMessage>{errors.surveyName?.message}</ErrorMessage>
      </div>
      <div>
        <h6 className="mb-2">Survey Goal</h6>
        <input
          {...register("surveyGoal")}
          placeholder="Survey Goal"
          className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        />
        <ErrorMessage>{errors.surveyGoal?.message}</ErrorMessage>
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <h6 className="mb-2">Start date</h6>
          <input
            {...register("startDate")}
            placeholder="Survey start date"
            type="date"
            className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
          />
          <ErrorMessage>{errors.startDate?.message}</ErrorMessage>
        </div>

        <div className="w-1/2">
          <h6 className="mb-2">End date</h6>
          <input
            {...register("endDate")}
            placeholder="Survey end date"
            type="date"
            className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
          />
          <ErrorMessage>{errors.endDate?.message}</ErrorMessage>
        </div>
      </div>

      <div>
        <h6 className="mb-2">Description</h6>
        <textarea
          {...register("surveyDescription")}
          placeholder="Survey Description"
          className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        />
        <ErrorMessage>{errors.surveyDescription?.message}</ErrorMessage>
      </div>
      <div>
        <Button mt="3">
          <span className="px-4 ">Next</span>
        </Button>
      </div>
      {/* <button className="bg-blue-600 rounded-md py-2 px-8 mr-auto">
        <span className="text-white">Next</span>
      </button> */}
    </form>
  );
};

export default SurveyNameAndDescription;
