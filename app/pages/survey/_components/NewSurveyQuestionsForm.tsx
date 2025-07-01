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
        surveyLocations :demographicsToPost,
        ageDemographics : locationAndDemographic
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
      className="w-full py-6 rounded-md space-y-6 max-w-3xl mx-auto"
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="text-red-600 border border-red-600 px-4 py-1 cursor-pointer rounded-lg hover:bg-blue-50"
      >
        <ArrowLeft />
      </button>
      <h2 className="text-md text-black mb-4">Build a New Survey</h2>

      {/* <div className="w-full">
        <select
          value={form.dataPointId}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, dataPointId: e.target.value }))
          }
          required
          className="w-full border bg-white border-gray-300 rounded px-3 py-2 outline-blue-600"
        >
          <option value="">Select a pipeline</option>
          {pipelines.map((dp: any) => (
            <option key={dp.id} value={dp.id}>
              {dp.dataPointName}
            </option>
          ))}
        </select>
      </div> */}

      {form.field.map((field, index: any) => (
        <div
          key={index}
          className="w-full p-4 border border-gray-300 rounded space-y-3 mb-2"
        >
          <div className="w-full grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Label"
              value={field.label}
              onChange={(e) =>
                handleFieldChange(index, "label", e.target.value)
              }
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none"
            />
            <select
              value={field.type}
              onChange={(e) =>
                handleFieldChange(index, "type", e.target.value as FieldType)
              }
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none"
            >
              <option value="">Select Type</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="tel">Tel</option>
              <option value="select">Select</option>
              <option value="checkbox">Check box</option>
              <option value="radio">Radio</option>
              <option value="date">Date</option>
              <option value="textarea">Textarea</option>
            </select>
          </div>

          <div className="flex items-center mt-6 cursor-pointer">
            <input
              type="checkbox"
              id={`${field.type}-${index}`}
              checked={field.required}
              onChange={(e) =>
                handleFieldChange(index, "required", e.target.checked)
              }
              className="mr-2 outline-none"
            />
            <label htmlFor={`${field.type}-${index}`} className="text-sm">
              Required
            </label>
          </div>

          {/* Field Preview */}
          <FieldPreview field={field} />

          <SelectOptionManager
            index={index}
            newOptions={newOptions}
            setNewOptions={setNewOptions}
            formFields={form.field}
            setFormFields={setForm}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeField(index)}
              className="text-red-500 text-sm border border-red-300 px-3 py-1 rounded hover:bg-red-50 cursor-pointer"
            >
              - Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={addField}
          className="text-blue-600 border border-blue-600 px-4 py-1 cursor-pointer rounded-lg hover:bg-blue-50"
        >
          + Add Question
        </button>

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
            className="border border-green-600 rounded-md py-2 px-8 mr-auto"
          >
            <span className="text-green-600">Next</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default NewSurveyQuestionsForm;
