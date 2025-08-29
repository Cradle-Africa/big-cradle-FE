"use client";

import axios from "@/app/lib/axios";
import { useFetchSingleDataPoint, useFetchSinglePipeline } from "@/app/pages/flywheel/_features/hook";
import { useCreateDataEntry } from "@/app/pages/flywheel/_features/hook"; // Assuming same location
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { DataEntry } from "@/app/lib/type";
import toast from "react-hot-toast";
import LogoWithText from '@/public/images/white-logo-with-text.png'
import { Spinner } from "@radix-ui/themes";
import { Check } from "lucide-react";
import { RenderDynamicField } from "@/app/pages/flywheel/_components/RenderDynamicField";

const DataEntryPage = () => {
    const searchParams = useSearchParams();
    const encoded = searchParams.get("data-point");
    const decodedId = encoded ? atob(encoded) : "";

    const { data: datapoints, isLoading } = useFetchSingleDataPoint({
        axios,
        id: decodedId,
        enabled: !!decodedId,
    });

    const { data: singlePipeline } = useFetchSinglePipeline({
        axios,
        id: datapoints?.dataPointId || '',
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
            fieldId: decodedId,
            data: cleanedData,
        };

        submitEntry(payload, {
            onSuccess: () => {
                setFormData({})
                toast.success("Answer submitted successfully!");
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
                    <div className="flex capitalize text-blue-600 font-semibold text-xl mx-5 px-3 py-2">
                        {singlePipeline?.dataPointName}
                    </div>

                    {isSuccess && (
                        <div className="flex text-black text-xl mx-5 px-3 py-8">
                            {isSuccess && (
                            <div>
                                <h2 className="mb-10">Answer submitted</h2>
                                Thank you for your contribution. Every response counts!
                            </div>
                            )}
                        </div>
                    )}

                    {isLoading ? (
                        <p className="text-gray-800 flex justify-center py-10"> <Spinner /> </p>
                    ) : (
                        <>
                            {
                                !isSuccess && (
                                    <div className="overflow-y-auto max-h-[70vh] mt-4 pt-4 px-8">
                                        <form className="space-y-6 text-left text-sm" onSubmit={handleSubmit}>
                                            {datapoints?.field.map((field, index) => (
                                                <div key={index}>
                                                    <label className="block text-gray-700 mb-1 font-semibold">
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

                                            <div className="flex justify-center py-4 border-t border-gray-200 mt-6">
                                                <button
                                                    type="submit"
                                                    disabled={isPending}
                                                    className="flex justify-between items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
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
                                )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const SharedDataEntryForm = () => {
    return (
        <Suspense>
            <DataEntryPage />
        </Suspense>
    )
}

export default SharedDataEntryForm;
