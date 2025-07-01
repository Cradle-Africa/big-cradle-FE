"use client";

import { useState } from "react";
import { toCamelCase } from '@/app/utils/caseFormat';
import SelectOptionManager from "../_components/SelectOptionManager";
import { Check, List } from "lucide-react";
import FieldPreview from "../_components/FieldPreview";
import { FieldType, Field, DataPointForm, DataPoint, Pipeline } from "@/app/lib/type";
import { useCreateDataPoint } from '../_features/hook';
import { getBusinessId, getEmployeeUserId, getUser } from '@/app/utils/user/userData';
import axios from "@/app/lib/axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface DataPointProps {
    pipelines: Pipeline[]
    setCreatingDataPoint: (value: boolean) => void;
    creatingDataPoint: boolean,
}

const NewDataPoint: React.FC<DataPointProps> = ({ pipelines, setCreatingDataPoint }) => {
    const [newOptions, setNewOptions] = useState<string[]>([]);
    const [form, setForm] = useState<DataPointForm>({
        dataPointId: "",
        field: [],
    });
    const user = getUser()

    let businessUserId: string | null = null;

    if (user?.role === 'business') {
        businessUserId = getBusinessId() || null;
    } else {
        businessUserId = user?.businessUserId || null;
    }

    const employeeUserId = getEmployeeUserId();
    const { mutate, isPending } = useCreateDataPoint({ axios });

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

    const queryClient = useQueryClient();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build full payload
        const payload: DataPoint = {
            businessUserId,
            employeeUserId,
            dataPointId: form.dataPointId,
            field: form.field,
        };

        mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["pipelines"] });
                setForm({ dataPointId: "", field: [], }); // clear the form
                setNewOptions([]);
                toast.success("Data point created successfully");
                setCreatingDataPoint(false)
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to create data point");
            }
        });
    };

    return (
        <>
            <div className="flex justify-between mt-5">
                <h2 className="text-md text-black">Build a New Data Point</h2>
                <button
                    className="flex justify-center w-[200px] items-center bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer"
                    onClick={() => setCreatingDataPoint(false)}
                >
                    <List size={18} color="white" className="mr-1" />
                    View Data Points
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full lg:w-3/4 py-6 rounded-md space-y-6"
            >
                <div className="w-full">
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
                </div>

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
                            <label htmlFor={`${field.type}-${index}`} className="text-sm" >Required</label>
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
                        + Add
                    </button>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                    >
                        <Check size={16} className="mr-1" />
                        {isPending ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </>

    );
};

export default NewDataPoint;
