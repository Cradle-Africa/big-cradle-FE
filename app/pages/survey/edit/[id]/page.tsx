"use client";

import axios from "@/app/lib/axios";

import DashboardLayout from "@/app/DashboardLayout";
import { Field, FieldType, SurveyForm } from "@/app/lib/type";
import { toCamelCase } from "@/app/utils/caseFormat";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SurveyDetailsLoadingPage from "../../[id]/loading";
import SurveySelectOptionManager from "../../_components/SelectOptionManager";
import { useFetchSingleSurvey } from "../../_features/hooks";

const SurveyEditPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<SurveyForm>({ surveyId: "", field: [] });
  const [newOptions, setNewOptions] = useState<string[]>([]);

  const { data, isLoading } = useFetchSingleSurvey({
    axios,
    surveyId: params.id,
  });

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

  const removeField = (index: number) => {
    const updatedFields = form.field.filter((_, i) => i !== index);
    const updatedOptions = newOptions.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, field: updatedFields }));
    setNewOptions(updatedOptions);
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

  useEffect(() => {
    if (data) {
      setForm({
        surveyId: data.data.id || "",
        field: data.data.field,
      });
      setNewOptions(data.data.field.map(() => ""));
    }
  }, [data]);

  if (isLoading) return <SurveyDetailsLoadingPage />;

  return (
    <DashboardLayout>
      <form className="max-w-3xl">
        <p className="text-xl font-bold mb-6">Edit Survey</p>

        {form.field.map((field, index) => (
          <div
            key={index}
            className="w-full p-4 border border-gray-300 rounded space-y-3 mb-2"
          >
            <div className="w-full grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Label"
                value={field.label}
                onChange={(e) =>
                  handleFieldChange(index, "label", e.target.value)
                }
                className="w-full border border-gray-200 rounded px-3 py-2 mt-1 outline-none"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value as FieldType)
                }
                className="w-full border border-gray-200 rounded px-3 py-2 mt-1 outline-none"
              >
                <option value="">Select Type</option>
                <option value="text">Text</option>
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

            <SurveySelectOptionManager
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
            + Add
          </button>

          {/* <button
            type="submit"
            disabled={isPending}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
          >
            <Check size={16} className="mr-1" />
            {isPending ? "Updating..." : "Update"}
          </button> */}
        </div>
      </form>
    </DashboardLayout>
  );
};

export default SurveyEditPage;
