"use client";

import React from "react";
import { FieldType } from "@/app/lib/type";

type Field = {
    label: string;
    key: string;
    type: FieldType;
    required: boolean;
    options?: string[];
};

interface FieldPreviewProps {
    field: Field;
}

const baseStyle = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed";

const FieldPreview: React.FC<FieldPreviewProps> = ({ field }) => {
    switch (field.type) {
        case "text":
        case "email":
        case "tel":
        case "number":
        case "date":
            return (
                <input
                    type={field.type}
                    placeholder={field.label}
                    className={baseStyle}
                    disabled
                />
            );

        case "textarea":
            return (
                <textarea
                    placeholder={field.label}
                    className={baseStyle}
                    rows={3}
                    disabled
                />
            );

        case "select":
            if (!field.options?.length) return null;
            return (
                <select
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100`}
                    disabled
                >
                    {field.options.map((opt, i) => (
                        <option key={i} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            );

        case "radio":
            if (!field.options?.length) return null;
            return (
                <div className="space-y-2">
                    {field.options.map((opt, i) => (
                        <label key={i} className="flex gap-3 items-center space-x-2 cursor-not-allowed">
                            <div>
                                <input type="radio" name={field.key}
                                    className={baseStyle} disabled />
                            </div>
                            <div>
                                <span>{opt}</span>
                            </div>

                        </label>
                    ))}
                </div>
            );

        case "checkbox":
            if (!field.options?.length) return null;
            return (
                <div className="space-y-2">
                    {field.options.map((opt, i) => (
                        <label key={i} className="flex gap-3 items-center space-x-2 cursor-not-allowed ">
                            <div>
                                <input type="checkbox" name={`${field.key}-${i}`} disabled
                                    className={baseStyle}
                                />
                            </div>
                            <div>{opt}</div>
                        </label>
                    ))}
                </div>
            );

        default:
            return null;
    }
};

export default FieldPreview;
