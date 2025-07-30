"use client";

import axios from "@/app/lib/axios";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { SurveyEntryData } from "@/app/lib/type";
import toast from "react-hot-toast";
import LogoWithText from '@/public/images/white-logo-with-text.png';
import { Spinner } from "@radix-ui/themes";
import { Check } from "lucide-react";
import { useFetchSingleSurvey } from "@/app/pages/survey/_features/hooks";
import { RenderDynamicField } from "@/app/pages/flywheel/_components/RenderDynamicField";
import { useCreateSurveyDataEntry } from "../_features/hooks";
import { useCurrentLocation } from "@/app/utils/useCurrentLocation";

const DataEntryPage = () => {
    const searchParams = useSearchParams();
    const encoded = searchParams.get("survey");
    const decodedId = encoded ? atob(encoded) : "";

    const { data: survey, isLoading, isError } = useFetchSingleSurvey({
        axios,
        surveyId: decodedId,
    });

    const [formData, setFormData] = useState<Record<string, any>>({});

    const { mutate: submitEntry, isPending, isSuccess } = useCreateSurveyDataEntry({ axios });

    const surveyFields = useMemo(() => {
        return survey?.data?.field ?? [];
    }, [survey?.data?.field]);

    useEffect(() => {
        if (surveyFields.length) {
            const initialFormData: Record<string, any> = {};
            surveyFields.forEach((field: any) => {
                initialFormData[field.key] = field.type === "checkbox" ? [] : "";
            });
            setFormData(initialFormData);
        }
    }, [surveyFields]);

    const { coordinates, error: locationError } = useCurrentLocation();

    useEffect(() => {
        if (locationError) {
            toast.error(`Location error: ${locationError}`);
        }
    }, [locationError]);

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!coordinates) {
            toast.error("Waiting for location access. Please allow location sharing and try again.");
            return;
        }

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

        const payload: SurveyEntryData = {
            businessUserId: survey?.data?.businessUserId ?? '',
            fieldId: survey?.data?.id ?? '',
            employeeUserId: survey?.data?.employeeUserId ?? '',
            location: {
                type: "Point",
                coordinates: [coordinates.longitude, coordinates.latitude], 
            },
            data: cleanedData,
        };

        submitEntry(payload, {
            onSuccess: () => {
                setFormData({});
                toast.success("We appreciate your contribution to the survey. Every response counts!");
            },
            onError: (err: any) => {
                console.error(err);
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

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">Error: failed to load survey form</p>
            </div>
        );
    }

    if (!isLoading && surveyFields.length <= 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">Error: survey contains no questions</p>
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
                        {survey?.data?.surveyName}
                    </div>

                    {isSuccess && (
                        <div className="flex text-blue-600 text-xl mx-5 px-3 py-8">
                            We appreciate your contribution to the survey. Every response counts!
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-gray-800 flex justify-center py-10">
                            <Spinner />
                        </div>
                    ) : (
                        !isSuccess && (
                            <div className="overflow-y-auto max-h-[70vh] mt-4 pt-4 px-8">
                                <form className="space-y-6 text-left text-sm" onSubmit={handleSubmit}>
                                    {surveyFields.map((field: any, index: number) => (
                                        <div key={index}>
                                            <label className="block text-gray-700 mb-1 font-medium">
                                                {field.label}
                                                {field.required && (
                                                    <span className="text-red-500 ml-1">*</span>
                                                )}
                                            </label>
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
                                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
                                        >
                                            {isPending ? (
                                                <>
                                                    <Spinner className='inline mr-1' /> Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={14} className="inline mr-1" /> Submit
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

const SharedDataEntryForm = () => (
    <Suspense>
        <DataEntryPage />
    </Suspense>
);

export default SharedDataEntryForm;
