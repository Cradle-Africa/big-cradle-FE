"use client";

import {
  CountryAndCity,
  DataPointForm,
  Field,
  FieldType,
  Survey,
} from "@/app/lib/type";
import axios from "@/app/lib/axios";
import { toCamelCase } from "@/app/utils/caseFormat";
import { ArrowLeft, Check } from "lucide-react";
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
import { IconButton } from "@radix-ui/themes";
import FieldFooter from "../../../components/form/FieldFooter";
import AddFieldButton from "@/app/components/form/AddFieldButton";

type Props = {
  form: DataPointForm;
  setForm: React.Dispatch<React.SetStateAction<DataPointForm>>;
  surveyName: string;
  surveyDescription: string;
  locationAndDemographic: string;
  countriesAndCities: CountryAndCity[];
};

const NewSurveyQuestionsForm = ({
  form,
  setForm,
  surveyName,
  surveyDescription,
  locationAndDemographic,
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
      const demographicsToPost: string[] = [];

      for (const v of countriesAndCities) {
        demographicsToPost.push(`${v.country}, ${v.city}`);
      }

      console.log(JSON.stringify(demographicsToPost));
      console.log(JSON.stringify(locationAndDemographic));

      const payload: Survey = {
        businessUserId,
        employeeUserId,
        surveyName: surveyName,
        surveyDescription: surveyDescription,
        amount: 0,
        field: form.field,
        surveyLocations: demographicsToPost,
        ageDemographics: locationAndDemographic
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
      className="w-full p-5 mt-8 bg-blue-50 rounded-md space-y-6 "
    >
      <div className="max-w-3xl mx-auto">
        <IconButton type="button" onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton>
        <p className="mt-5 mb-8"> Please enter the questions you want to include in your survey. You can add multiple questions and specify the type of each question.</p>
        
        {form.field.map((field, index: any) => (
          <div key={index}
            className={`w-full py-4 px-5 border bg-white border-gray-200 rounded-lg space-y-3 
                            hover:border-0 hover:border-l-8 hover:border-blue-600 
                            transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                            focus-within:border-blue-600 focus-within:border-l-8 mb-5
                    `}>
            <div className="w-full grid grid-cols-2 gap-2 mb-5">
              <input
                type="text"
                required
                placeholder="Type your question"
                value={field.label}
                onChange={(e) =>
                  handleFieldChange(index, "label", e.target.value)
                }
                className="w-full bg-gray-50 border-b border-gray-200 px-2 py-2 mt-1 outline-none"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value as FieldType)
                }
                className="w-full bg-white border-b border-gray-300 px-3 py-2 mt-1 outline-none"
              >
                <option value="">Select the type of the answer</option>
                <option value="text">Short text</option>
                <option value="number">Number</option>
                <option value="email">Email Address</option>
                <option value="tel">Phone Number</option>
                <option value="select">Select</option>
                <option value="checkbox">Multiple Choices</option>
                <option value="radio">Single Choice</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
                <option value="file">File Upload</option>
                <option value="rating">Rating</option>
                <option value="textarea">Paragraph</option>
              </select>

            </div>

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

        <div className="flex gap-3 mt-5">
          <AddFieldButton
            totalFields={form.field.length}
            onAdd={addField}
          />

          {user?.role === "super admin" ? (
            <button
              onClick={submitSurvey}
              type="button"
              //   disabled={isPending}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
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
              className="border border-green-600 rounded-md py-2 px-8 mr-auto hover:cursor-pointer"
            >
              <span className="text-green-600">Next</span>
            </button>
          )}
        </div>
      </div>
    </form >
  );
};

export default NewSurveyQuestionsForm;
