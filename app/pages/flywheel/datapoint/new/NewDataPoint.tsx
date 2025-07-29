"use client";

import { useState } from "react";
import { toCamelCase } from '@/app/utils/caseFormat';
import { ArrowLeft, Check, List } from "lucide-react";
import { Field, DataPointForm, DataPoint, Pipeline } from "@/app/lib/type";
import { getBusinessId, getEmployeeUserId, getUser } from '@/app/utils/user/userData';
import axios from "@/app/lib/axios";
import toast from "react-hot-toast";
// import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FieldPreview from "../../_components/FieldPreview";
import SelectOptionManager from "../../_components/SelectOptionManager";
import { useCreateDataPoint } from "../../_features/hook";
import FieldFooter from "@/app/components/form/FieldFooter";
import AddFieldButton from "@/app/components/form/AddFieldButton";
import { Spinner } from "@radix-ui/themes";
import FormFieldEditor from "../../_components/FormFieldEditor";

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

    const handleFieldLabelBlur = (index: number) => {
        const updatedFields = [...form.field];
        console.log(index);
        const labels = updatedFields.map((f) => f.label.trim().toLowerCase());
        const labelSet = new Set(labels);

        if (labelSet.size !== labels.length) {
            toast.error("Each field label must be unique.");
        }
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

        // Build full payload
        const payload: DataPoint = {
            businessUserId,
            employeeUserId,
            dataPointId: form.dataPointId || pipelineId || "",
            field: form.field,
        };

        mutate(payload, {
            onSuccess: () => {
                route.push(`/pages/flywheel?tab=${backParams}`);
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
        <div
            className="max-w-full mx-auto h-screen p-5 bg-gray-50 rounded-md space-y-4"
        >
            <div className="gap-4 max-w-xl 2xl:max-w-3xl mx-auto">
                <div className="flex justify-between mt-5">
                    <h2 className="text-lg text-black font-semibold">Build a New Data Point</h2>
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

                <form
                    onSubmit={handleSubmit}
                    className="w-full rounded-md space-y-6 mt-10"
                >
                    {pipelineName && (
                        <div className="w-full mt-5 border-t-8 border-blue-600 bg-white rounded-lg space-y-3 mb-5"
                        >
                            <div className="p-4">
                                <h2 className="text-lg">{pipelineName} </h2>
                                <p className="text-md mt-5">
                                    {pipelineDescription}
                                </p>
                            </div>
                        </div>
                    )}
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
                        <div key={index}
                            className={`w-full py-4 px-5 border bg-white border-gray-200 rounded-xl space-y-3 
                            hover:border-0 hover:border-l-6 hover:border-blue-600 
                            transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                            focus-within:border-blue-600 focus-within:border-l-6
                    `}>
                            <FormFieldEditor
                                key={index}
                                index={index}
                                field={field}
                                handleFieldChange={handleFieldChange}
                                handleFieldLabelBlur={handleFieldLabelBlur}
                            />

                            {/* Field Preview */}
                            <FieldPreview field={field} />

                            <SelectOptionManager
                                index={index}
                                newOptions={newOptions}
                                setNewOptions={setNewOptions}
                                formFields={form.field}
                                setFormFields={setForm}
                            />

                            <FieldFooter
                                index={index}
                                fieldType={field.type}
                                isRequired={field.required}
                                onToggleRequired={(i, value) => handleFieldChange(i, "required", value)}
                                onRemove={removeField}
                            />
                        </div>
                    ))}

                    <div className="flex justify-between gap-3 mt-5">
                        <AddFieldButton
                            totalFields={form.field.length}
                            onAdd={addField}
                        />
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center justify-center w-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                        >
                            {isPending ? (
                                <Spinner className='inline mr-1' />
                            ) : (
                                <Check size={14} className="inline mr-1" />
                            )
                            }
                            {isPending ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default NewDataPoint;
