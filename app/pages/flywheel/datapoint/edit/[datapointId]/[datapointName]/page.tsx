"use client";

import { useEffect, useState } from "react";
import { toCamelCase } from "@/app/utils/caseFormat";
import { ArrowLeft, Check } from "lucide-react";
import { Field, DataPointForm, FieldType, DataPoint } from "@/app/lib/type";
import { getBusinessId, getEmployeeUserId } from "@/app/utils/user/userData";
import axios from "@/app/lib/axios";
import toast from "react-hot-toast";
import FieldFooter from "@/app/components/form/FieldFooter";
import AddFieldButton from "@/app/components/form/AddFieldButton";
import FieldPreview from "../../../../_components/FieldPreview";
import SelectOptionManager from "../../../../_components/SelectOptionManager";
import { useEditPipeline, useFetchSingleDataPoint } from "../../../../_features/hook";
import DashboardLayout from "@/app/DashboardLayout";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const EditDataPoint = () => {

    const params = useParams();
    const router = useRouter();
    const backParams = 'data-points';
    const { datapointId, datapointName: encodedName } = params as { datapointId: string; datapointName: string };
    const datapointName = decodeURIComponent(encodedName);

    const [newOptions, setNewOptions] = useState<string[]>([]);
    const [form, setForm] = useState<DataPointForm>({ dataPointId: '', field: [] });

    const businessUserId = getBusinessId();
    const employeeUserId = getEmployeeUserId();
    // const queryClient = useQueryClient();

    const { data, isLoading } = useFetchSingleDataPoint({ axios, id: datapointId });
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
                // queryClient.invalidateQueries({ queryKey: ["data-points"] });
                router.push(`/pages/flywheel?tab=pipelines`);

                toast.success("Data point updated successfully");
                // setEditingDataPoint(false);
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to update data point");
            },
        });
    };

    if (isLoading) {
        return <DashboardLayout><p className="px-5 py-5 text-sm">Loading...</p>
        </DashboardLayout>
    }

    // if (!editingDataPoint) return null;
    return (
        <DashboardLayout>
            <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex justify-between">
                    <h2 className="text-lg font-semibold">Edit Data Point</h2>
                    <Link
                        href={`/pages/flywheel?tab=${backParams}`}
                        className="flex justify-center items-center bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer"
                    >
                        <ArrowLeft size={18} color="white" className="mr-1" />
                        Back
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full lg:w-3/4 rounded-md space-y-6"
                >
                    {datapointName && (
                        <div className="w-full mt-10 border-t-8 border-blue-600 bg-white rounded-lg space-y-3 mb-5"
                        >
                            <div className="p-4 w-full">
                                <h2 className="text-lg">{datapointName} </h2>
                            </div>
                        </div>
                    )}

                    {form.field.map((field, index) => (
                        <div key={index}
                            className={`w-full py-4 px-5 border bg-white border-gray-200 rounded-lg space-y-3 
                            hover:border-0 hover:border-l-8 hover:border-blue-600 
                            transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                            focus-within:border-blue-600 focus-within:border-l-8
                    `}>
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
                                    {/* <option value="file">File Upload</option> */}
                                    <option value="rating">Rating</option>
                                    <option value="textarea">Paragraph</option>
                                </select>

                            </div>


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

                    <div className="flex gap-3 mt-5">
                        <AddFieldButton
                            totalFields={form.field.length}
                            onAdd={addField}
                        />
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
            </div>
        </DashboardLayout>
    );
};

export default EditDataPoint;
