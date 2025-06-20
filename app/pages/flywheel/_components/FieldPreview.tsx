"use client";

import React from "react";

type FieldType = "text" | "select" | "date" | "radio" | "textarea" | "multiselect";

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

const FieldPreview: React.FC<FieldPreviewProps> = ({ field }) => {
    switch (field.type) {
        case "text":
            return (
                <input
                    type="text"
                    placeholder="Enter text"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
                    disabled
                />
            );

        case "date":
            return (
                <input
                    type="date"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
                    disabled

                />
            );

        case "radio":
            if ((field.options?.length ?? 0) === 0) return null;
            return (
                <div className="space-y-2">
                    {(field.options ?? []).map((opt, i) => (
                        <label key={i} className="flex items-center space-x-2">
                            <input type="radio" name={field.key} disabled />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            );


        case "textarea":
            return (
                <textarea
                    placeholder="Enter text"
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
                    rows={3}
                    disabled

                />
            );


        case "multiselect":
            if ((field.options?.length ?? 0) === 0) return null;
            return (
                <select
                    multiple
                    className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
                    disabled
                >
                    {(field.options ?? []).map((opt, i) => (
                        <option key={i}>{opt}</option>
                    ))}
                </select>
            );

        default:
            return null;
    }
};

export default FieldPreview;
