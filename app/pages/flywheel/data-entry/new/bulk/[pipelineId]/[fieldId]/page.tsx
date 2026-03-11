"use client";

import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { DataEntry } from "@/app/lib/type";
import { toSentenceCase } from "@/app/utils/caseFormat";
import { DownloadTemplate } from "@/app/pages/flywheel/_components/DownloadTemplate";
import { ImportExcel } from "@/app/pages/flywheel/_components/ImportExcel";
import { RenderDynamicField } from "@/app/pages/flywheel/_components/RenderDynamicField";
import {
    useCreateBulkDataEntry,
    useFetchSingleDataPoint,
    useFetchSinglePipeline
} from "@/app/pages/flywheel/_features/hook";
import { Spinner } from "@radix-ui/themes";
import { ArrowLeft, Check, FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const NewBulkDataEntry = () => {
    const router = useRouter();
    const params = useParams();

    const { pipelineId, fieldId } = params as { pipelineId: string; fieldId: string };

    const { data: datapoints, isLoading } = useFetchSingleDataPoint({
        axios,
        id: fieldId,
    });

    const { data: singlePipeline } = useFetchSinglePipeline({
        axios,
        id: datapoints?.dataPointId || "",
        enabled: !!datapoints?.dataPointId,
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
        if (datapoints?.field && entries.length === 0) {
            setEntries([getEmptyFormData()]);
        }
    }, [datapoints, getEmptyFormData]);

    const handleEntryChange = (index: number, key: string, value: any) => {
        const updated = [...entries];
        updated[index] = { ...updated[index], [key]: value };
        setEntries(updated);
    };

    const addEntry = () => {
        setEntries([...entries, getEmptyFormData()]);
    };

    const removeEntry = (index: number) => {
        if (entries.length <= 1) return;
        const updated = entries.filter((_, i) => i !== index);
        setEntries(updated);
    };

    const isEntryEmpty = (entry: Record<string, any>) => {
        return Object.values(entry).every((v) => {
            if (v === "" || v === null || v === undefined) return true;
            if (Array.isArray(v) && v.length === 0) return true;
            return false;
        });
    };

    const nonEmptyEntries = entries.filter((e) => !isEntryEmpty(e));
    const hasEntriesToSubmit = nonEmptyEntries.length > 0;

    const { mutate: submitBulkEntry, isPending } = useCreateBulkDataEntry({ axios });

    const fileToBase64 = (
        file: File
    ): Promise<{ base64: string; filename: string; mimetype: string }> => {
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

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!datapoints) return;
        if (!hasEntriesToSubmit) {
            toast.error("Add or import at least one entry before submitting.");
            return;
        }

        try {
            const transformedEntries: DataEntry[] = await Promise.all(
                nonEmptyEntries.map(async (entry) => {
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
                    toast.error(err?.message || "Failed to submit entries");
                },
            });
        } catch (err: any) {
            console.error("File encoding failed:", err);
            toast.error("File encoding failed");
        }
    };

    const renderPreviewValue = (value: any) => {
        if (value == null || value === "") return "—";
        if (value instanceof File) return value.name;
        if (value && typeof value === "object" && value.filename) return value.filename;
        if (Array.isArray(value)) return value.join(", ");
        return String(value);
    };

    if (!pipelineId || !fieldId) {
        return (
            <DashboardLayout>
                <p className="text-red-500">Invalid pipeline or field ID</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="relative bg-gray-50 rounded-md py-5 px-5 min-h-screen">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner />
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Bulk data entries
                                </h1>
                                <p className="text-lg text-blue-600 mt-0.5">
                                    {singlePipeline?.dataPointName}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                        </div>

                        {/* Import from Excel */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <FileSpreadsheet size={20} className="text-blue-600" />
                                <h2 className="text-base font-semibold text-gray-900">
                                    Import from Excel
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Download the template, fill it with your data, then import the file.
                                Valid rows will appear in the preview below.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <DownloadTemplate
                                    data={datapoints}
                                    dataPointName={
                                        singlePipeline?.dataPointName || "template"
                                    }
                                />
                                <ImportExcel data={datapoints} setEntries={setEntries} />
                            </div>
                        </div>

                        {/* Or add manually */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Add entries manually
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        Fill out each row below. Use &quot;Add row&quot; to add more.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addEntry}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                                >
                                    <Plus size={16} />
                                    Add row
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {entries.map((entry, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600">
                                                Row {rowIndex + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeEntry(rowIndex)}
                                                disabled={entries.length <= 1}
                                                className="flex items-center gap-1.5 px-2 py-1.5 rounded text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent text-sm"
                                                title={
                                                    entries.length <= 1
                                                        ? "At least one row is required"
                                                        : "Remove this row"
                                                }
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {datapoints?.field?.map((field: any, fieldIndex: number) => (
                                                <div key={field.key}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        {field.label}
                                                        {field.required && (
                                                            <span className="text-red-500 ml-0.5">
                                                                *
                                                            </span>
                                                        )}
                                                    </label>
                                                    <RenderDynamicField
                                                        field={field}
                                                        index={rowIndex * 1000 + fieldIndex}
                                                        formData={entry}
                                                        handleChange={(key, value) =>
                                                            handleEntryChange(rowIndex, key, value)
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-center pt-2">
                                    <button
                                        type="button"
                                        onClick={addEntry}
                                        className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors text-sm"
                                    >
                                        <Plus size={16} />
                                        Add another row
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview */}
                        {entries.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                <h2 className="text-base font-semibold text-gray-900 mb-2">
                                    Preview
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    {nonEmptyEntries.length} entr
                                    {nonEmptyEntries.length === 1 ? "y" : "ies"} ready to
                                    submit.{" "}
                                    {entries.length - nonEmptyEntries.length > 0 &&
                                        `(${entries.length - nonEmptyEntries.length} empty row${
                                            entries.length - nonEmptyEntries.length === 1 ? "" : "s"
                                        } will be ignored)`}
                                </p>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium text-gray-700">
                                                    #
                                                </th>
                                                {datapoints?.field?.map((field: any) => (
                                                    <th
                                                        key={field.key}
                                                        className="px-4 py-3 text-left font-medium text-gray-700 whitespace-nowrap"
                                                    >
                                                        {toSentenceCase(field.label || field.key)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {nonEmptyEntries.map((entry, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-500">
                                                        {idx + 1}
                                                    </td>
                                                    {datapoints?.field?.map((field: any) => (
                                                        <td
                                                            key={field.key}
                                                            className="px-4 py-3 text-gray-700 max-w-[200px] truncate"
                                                            title={renderPreviewValue(
                                                                entry[field.key]
                                                            )}
                                                        >
                                                            {renderPreviewValue(entry[field.key])}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex items-center justify-between gap-4 pt-2 pb-4">
                            <p className="text-sm text-gray-600">
                                {hasEntriesToSubmit
                                    ? `Submit ${nonEmptyEntries.length} entr${
                                          nonEmptyEntries.length === 1 ? "y" : "ies"
                                      } to save them to this pipeline.`
                                    : "Import from Excel or add entries manually above, then submit."}
                            </p>
                            <button
                                type="button"
                                disabled={!hasEntriesToSubmit || isPending}
                                onClick={(ev) => handleSubmit(ev)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isPending ? (
                                    <>
                                        <Spinner />
                                        Submitting…
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Submit
                                        {hasEntriesToSubmit &&
                                            ` (${nonEmptyEntries.length})`}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default NewBulkDataEntry;
