"use client";

import axios from "@/app/lib/axios";
import { DataEntry } from "@/app/lib/type";
import { useCreateDataEntry, useFetchSingleDataPoint, useFetchSinglePipeline } from "@/app/pages/flywheel/_features/hook";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCloudUpload } from "react-icons/ai";

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

    // const renderField = (field: any, index: number) => {
    //     const baseStyle =
    //         "w-full px-3 py-2 bg-white border border-gray-300 rounded-md";

    //     switch (field.type) {
    //         case "text":
    //         case "email":
    //         case "number":
    //         case "date":
    //             return (
    //                 <input
    //                     key={index}
    //                     type={field.type}
    //                     value={formData[field.key] || ""}
    //                     onChange={(e) => handleChange(field.key, e.target.value)}
    //                     className={baseStyle}
    //                     required={field.required}
    //                 />
    //             );

    //         case "textarea":
    //             return (
    //                 <textarea
    //                     value={formData[field.key] || ""}
    //                     onChange={(e) => handleChange(field.key, e.target.value)}
    //                     className={`${baseStyle} resize-none h-24`}
    //                     required={field.required}
    //                 />
    //             );

    //         case "select":
    //             return (
    //                 <select
    //                     className={baseStyle}
    //                     value={formData[field.key] || ""}
    //                     onChange={(e) => handleChange(field.key, e.target.value)}
    //                     required={field.required}
    //                 >
    //                     <option value="" disabled>Select one</option>
    //                     {field.options?.map((opt: string, i: number) => (
    //                         <option key={i} value={opt}>
    //                             {opt}
    //                         </option>
    //                     ))}
    //                 </select>
    //             );

    //         case "radio":
    //             return (
    //                 <div className="flex items-center gap-3">
    //                     {field.options?.map((opt: string, i: number) => (
    //                         <label key={i} className="flex items-center gap-2 text-sm">
    //                             <input
    //                                 type="radio"
    //                                 name={`radio-${index}`}
    //                                 value={opt}
    //                                 checked={formData[field.key] === opt}
    //                                 onChange={(e) => handleChange(field.key, e.target.value)}
    //                             />
    //                             {opt}
    //                         </label>
    //                     ))}
    //                 </div>
    //             );
    //         case "file":
    //             return (
    //                 <div className="relative bg-gray-50 border border-dashed rounded-xl border-gray-300 px-6 py-6">
    //                     <label className="flex items-center gap-2 text-sm h-22">
    //                         <input
    //                             key={index}
    //                             type={field.type}
    //                             value={formData[field.key] || ""}
    //                             onChange={(e) => handleChange(field.key, e.target.value)}
    //                             className='hidden'
    //                             required={field.required}
    //                         />

    //                         <div className="absolute w-full flex flex-col items-center justify-center">
    //                             <p className="text-gray-500">File Upload</p>
    //                             <button className="bg-gray-300 mt-5 p-4 rounded-full">
    //                                 <AiOutlineCloudUpload />
    //                             </button>
    //                         </div>
    //                     </label>
    //                 </div>
    //             )

    //         case "checkbox":
    //             return (
    //                 <div className="flex flex-col gap-2">
    //                     {field.options?.map((opt: string, i: number) => (
    //                         <label key={i} className="flex items-center gap-2 text-sm">
    //                             <input
    //                                 type="checkbox"
    //                                 checked={Array.isArray(formData[field.key]) && formData[field.key].includes(opt)}
    //                                 onChange={(e) => {
    //                                     const checked = e.target.checked;
    //                                     setFormData((prev) => {
    //                                         const currentValues = Array.isArray(prev[field.key]) ? prev[field.key] : [];
    //                                         const updatedValues = checked
    //                                             ? [...currentValues, opt]
    //                                             : currentValues.filter((val: any) => val !== opt);
    //                                         return {
    //                                             ...prev,
    //                                             [field.key]: updatedValues,
    //                                         };
    //                                     });
    //                                 }}
    //                             />

    //                             {opt}
    //                         </label>
    //                     ))}
    //                 </div>
    //             );

    //         default:
    //             return (
    //                 <input
    //                     type="text"
    //                     value={formData[field.key] || ""}
    //                     onChange={(e) => handleChange(field.key, e.target.value)}
    //                     className={baseStyle}
    //                 />
    //             );
    //     }
    // };

    const renderField = (field: any, index: number) => {
        const baseStyle =
            "w-full px-3 py-2 bg-white border border-gray-300 rounded-md";

        switch (field.type) {
            case "text":
            case "email":
            case "number":
            case "date":
            case "time":
                return (
                    <input
                        key={index}
                        type={field.type}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={baseStyle}
                        required={field.required}
                    />
                );

            case "textarea":
                return (
                    <textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={`${baseStyle} resize-none h-24`}
                        required={field.required}
                    />
                );

            case "select":
                return (
                    <select
                        className={baseStyle}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                    >
                        <option value="" disabled>Select one</option>
                        {field.options?.map((opt: string, i: number) => (
                            <option key={i} value={opt}>
                                {opt}
                            </option>
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
                                    name={`radio-${index}`}
                                    value={opt}
                                    checked={formData[field.key] === opt}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
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
                                        setFormData((prev) => {
                                            const currentValues = Array.isArray(prev[field.key]) ? prev[field.key] : [];
                                            const updatedValues = checked
                                                ? [...currentValues, opt]
                                                : currentValues.filter((val: any) => val !== opt);
                                            return {
                                                ...prev,
                                                [field.key]: updatedValues,
                                            };
                                        });
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
                                key={index}
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleChange(field.key, file);
                                }}
                                className="hidden"
                                required={field.required}
                            />
                            <AiOutlineCloudUpload size={32} />
                            <p className="text-gray-500">Upload file</p>
                            {formData[field.key] && (
                                <p className="text-xs mt-1 text-gray-600 truncate max-w-[200px]">
                                    {formData[field.key].name}
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
                                onClick={() => handleChange(field.key, star)}
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
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={baseStyle}
                    />
                );
        }
    };

    const queryClient = useQueryClient();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!datapoints) return;

        const cleanedData: Record<string, any> = {};
        Object.entries(formData).forEach(([key, value]) => {
            cleanedData[key] = Array.isArray(value) ? value.join(", ") : value;
        });

        const payload: DataEntry = {
            businessUserId: datapoints.businessUserId ?? null,
            employeeUserId: datapoints.employeeUserId ?? null,
            dataPointId: datapoints.dataPointId,
            fieldId: uniqueId,
            data: cleanedData, // data fields objects
        };

        submitEntry(payload, {
            onSuccess: () => {
                setFormData({ data: {} })
                queryClient.invalidateQueries({ queryKey: ['data-entries'] });
                toast.success("Entry submitted successfully!");
                onClose(); // close the modal
                refetchEntries()
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
                                            {renderField(field, index)}
                                        </div>
                                    ))}
                                    <div className="flex justify-center pt-4 border-t border-gray-200 mt-6">
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
                                        >
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
