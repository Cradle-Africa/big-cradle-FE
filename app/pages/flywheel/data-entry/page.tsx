"use client";

import axios from "@/app/lib/axios";
<<<<<<< HEAD
import { useFetchSingleDataPoint } from "../_features/hook";
=======
import { useFetchSinglePipeline } from "../_features/hook";
>>>>>>> daccfb6 (merging dev into phil_dev)
import { useSearchParams } from "next/navigation";
import LogoWithText from "@/public/images/logo-with-text.png";
import Image from "next/image";


const DataEntryPage = () => {
    const searchParams = useSearchParams();
    const encoded = searchParams.get("data-point");
    const decodedId = encoded ? atob(encoded) : '';

<<<<<<< HEAD
    const { data: datapoints, isLoading } = useFetchSingleDataPoint({
=======
    const { data: datapoints, isLoading } = useFetchSinglePipeline({
>>>>>>> daccfb6 (merging dev into phil_dev)
        axios,
        id: decodedId,
        enabled: true,
    });

    if (!encoded) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">Invalid link</p>
            </div>
        );
    }

    const renderField = (field: any, index: number) => {
        const baseStyle =
<<<<<<< HEAD
            "w-full px-3 py-2 bg-white border border-gray-300 rounded-md ";
=======
            "w-full px-3 py-2 border border-gray-300 rounded-md ";
>>>>>>> daccfb6 (merging dev into phil_dev)

        switch (field.type) {
            case "text":
            case "email":
            case "number":
            case "date":
                return (
                    <input
                        key={index}
                        type={field.type}
                        value={field.label}
                        className={baseStyle}
                    />
                );

            case "textarea":
                return (
                    <textarea
                        value={field.label}
                        className={`${baseStyle} resize-none h-24`}
                    />
                );

            case "select":
                return (
                    <select disabled className={baseStyle}>
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
                            <label key={i} className="flex items-center gap-2 text-sm">                                <input
                                type="radio"
                                name={`radio-${index}`}
                                checked={i === 0}
                                className={baseStyle}
                            />
                                {opt}
                            </label>
                        ))}
                    </div>
                );

            case "checkbox":
                return (
                    <div className="flex items-center gap-3">
                        {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name={`checkbox-${index}`}
                                    checked={i === 0}
                                    className={`${baseStyle} `}
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
                        value={`${field.type}`}
                        className={baseStyle}
                    />
                );
        }
    };

    const dataBackground = '/images/data-background.jpg';

    return (
        <div>
            <div
                className="fixed z-50 inset-0 opacity-50 flex items-center justify-center px-4 py-10"
                style={{
                    backgroundImage: `url(${dataBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            <div className="fixed z-50 inset-0 flex items-center justify-center px-4 py-10">
<<<<<<< HEAD
                <div className="relative w-full rounded-lg max-w-2xl py-0 px-5">
=======
                <div className="relative w-full bg-white rounded-lg max-w-2xl py-0 px-5">
>>>>>>> daccfb6 (merging dev into phil_dev)
                    <div className="flex justify-between  text-xl rounded-t-lg font-semibold mt-3 mb-6 ">
                        <Image
                            src={LogoWithText}
                            width={300}
                            height={5}
                            alt={'Big cradle logo'}
                            className="w-1/3 h-10"
                        />

                    </div>
                    <div className="w-full bg-blue-600 text-white rounded-lg px-5 py-2">
                        Data pipeline name
                    </div>

                    {isLoading ? (
                        <p className="text-gray-800 flex justify-center py-10">Loading...</p>
                    ) : (
                        <>
                            <div className="overflow-y-auto max-h-[65vh] mt-4 pt-8 px-5">
                                <form className="space-y-6 text-left text-sm">
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
                                </form>
                            </div>

                            <div className="flex justify-center py-4  border-t border-gray-200 mt-6">
                                <button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer"

                                >
                                    Submit
                                </button>
                            </div>
                        </>

                    )}

                </div>
            </div>
        </div>


    );
};

export default DataEntryPage;
