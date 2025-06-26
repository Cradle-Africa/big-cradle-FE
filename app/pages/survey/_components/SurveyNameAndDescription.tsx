import ErrorMessage from "@/app/components/form/ErrorMessage";
import { SurveySchema } from "@/app/lib/type";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<SurveySchema>;
  // surveyName: string;
  // surveyDescription: string;
  errors: FieldErrors<SurveySchema>;
  handleSubmit: UseFormHandleSubmit<SurveySchema>;
  onSubmit: (data: SurveySchema) => void;
};

const SurveyNameAndDescription = ({
  register,
  // surveyName,
  // surveyDescription,
  errors,
  handleSubmit,
  onSubmit,
}: Props) => {

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-8 flex flex-col gap-4 max-w-3xl mx-auto"
    >
      <div>
        <input
          {...register("surveyName")}
          placeholder="Survey name"
          className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        />
        <ErrorMessage>{errors.surveyName?.message}</ErrorMessage>
      </div>  
      <div>
        <textarea
          {...register("surveyDescription")}
          placeholder="Survey Description"
          className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
        />
        <ErrorMessage>{errors.surveyDescription?.message}</ErrorMessage>
      </div>
      <button className="bg-blue-600 rounded-md py-2 px-8 mr-auto">
        <span className="text-white">Next</span>
      </button>
    </form>
  );
};

export default SurveyNameAndDescription;
