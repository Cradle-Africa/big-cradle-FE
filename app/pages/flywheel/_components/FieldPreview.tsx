"use client";

import React from "react";
import { FieldType } from "@/app/lib/type";
import { AiOutlineCloudUpload } from "react-icons/ai";

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

const baseStyle =
    "w-full px-2 py-2 bg-white border-b border-gray-300 bg-gray-100 cursor-not-allowed";

const FieldPreview: React.FC<FieldPreviewProps> = ({ field }) => {
    switch (field.type) {
        case "text":
        case "email":
        case "tel":
        case "number":
        case "date":
        case "time":
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
                <select className={baseStyle} disabled>
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
                        <label key={i} className="flex gap-3 items-center">
                            <input type="radio" disabled className="cursor-not-allowed" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            );

        case "file":
            return (
                <div className="bg-gray-50 border border-dashed rounded-xl border-gray-300 px-6 py-6">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-500">File Upload</p>
                        <button className="bg-gray-300 mt-5 px-4 py-2 rounded-md cursor-not-allowed">
                            <AiOutlineCloudUpload />
                        </button>
                    </div>
                </div>
            );

        case "checkbox":
            if (!field.options?.length) return null;
            return (
                <div className="space-y-2">
                    {field.options.map((opt, i) => (
                        <label key={i} className="flex gap-3 items-center">
                            <input type="checkbox" disabled className="cursor-not-allowed" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            );

        case "rating":
            return (
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className=''
                        >
                            ★
                        </button>
                    ))}
                </div>
            );

        default:
            return null;
    }
};

export default FieldPreview;
