"use client";

import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { DataEntry } from "@/app/lib/type";
import { DownloadTemplate } from "@/app/pages/flywheel/_components/DownloadTemplate";
import { ImportExcel } from "@/app/pages/flywheel/_components/ImportExcel";
import {
    useCreateBulkDataEntry,
    useFetchSingleDataPoint,
    useFetchSinglePipeline
} from "@/app/pages/flywheel/_features/hook";
import { Spinner } from "@radix-ui/themes";
import { ArrowLeft, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { AiOutlineCloudUpload } from "react-icons/ai";

const NewBulkDataEntry = () => {
    const router = useRouter();
    const params = useParams();

    const { pipelineId, fieldId } = params as { pipelineId: string, fieldId: string };

    const { data: datapoints, isLoading } = useFetchSingleDataPoint({
        axios,
        id: fieldId,
    });

    const { data: singlePipeline } = useFetchSinglePipeline({
        axios,
        id: datapoints?.dataPointId || '',
        enabled: true,
    });

    const [entries, setEntries] = useState<Record<string, any>[]>([]);

    const getEmptyFormData = useCallback(() => {
        const initial: Record<string, any> = {};
        datapoints?.field?.forEach((field: any) => {
            initial[field.key] = field.type === "checkbox" ? [] : "";
        });
        return initial;
    }, [datapoints]);

    useEffect(() => {
        if (datapoints?.field) {
            setEntries([getEmptyFormData()]);
        }
    }, [datapoints, getEmptyFormData]);

    const handleEntryChange = (index: number, key: string, value: any) => {
        const updated = [...entries];
        updated[index][key] = value;
        setEntries(updated);
    };

    const addEntry = () => {
        setEntries([...entries, getEmptyFormData()]);
    };

    const removeEntry = (index: number) => {
        if (entries.length === 1) return;
        const updated = [...entries];
        updated.splice(index, 1);
        setEntries(updated);
    };

    const renderField = (
        field: any,
        index: number,
        formData: Record<string, any>,
        onChange: (value: any) => void
    ) => {
        const baseStyle = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md";

        switch (field.type) {
            case "text":
            case "email":
            case "number":
            case "date":
                return (
                    <input
                        type={field.type}
                        value={formData[field.key] || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={baseStyle}
                        required={field.required}
                    />
                );
            case "textarea":
                return (
                    <textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={`${baseStyle} resize-none h-24`}
                        required={field.required}
                    />
                );
            case "select":
                return (
                    <select
                        className={baseStyle}
                        value={formData[field.key] || ""}
                        onChange={(e) => onChange(e.target.value)}
                        required={field.required}
                    >
                        <option value="" disabled>Select one</option>
                        {field.options?.map((opt: string, i: number) => (
                            <option key={i} value={opt}>{opt}</option>
                        ))}
                    </select>
                );
            case "radio":
                return (
                    <div className="flex items-center gap-3">
                        {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name={`radio-${field.key}-${index}`}
                                    value={opt}
                                    checked={formData[field.key] === opt}
                                    onChange={(e) => onChange(e.target.value)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                );
            case "checkbox":
                return (
                    <div className="flex flex-col gap-2">
                        {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={Array.isArray(formData[field.key]) && formData[field.key].includes(opt)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        const current = Array.isArray(formData[field.key]) ? formData[field.key] : [];
                                        const updated = checked
                                            ? [...current, opt]
                                            : current.filter((v: any) => v !== opt);
                                        onChange(updated);
                                    }}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                );

            case "file":
                return (
                    <div className="relative bg-gray-50 border border-dashed rounded-xl border-gray-300 px-6 py-6">
                        <label className="flex flex-col items-center gap-2 text-sm cursor-pointer">
                            <input
                                key={`${field.key}-${index}`}
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onChange(file);
                                }}
                                className="hidden"
                                required={field.required}
                            />
                            <AiOutlineCloudUpload size={32} />
                            <p className="bg-blue-600 rounded-md px-2 py-1 text-white">Upload file</p>
                            {formData[field.key] && (
                                <p className="text-xs mt-1 text-gray-600 truncate max-w-[200px]">
                                    {formData[field.key]?.name || formData[field.key]?.filename}
                                </p>
                            )}
                        </label>
                    </div>
                );

            case "rating":
                return (
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => onChange(star)}
                                className={`text-2xl ${star <= (formData[field.key] || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                );


            default:
                return (
                    <input
                        type="text"
                        value={formData[field.key] || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={baseStyle}
                    />
                );
        }
    };

    const { mutate: submitBulkEntry, isPending } = useCreateBulkDataEntry({ axios });


    const fileToBase64 = (file: File): Promise<{ base64: string, filename: string, mimetype: string }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve({
                    base64: reader.result as string,
                    filename: file.name,
                    mimetype: file.type,
                });
            };

            reader.onerror = (error) => reject(error);

            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!datapoints) return;

        try {
            const transformedEntries: DataEntry[] = await Promise.all(
                entries.map(async (entry) => {
                    const cleanedData: Record<string, any> = {};

                    for (const [key, value] of Object.entries(entry)) {
                        if (value instanceof File) {
                            cleanedData[key] = await fileToBase64(value);
                        } else if (Array.isArray(value)) {
                            cleanedData[key] = value.join(", ");
                        } else {
                            cleanedData[key] = value;
                        }
                    }

                    return {
                        businessUserId: datapoints.businessUserId ?? null,
                        employeeUserId: datapoints.employeeUserId ?? null,
                        dataPointId: datapoints.dataPointId,
                        fieldId,
                        data: cleanedData,
                    };
                })
            );

            submitBulkEntry(transformedEntries, {
                onSuccess: () => {
                    setEntries([getEmptyFormData()]);
                    toast.success("Entries submitted successfully!");
                    router.push(`/pages/flywheel/data-entry/${pipelineId}?t=${Date.now()}`);
                },
                onError: (err: any) => {
                    console.error(err);
                    toast.error(`Error: ${err?.message}`);
                },
            });

        } catch (err: any) {
            console.error("File encoding failed:", err);
            toast.error("File encoding failed");
        }
    };


    if (!pipelineId || !fieldId) {
        return <p className="text-red-500">Invalid pipeline or field ID</p>;
    }

    return (
        <DashboardLayout>
            <div className="relative bg-gray-50 rounded-md py-5 px-5">
                {isLoading ? (
                    <p className="text-gray-800 text-sm"><Spinner /> </p>
                ) : (
                    <div className="w-3/4 mx-auto">
                        <h2 className="text-xl font-semibold">Bulk data entries</h2>
                        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                            <h2 className="text-lg text-blue-600">
                                {singlePipeline?.dataPointName}
                            </h2>

                            <div className="flex gap-2 flex-wrap">
                                <ImportExcel data={datapoints} setEntries={setEntries} />
                                <DownloadTemplate data={datapoints} dataPointName={singlePipeline?.dataPointName || "Template"} />

                                {/* <ExportToExcel data={entries} datapoints={datapoints} dataPointName={singlePipeline?.dataPointName || "Export"} /> */}
                                <button
                                    onClick={() => router.back()}
                                    className="flex items-center justify-between bg-blue-600 rounded-md text-white px-3 py-2 cursor-pointer">
                                    <ArrowLeft size={15} className="inline mr-1" />
                                    Back
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto w-full flex justify-between py-8">
                            <form onSubmit={handleSubmit} className="space-y-6 w-full text-left text-sm">
                                {entries.map((formData, index) => (
                                    <div key={index} className="pb-2 border-b border-gray-200">
                                        <h3 className="mb-2 text-blue-600">Entry: {index + 1}</h3>
                                        <div className="border border-gray-300 px-5 pt-5 pb-8 mb-4 rounded-md relative">
                                            {datapoints?.field.map((field: any, i: number) => (
                                                <div key={i} className="mb-3">
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        {field.label}{" "}
                                                        {field.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    {renderField(field, i, formData, (value) =>
                                                        handleEntryChange(index, field.key, value)
                                                    )}
                                                </div>
                                            ))}
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeEntry(index)}
                                                    className="absolute bottom-2 right-5 hover:bg-red-100 border border-red-500 text-red-500 p-1 rounded-sm text-xs"
                                                >
                                                    - Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex gap-2 justify-between items-center mt-4">
                                    <button
                                        type="button"
                                        onClick={addEntry}
                                        className="w-1/2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md cursor-pointer"
                                    >
                                        + Add Entry
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-1/2 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
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
                )}
            </div>
        </DashboardLayout>
    );
};

export default NewBulkDataEntry;
