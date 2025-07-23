"use client";

import {
  CountryAndCity,
  DataPointForm,
  Field,
  Survey,
} from "@/app/lib/type";
import axios from "@/app/lib/axios";
import { toCamelCase } from "@/app/utils/caseFormat";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FieldPreview from "../../flywheel/_components/FieldPreview";
import SelectOptionManager from "../../flywheel/_components/SelectOptionManager";
import toast from "react-hot-toast";
import { useCreateSurvey } from "../_features/hooks";
import {
  getBusinessId,
  getEmployeeUserId,
  getUser,
} from "@/app/utils/user/userData";
import Spinner from "@/app/components/Spinner";
import FieldFooter from "../../../components/form/FieldFooter";
import AddFieldButton from "@/app/components/form/AddFieldButton";
import { JSX } from "react";
import { fetchSuggestedQuestions } from "./SuggestionQuestion";
import FormFieldEditor from "../../flywheel/_components/FormFieldEditor";

type Props = {
  surveyTab: JSX.Element;
  form: DataPointForm;
  setForm: React.Dispatch<React.SetStateAction<DataPointForm>>;
  surveyName: string;
  surveyDescription: string;
  sector: string;
  surveyGoal: string;
  startDate: string,
  endDate: string,
  locationAndDemographic: string[];
  gender: string[];
  countriesAndCities: CountryAndCity[];
};

const NewSurveyQuestionsForm = ({
  surveyTab,
  form,
  setForm,
  surveyName,
  surveyDescription,
  sector,
  surveyGoal,
  startDate,
  endDate,
  locationAndDemographic,
  gender,
  countriesAndCities,
}: Props) => {
  const router = useRouter();
  const [newOptions, setNewOptions] = useState<string[]>([]);
  // const [form, setForm] = useState<DataPointForm>({
  //   dataPointId: "",
  //   field: [],
  // });
  const user = getUser();

  let businessUserId: string | null = null;
  if (user?.role === "business") {
    businessUserId = getBusinessId() || null;
  } else {
    businessUserId = user?.businessUserId || null;
  }

  const employeeUserId = getEmployeeUserId();

  const { mutateAsync: createSurvey, isPending: isCreatingSurvey } =
    useCreateSurvey({ axios });

  const submitSurvey = async () => {
    if (form.field.length < 1) {
      toast.error("Please add some questions before you can pass");
    } else {
      const demographicsToPost = countriesAndCities.map((v) => ({
        country: v.country,
        state: v.state,
        city: v.city,
      }));

      console.log('--', JSON.stringify(demographicsToPost));
      console.log(JSON.stringify(locationAndDemographic));

      const payload: Survey = {
        businessUserId,
        employeeUserId,
        surveyName: surveyName,
        sector: sector,
        surveyGoal: surveyGoal,
        startDate: startDate,
        endDate: endDate,
        surveyDescription: surveyDescription,
        amount: 0,
        field: form.field,
        surveyLocations: demographicsToPost,
        ageDemographics: locationAndDemographic,
        gender: gender
      };

      await createSurvey(payload, {
        onSuccess: () => {
          toast.success("Survey ");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create the survey";
          toast.error(message);
        },
      });
    }
  };

  const handleFieldChange = <K extends keyof Field>(
    index: number,
    key: K,
    value: Field[K]
  ) => {
    const updatedFields = [...form.field];
    updatedFields[index][key] = value;

    if (key === "label") {
      updatedFields[index]["key"] = toCamelCase(value as string);
    }

    if (
      key === "type" &&
      typeof value === "string" &&
      !["select", "multiselect", "radio"].includes(value)
    ) {
      delete updatedFields[index].options;
    }

    setForm((prev) => ({ ...prev, field: updatedFields }));
  };

  const removeField = (index: number) => {
    const updatedFields = form.field.filter((_, i) => i !== index);
    const updatedOptions = newOptions.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, field: updatedFields }));
    setNewOptions(updatedOptions);
  };

  const addField = () => {
    setForm((prev) => ({
      ...prev,
      field: [
        ...prev.field,
        {
          label: "",
          key: "",
          type: "text",
          required: false,
          options: [],
        },
      ],
    }));
    setNewOptions((prev) => [...prev, ""]);
  };

  const suggestionQuestion = async (
    surveyName: string,
    surveyDescription: string,
    sector: string,
    surveyGoal: string,
    startDate: string,
    endDate: string,
    locationAndDemographic: string[],
    gender: string[],
    countriesAndCities: CountryAndCity[],
    setForm: React.Dispatch<React.SetStateAction<DataPointForm>>,
  ) => {
    await fetchSuggestedQuestions(
      surveyName,
      surveyDescription,
      sector,
      surveyGoal,
      startDate,
      endDate,
      locationAndDemographic,
      gender,
      countriesAndCities,
      setForm
    );
  }



  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // console.log(JSON.stringify({ name, description }));
  // };

  const onNextButtonClicked = () => {
    if (form.field.length < 1) {
      toast.error("Please add some questions before you can pass");
    } else {
      router.push(`/pages/survey/new?survey=survey-payment`);
    }
  };

  return (
    <form
      // onSubmit={handleSubmit}
      className="max-w-full mx-auto p-5 bg-gray-50 rounded-md space-y-4 "
    >
      <div className="gap-4 max-w-xl 2xl:max-w-3xl mx-auto">
        <div className="flex justify-between items-center gap-3">
          <button
            type="button"
            className="bg-gray-100 w-10 h-10 flex justify-center items-center rounded-full p-2 
            hover:cursor-pointer hover:bg-blue-600 hover:text-white transition duration-500"
            onClick={() => router.back()}
          >
            <ChevronLeft size={30} />
          </button>

          <button
            type="button"
            onClick={() => suggestionQuestion(
              surveyName,
              surveyDescription,
              sector,
              surveyGoal,
              startDate,
              endDate,
              locationAndDemographic,
              gender,
              countriesAndCities,
              setForm
            )}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 hover:cursor-pointer transition"
          >
            Get Suggested Research/Survey Questions
          </button>
        </div>

        <p className="mt-5 mb-8"> Please enter the questions you want to include in your survey. You can add multiple questions and specify the type of each question.</p>

        <div
          className="w-full py-4 px-5 border-t-4 border-blue-600 bg-white rounded-xl space-y-3 
          hover:border-t-4 hover:border-blue-600 
          transition-all duration-300 ease-in-out
          focus-within:border-blue-600 focus-within:border-t-4 mb-5"
        >
          <h2 className="font-semibold">{surveyName}</h2>
          <p className="mt-1">{surveyDescription}</p>
        </div>
        {form.field.map((field, index: any) => (
          <div key={index}
            className={`w-full py-4 px-5 border bg-white border-gray-200 rounded-xl space-y-3 
                            hover:border-0 hover:border-l-4 hover:border-blue-600 
                            transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                            focus-within:border-blue-600 focus-within:border-l-4 mb-5
                    `}>
            <FormFieldEditor
              key={index}
              index={index}
              field={field}
              handleFieldChange={handleFieldChange}
            />

            {/* Field Preview */}
            < FieldPreview field={field} />

            <SelectOptionManager
              index={index}
              newOptions={newOptions}
              setNewOptions={setNewOptions}
              formFields={form.field}
              setFormFields={setForm}
            />

            <FieldFooter
              index={index}
              fieldType={field.type}
              isRequired={field.required}
              onToggleRequired={(i, value) => handleFieldChange(i, "required", value)}
              onRemove={removeField}
            />

          </div>

        ))
        }

        {/* JSX type Tab step */}
        <div className="w-full">
          {surveyTab}
        </div>

        <div className="flex w-full gap-3 mt-5">
          <AddFieldButton
            totalFields={form.field.length}
            onAdd={addField}
          />

          {user?.role === "super admin" ? (
            <button
              onClick={submitSurvey}
              type="button"
              className="flex w-1/2 items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
            >
              <Check size={16} className="mr-1" />
              {isCreatingSurvey || isCreatingSurvey ? (
                <>
                  <span className="mr-2">Submitting...</span>
                  <Spinner />
                </>
              ) : (
                "Submit"
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextButtonClicked}
              className="w-1/2 flex justify-center items-center bg-blue-600 text-white rounded-md py-2 px-8 mr-auto hover:cursor-pointer"
            >
              Next
              <ChevronRight size={14} className="ml-1 iniline" />
            </button>
          )}
        </div>
      </div>
    </form >
  );
};

export default NewSurveyQuestionsForm;
