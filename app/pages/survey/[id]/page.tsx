"use client";

import axios from "@/app/lib/axios";
import DashboardLayout from "@/app/DashboardLayout";
import { useParams } from "next/navigation";
import { useFetchSingleSurvey } from "../_features/hooks";
import SurveyDetailsLoadingPage from "./loading";
import { useRouter } from "next/navigation";

const SurveyDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useFetchSingleSurvey({
    axios,
    surveyId: params.id,
  });

  const renderField = (field: any, index: number) => {
    const baseStyle =
      "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed";

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
        return (
          <input
            key={index}
            type={field.type}
            readOnly
            value={`Sample ${field.label}`}
            className={baseStyle}
          />
        );

      case "textarea":
        return (
          <textarea
            readOnly
            value={`Sample text for ${field.label}`}
            className={`${baseStyle} resize-none h-24`}
          />
        );

      case "select":
        return (
          <select disabled className={baseStyle}>
            {field.options?.map((opt: string, i: number) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="grid gap-2">
            {field.options?.map((opt: string, i: number) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  disabled
                  name={`radio-${index}`}
                  checked={i === 0}
                  className="cursor-not-allowed"
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="grid gap-2">
            {field.options?.map((opt: string, i: number) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  disabled
                  name={`checkbox-${index}`}
                  checked={i === 0}
                  className="cursor-not-allowed"
                />
                {opt}
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            readOnly
            value={`${field.type}`}
            className={baseStyle}
          />
        );
    }
  };

  if (isLoading) return <SurveyDetailsLoadingPage />;

  return (
    <DashboardLayout>
      <div className="flex flex-col max-w-3xl">
        {/* <button className="py-2 rounded-md px-4 bg-blue-600 text-white ml-auto">
          Edit the survey
        </button> */}
        <div className="flex justify-between">
          <div>
            <p className="text-black font-bold">Survey Details</p>
            <p>Look down all the survey details</p>
          </div>
          <button
            onClick={() => router.back()}
            className="py-2 rounded-md px-4 bg-blue-600 text-white mb-8"
          >
            Go Back
          </button>
        </div>

        <div className="flex flex-col gap-2 bg-blue-50 rounded-b-md  p-4 mb-1">
          <p>Survey Name</p>
          <p className="text-black font-bold">{data?.data.surveyName}</p>
        </div>
        <div className="flex flex-col gap-2 bg-blue-50 rounded-b-md  p-4">
          <p>Survey Description</p>
          <p className="text-black font-bold">{data?.data.surveyDescription}</p>
        </div>

        <p className="text-black font-bold mt-8 mb-4">Survey Fields</p>
        <div className="flex flex-col gap-4">
          {data?.data.field.map((field, index) => (
            <div key={index}>
              <label className="block text-gray-700 mb-1 font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field, index)}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SurveyDetailsPage;
