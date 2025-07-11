"use client";

import { useState } from "react";
import { toCamelCase } from '@/app/utils/caseFormat';
import { ArrowLeft, Check, List, Trash2 } from "lucide-react";
import { FieldType, Field, DataPointForm, DataPoint, Pipeline } from "@/app/lib/type";
import { getBusinessId, getEmployeeUserId, getUser } from '@/app/utils/user/userData';
import axios from "@/app/lib/axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FieldPreview from "../../_components/FieldPreview";
import SelectOptionManager from "../../_components/SelectOptionManager";
import { useCreateDataPoint } from "../../_features/hook";

interface DataPointProps {
    pipelines?: Pipeline[]
    pipelineId?: string,
    pipelineName?: string,
    pipelineDescription?: string,
    setCreatingDataPoint?: (value: boolean) => void;
    creatingDataPoint?: boolean,
}

const NewDataPoint: React.FC<DataPointProps> = ({ pipelineId, pipelineName, pipelineDescription, pipelines, creatingDataPoint, setCreatingDataPoint }) => {
    const [newOptions, setNewOptions] = useState<string[]>([]);
    const [form, setForm] = useState<DataPointForm>({
        dataPointId: "",
        field: [
            {
                label: "",
                key: "",
                type: "text",
                required: false,
                options: [],
            }
        ],
    });
    const backParams: string = 'pipelines';
    const user = getUser()
    const route = useRouter();

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
            dataPointId: form.dataPointId || pipelineId || "",
            field: form.field,
        };

        mutate(payload, {
            onSuccess: () => {
                if (form.dataPointId) {
                    queryClient.invalidateQueries({ queryKey: ["data-points"] });
                } else {
                    route.push(`/pages/flywheel?tab=${backParams}`);
                }
                setForm({ dataPointId: "", field: [], }); // clear the form
                setNewOptions([]);
                toast.success("Data point created successfully");
                setCreatingDataPoint?.(false);
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to create data point");
            }
        });
    };

    return (
        <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex justify-between mt-5">
                <h2 className="text-lg text-black">Build a New Data Point</h2>
                {creatingDataPoint && setCreatingDataPoint ? (
                    <button
                        className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer"
                        onClick={() => setCreatingDataPoint(false)}
                    >
                        <List size={18} color="white" className="mr-1" />
                        <span className="hidden md:inline">View Data Points</span>
                    </button>
                ) : (
                    <Link
                        className='flex px-3 py-2 items-center rounded-md text-white bg-blue-600'
                        href={`/pages/flywheel?tab=${backParams}`}
                    >
                        <ArrowLeft size={14} className='mr-1 inline' /> <span className="hidden md:inline">Back</span>
                    </Link>
                )}
            </div>
            {pipelineName && (
                <div className="lg:w-3/4 mt-5 border-t-8 border-blue-600 bg-white rounded-lg space-y-3 mb-5"
                >
                    <div className="p-4">
                        <h2 className="text-lg">{pipelineName} </h2>
                        <p className="text-md mt-5">
                            {pipelineDescription}
                        </p>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="w-full lg:w-3/4 rounded-md space-y-6 mt-10"
            >
                {pipelines && (
                    <div className="w-full">
                        <select
                            value={form.dataPointId}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, dataPointId: e.target.value }))
                            }
                            required
                            className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 outline-blue-600"
                        >
                            <option value="">Select a pipeline</option>
                            <>
                                {pipelines.map((dp: any) => (
                                    <option key={dp.id} value={dp.id}>
                                        {dp.dataPointName}
                                    </option>
                                ))}
                            </>
                        </select>
                    </div>
                )}

                {form.field.map((field, index: any) => (
                    <div
                        key={index}
                        className="w-full py-4 px-5 border bg-white border-gray-200 rounded-lg space-y-3 mb-5 
                        hover:border-0 hover:border-l-8 hover:border-blue-600 
                        transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                        focus-within:border-blue-600 focus-within:border-l-8
                        "
                    >
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

                        {/* Field Preview */}
                        <FieldPreview field={field} />

                        <SelectOptionManager
                            index={index}
                            newOptions={newOptions}
                            setNewOptions={setNewOptions}
                            formFields={form.field}
                            setFormFields={setForm}
                        />

                        <div className="flex justify-end items-center gap-5 mt-5 border-t border-gray-100 pt-3">
                            <div className="flex items-center cursor-pointer">
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

                            <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="flex items-center text-sm  cursor-pointer"
                            >
                                <Trash2 size={15} className="inline mr-1" /> Remove
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
        </div>

    );
};

export default NewDataPoint;
