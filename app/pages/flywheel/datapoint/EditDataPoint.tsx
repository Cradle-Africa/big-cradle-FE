"use client";

import { useEffect, useState } from "react";
import { toCamelCase } from "@/app/utils/caseFormat";
import SelectOptionManager from "../_components/SelectOptionManager";
import FieldPreview from "../_components/FieldPreview";
import { Check, List } from "lucide-react";
import { Field, DataPointForm, FieldType, DataPoint } from "@/app/lib/type";
import { useEditPipeline, useFetchSingleDataPoint } from "../_features/hook";
import { getBusinessId, getEmployeeUserId } from "@/app/utils/user/userData";
import axios from "@/app/lib/axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface EditDataPointProps {
    editingDataPoint: boolean,
    uniqueId: string;
    setEditingDataPoint: (value: boolean) => void;
}

const EditDataPoint: React.FC<EditDataPointProps> = ({ editingDataPoint, uniqueId, setEditingDataPoint }) => {
    const [newOptions, setNewOptions] = useState<string[]>([]);
    const [form, setForm] = useState<DataPointForm>({ dataPointId: '', field: [] });

    const businessUserId = getBusinessId();
    const employeeUserId = getEmployeeUserId();
    const queryClient = useQueryClient();

    const { data, isLoading } = useFetchSingleDataPoint({ axios, id: uniqueId });
    const { mutate, isPending } = useEditPipeline({ axios });

    useEffect(() => {
        if (data) {
            setForm({
                dataPointId: data.id || '',
                field: data.field,
            });
            setNewOptions(data.field.map(() => ""));
        }
    }, [data]);

    const handleFieldChange = <K extends keyof Field>(index: number, key: K, value: Field[K]) => {
        const updatedFields = [...form.field];
        updatedFields[index][key] = value;

        if (key === "label") {
            updatedFields[index]["key"] = toCamelCase(value as string);
        }

        if (key === "type" && typeof value === "string" && !["select", "multiselect", "radio"].includes(value)) {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: DataPoint = {
            businessUserId,
            employeeUserId,
            dataPointId: form.dataPointId,
            field: form.field,
        };

        mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["pipelines"] });
                toast.success("Data point updated successfully");
                setEditingDataPoint(false);
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to update data point");
            },
        });
    };

    if (isLoading) {
        return <p className="flex justify-center px-10 py-10 text-gray-700 text-sm">Loading...</p>;
    }

    if (!editingDataPoint) return null;
    return (
        <>
            <div className="flex justify-between">
                <h2 className="text-md text-black">Edit the data point</h2>
                <button
                    className="flex justify-center w-[200px] items-center bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer"
                    onClick={() => setEditingDataPoint(false)}
                >
                    <List size={18} color="white" className="mr-1" />
                    View Data Points
                </button>
            </div>
            <form
                onSubmit={handleSubmit}
                className="w-full lg:w-3/4 bg-white py-6 rounded-md space-y-6"
            >

                {form.field.map((field, index) => (
                    <div key={index} className="w-full p-4 border border-gray-300 rounded space-y-3 mb-2">
                        <div className="w-full grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="Label"
                                value={field.label}
                                onChange={(e) => handleFieldChange(index, "label", e.target.value)}
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
                                onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
                                className="mr-2 outline-none"
                            />
                            <label htmlFor={`${field.type}-${index}`} className="text-sm">Required</label>
                        </div>

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
                        + Add
                    </button>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                    >
                        <Check size={16} className="mr-1" />
                        {isPending ? "Updating..." : "Update"}
                    </button>
                </div>
            </form>
        </>

    );
};

export default EditDataPoint;
