"use client";

import { AiOutlineCloudUpload } from "react-icons/ai";
import React from "react";

interface RenderFieldProps {
  field: any;
  index: number;
  formData: Record<string, any>;
  handleChange: (key: string, value: any) => void;
}

export const RenderDynamicField: React.FC<RenderFieldProps> = ({
  field,
  index,
  formData,
  handleChange,
}) => {
  const baseStyle =
    "w-full px-3 py-2 bg-white border border-gray-300 rounded-md";

  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "date":
    case "time":
      return (
        <input
          key={index}
          type={field.type}
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className={baseStyle}
          required={field.required}
        />
      );

    case "textarea":
      return (
        <textarea
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className={`${baseStyle} resize-none h-24`}
          required={field.required}
        />
      );

    case "select":
      return (
        <select
          className={baseStyle}
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          required={field.required}
        >
          <option value="" disabled>Select one</option>
          {field.options?.map((opt: string, i: number) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="grid grid-cols-3 gap-3">
          {field.options?.map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={`radio-${index}`}
                value={opt}
                checked={formData[field.key] === opt}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
              {opt}
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="grid grid-cols-3 gap-2">
          {field.options?.map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  Array.isArray(formData[field.key]) &&
                  formData[field.key].includes(opt)
                }
                onChange={(e) => {
                  const checked = e.target.checked;
                  const currentValues = Array.isArray(formData[field.key])
                    ? formData[field.key]
                    : [];
                  const updatedValues = checked
                    ? [...currentValues, opt]
                    : currentValues.filter((val: any) => val !== opt);
                  handleChange(field.key, updatedValues);
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      );

    case "file":
      return (
        <div className="relative bg-gray-50 border border-dashed rounded-xl border-gray-300 px-6 py-6">
          <label className="flex flex-col items-center gap-2 text-sm cursor-pointer">
            <input
              key={index}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleChange(field.key, file);
              }}
              className="hidden"
              required={field.required}
            />
            <AiOutlineCloudUpload size={32} />
            <p className="bg-blue-600 rounded-md px-2 py-1 text-white">Upload file</p>
            {formData[field.key] && (
              <p className="text-xs mt-1 text-gray-600 truncate max-w-[200px]">
                {formData[field.key].name}
              </p>
            )}
          </label>
        </div>
      );

    case "rating":
      return (
        <div className="flex items-center gap-1">
          {["1", "2", "3", "4", "5"].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleChange(field.key, star)}
              className={`text-2xl ${star <= (formData[field.key] || 0)
                  ? "text-yellow-400"
                  : "text-gray-300"
                }`}
            >
              ★
            </button>
          ))}
        </div>
      );

    default:
      return (
        <input
          type="text"
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(field.key, e.target.value)}
          className={baseStyle}
        />
      );
  }
};
