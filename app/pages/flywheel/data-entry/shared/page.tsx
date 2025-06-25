"use client";

import axios from "@/app/lib/axios";
import { useFetchSingleDataPoint } from "../../_features/hook";
import { useCreateDataEntry } from "../../_features/hook"; // Assuming same location
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DataEntry } from "@/app/lib/type";
import toast from "react-hot-toast";
import LogoWithText from '@/public/images/white-logo-with-text.png'

const DataEntryPage = () => {
    const searchParams = useSearchParams();
    const encoded = searchParams.get("data-point");
    const decodedId = encoded ? atob(encoded) : "";

    const { data: datapoints, isLoading } = useFetchSingleDataPoint({
        axios,
        id: decodedId,
        enabled: !!decodedId,
    });

    const [formData, setFormData] = useState<Record<string, any>>({});
    const { mutate: submitEntry, isPending, isSuccess } = useCreateDataEntry({ axios });

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

    const renderField = (field: any, index: number) => {
        const baseStyle =
            "w-full px-3 py-2 bg-white border border-gray-300 rounded-md";

        switch (field.type) {
            case "text":
            case "email":
            case "number":
            case "date":
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
            fieldId: decodedId,
            data: cleanedData, // data fields objects
        };

        submitEntry(payload, {
            onSuccess: () => {
                setFormData({ data: {} })
                toast.success("Entry submitted successfully!");
            },
            onError: (err: any) => {
                console.log(err);
                toast.error(`Error: ${err?.message}`);
            },
        });
    };

    const dataBackground = '/images/data-background.jpg';

    if (!encoded) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">Invalid link</p>
            </div>
        );
    }

    return (
        <div>
            <div
                className="fixed z-50 inset-0 opacity-50 flex items-center justify-center px-4 py-5"
                style={{
                    backgroundImage: `url(${dataBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            <div className="fixed z-50 inset-0 flex items-center justify-center px-4 py-10">
                <div className="relative w-full bg-[#fcfcfc] rounded-lg max-w-2xl py-0">
                    <div className="flex justify-between bg-blue-600 text-xl rounded-t-lg font-semibold py-2 mb-5">
                        <Image
                            src={LogoWithText}
                            width={300}
                            height={7}
                            alt={'Big cradle logo'}
                            className="w-1/3 h-10"
                        />
                    </div>
                    <div className="flex text-blue-600 text-xl mx-5 px-3 py-2">
                        {"Data Pipeline"}
                    </div>


                    {isSuccess && (
                        <div className="flex text-blue-600 text-xl mx-5 px-3 py-8">
                            {isSuccess && ('Submitted successfully')}
                        </div>
                    )}

                    {isLoading ? (
                        <p className="text-gray-800 flex justify-center py-10">Loading...</p>
                    ) : (
                        <>
                            {
                                !isSuccess && (
                                    <div className="overflow-y-auto max-h-[70vh] mt-4 pt-4 px-8">
                                        <form className="space-y-6 text-left text-sm" onSubmit={handleSubmit}>
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

                                            <div className="flex justify-center py-4 border-t border-gray-200 mt-6">
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
                            )} 
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataEntryPage;
