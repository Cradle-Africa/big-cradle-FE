"use client";

import axios from "@/app/lib/axios";
import { useFetchDataPointOfDataEntries } from "../_features/hook";
import { formatDate } from "@/app/utils/formatDate";
import { toSentenceCase } from "@/app/utils/caseFormat";
import { ChartLine } from "lucide-react";
import AnalyseData from "../_components/AnalyseData";
import { useState } from "react";

interface ViewDataEntriesProps {
    viewDataEntries: boolean;
    uniqueId: string;
}

const ViewDataEntries: React.FC<ViewDataEntriesProps> = ({
    viewDataEntries,
    uniqueId,
}) => {
    const { data, isLoading } = useFetchDataPointOfDataEntries({
        axios,
        queryParams: {
            dataPoint: uniqueId,
            page: 1,
            limit: 10,
        },
    });
    const [analyseData, setAnalyseData] = useState(false);


    if (!viewDataEntries) return null;

    const renderValue = (value: unknown) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className="py-5">
            {isLoading && <p className="mt-10">Loading...</p>}

            {!isLoading && (!data?.entries || data.entries.length === 0) && (
                <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-10">
                    <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Field Values</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Created On</th>
                            </tr>
                        </thead>
                        <tbody>
                            <td className="flex justify-center px-10 py-5" colSpan={3}>No data entries found.</td>
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && data?.entries && data.entries.length > 0 && (
                <>
                    <div className="mt-5">
                        <button
                            className="flex justify-center w-[200px] items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
                            onClick={() => setAnalyseData(true)}
                        >
                            <ChartLine size={16} color="white" className="mr-1" />
                            Analyse Data
                        </button>
                    </div>
        
                    <AnalyseData
                        analyseData={analyseData}
                        uniqueId={uniqueId}
                        onClose={() => setAnalyseData(false)}
                    />

                    <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-10">
                        <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Field Values</th>
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
                    </div>
                </>

            )}
        </div>
    );
};

export default ViewDataEntries;
