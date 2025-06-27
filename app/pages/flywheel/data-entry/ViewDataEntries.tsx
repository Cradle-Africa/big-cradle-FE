"use client";

import axios from "@/app/lib/axios";
import { useFetchDataPointOfDataEntries, useFetchSinglePipeline } from "../_features/hook";
import { formatDate } from "@/app/utils/formatDate";
import { toSentenceCase } from "@/app/utils/caseFormat";
import { ChartLine, List } from "lucide-react";
import AnalyseData from "../_components/AnalyseData";
import { useState } from "react";

interface ViewDataEntriesProps {
    viewDataEntries: boolean;
    uniqueId: string;
    setViewDataEntries: (value: boolean) => void;
}

const ViewDataEntries: React.FC<ViewDataEntriesProps> = ({
    viewDataEntries,
    uniqueId,
    setViewDataEntries,
}) => {
    const { data, isLoading } = useFetchDataPointOfDataEntries({
        axios,
        queryParams: {
            dataPoint: uniqueId,
            page: 1,
            limit: 10,
        },
    });

    // console.log(pipeline)
    const [analyseData, setAnalyseData] = useState(false);

    if (!viewDataEntries) return null;

    const renderValue = (value: unknown) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className="w-full pb-5">
            {isLoading && <p className="mt-10">Loading...</p>}

            {!isLoading && (!data?.entries || data.entries.length === 0) && (
                <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
                    <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Field Values</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Created On</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="flex justify-center px-5 py-5">No data entries</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && data?.entries && data.entries.length > 0 && (
                <>
                    <AnalyseData
                        analyseData={analyseData}
                        uniqueId={uniqueId}
                        onClose={() => setAnalyseData(false)}
                    />

                    <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
                        <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Created On</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {data.entries.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <table className="text-md">
                                                <tbody>
                                                    {entry.data && typeof entry.data === 'object' ? (
                                                        Object.entries(entry.data).length > 0 ? (
                                                            Object.entries(entry.data).map(([key, value]) => (
                                                                <tr key={key}
                                                                    className="flex justify-between min-w-[500px] max-w-[500px]
                                                            border-b border-gray-200 last:border-b-0
                                                            "
                                                                >
                                                                    <td className="font-medium flex flex-wrap min-w-[230px] max-w-[230px] py-2">{toSentenceCase(key)}:</td>
                                                                    <td className="flex flex-wrap justify-end min-w-[250px] max-w-[250px] py-2">{renderValue(value)}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={2} className="text-gray-400 italic">
                                                                    Empty data object
                                                                </td>
                                                            </tr>
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={2} className="text-gray-400 italic">
                                                                No data available
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(entry.createdAt ?? '')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="fixed align-bottom bottom-5 right-5 z-10">
                            <div className="text-center text-sm">Analyse</div>
                            <button
                                className="flex justify-center w-15 h-15 items-center bg-blue-600 text-white rounded-full cursor-pointer"
                                onClick={() => setAnalyseData(true)}
                            >
                                <ChartLine size={25} color="white" className="mr-1 animate-pulse " />
                            </button>
                        </div>
                    </div>



                </>

            )}
        </div>
    );
};

export default ViewDataEntries;
