import { FieldType } from "@/app/lib/type";
import React from "react";

interface FormFieldEditorProps {
    index: number;
    field: {
        label: string;
        type: FieldType;
    };
    handleFieldChange: (
        index: number,
        key: keyof { label: string; type: FieldType },
        value: string
    ) => void;
}

const FormFieldEditor: React.FC<FormFieldEditorProps> = ({
    index,
    field,
    handleFieldChange,
}) => {
    return (
        <div className="w-full grid grid-cols-2 gap-2 md:gap-5 mb-5">
            <input
                type="text"
                required
                placeholder="Question"
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
    );
};

export default FormFieldEditor;
