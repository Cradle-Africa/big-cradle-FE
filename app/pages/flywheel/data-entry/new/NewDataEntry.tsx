"use client";

import axios from "@/app/lib/axios";
import { DataEntry } from "@/app/lib/type";
import { useCreateDataEntry, useFetchSingleDataPoint, useFetchSinglePipeline } from "@/app/pages/flywheel/_features/hook";
import { Spinner } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RenderDynamicField } from "../../_components/RenderDynamicField";

interface PopUpProps {
    openNewDataEntry: boolean;
    onClose: () => void;
    uniqueId: string;
    refetchEntries: () => void;
}

const NewDataEntry: React.FC<PopUpProps> = ({
    openNewDataEntry,
    onClose,
    uniqueId,
    refetchEntries
}) => {
    const { data: datapoints, isLoading } = useFetchSingleDataPoint({
        axios,
        id: uniqueId,
        enabled: openNewDataEntry,
    });


    const { data: singlePipeline } = useFetchSinglePipeline({
        axios,
        id: datapoints?.dataPointId || '',
        enabled: openNewDataEntry,
    });


    const [formData, setFormData] = useState<Record<string, any>>({});
    const { mutate: submitEntry, isPending } = useCreateDataEntry({ axios });

    useEffect(() => {
        if (datapoints?.field) {
            const initialFormData: Record<string, any> = {};
            datapoints.field.forEach((field: any) => {
                if (field.type === "checkbox") {
                    initialFormData[field.key] = []; //Checkbox must be an array
                } else {
                    initialFormData[field.key] = "";
                }
            });
            setFormData(initialFormData);
        }
    }, [datapoints]);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!datapoints) return;

        const cleanedData: Record<string, any> = {};

        const processFile = (file: File): Promise<any> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        base64: reader.result,
                        filename: file.name,
                        mimetype: file.type,
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        };


        for (const [key, value] of Object.entries(formData)) {
            if (value instanceof File) {
                cleanedData[key] = await processFile(value);
            } else {
                cleanedData[key] = Array.isArray(value) ? value.join(", ") : value;
            }
        }

        const payload: DataEntry = {
            businessUserId: datapoints.businessUserId ?? null,
            employeeUserId: datapoints.employeeUserId ?? null,
            dataPointId: datapoints.dataPointId,
            fieldId: uniqueId,
            data: cleanedData,
        };

        submitEntry(payload, {
            onSuccess: () => {
                setFormData({});
                queryClient.invalidateQueries({ queryKey: ['data-entries'] });
                toast.success("Entry submitted successfully!");
                onClose(); // close the modal
                refetchEntries();
            },
            onError: (err: any) => {
                console.log(err);
                toast.error(`Error: ${err?.message}`);
            },
        });
    };


    if (!openNewDataEntry) return (null)
    return (
        <>
            <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

            <div className="fixed z-50 inset-0 flex items-center justify-center px-4">
                <div className="relative w-full bg-white rounded-xl shadow-xl max-w-2xl p-5">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-7 text-gray-400 hover:text-blue-600 cursor-pointer text-xl"
                    >
                        <X />
                    </button>

                    {isLoading ? (
                        <p className="flex justify-center px-10 py-10 text-gray-800 text-sm">Loading...</p>
                    ) : (
                        <>
                            <h2 className="text-xl text-blue-600">{singlePipeline?.dataPointName}</h2>
                            <div className="overflow-y-auto max-h-[70vh] py-8 ">
                                <form onSubmit={handleSubmit} className="space-y-6 text-left text-sm">
                                    {datapoints?.field.map((field, index) => (
                                        <div key={index}>
                                            <label className="block text-gray-700 mb-1 font-medium">
                                                {field.label}
                                                {field.required && (
                                                    <span className="text-red-500 ml-1">*</span>
                                                )}
                                            </label>
                                            {/* render the field dynamically */}
                                            <RenderDynamicField
                                                field={field}
                                                index={index}
                                                formData={formData}
                                                handleChange={handleChange}
                                            />
                                        </div>
                                    ))}
                                    <div className="flex justify-center pt-4 border-t border-gray-200 mt-6">
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
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
                        </>

                    )}

                </div>
            </div>
        </>

    );
};

export default NewDataEntry;
