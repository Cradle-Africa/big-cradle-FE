"use client";

import axios from "@/app/lib/axios";
import { useFetchDataPointOfDataEntries } from "../_features/hook";
import { formatDate } from "@/app/utils/formatDate";
import { toSentenceCase } from "@/app/utils/caseFormat";
import { ChartLine, Plus } from "lucide-react";
import AnalyseData from "../_components/AnalyseData";
import { useState } from "react";
import Pagination from "../_components/Pagination";
import NewDataPoint from "./new/NewDataEntry";

interface ViewDataEntriesProps {
    viewDataEntries: boolean;
    uniqueId: string;
    setViewDataEntries: (value: boolean) => void;
}

const ViewDataEntries: React.FC<ViewDataEntriesProps> = ({
    viewDataEntries,
    uniqueId,
}) => {

    const [openNewDataEntry, setOpenNewDataEntry] = useState(false);
    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('')
    
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading, refetch } = useFetchDataPointOfDataEntries({
        axios,
        queryParams: {
            dataPoint: uniqueId,
            page: page,
            limit: limit,
        },
    });

    const entries = data?.entries
    const pagination = data?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 };

    const [analyseData, setAnalyseData] = useState(false);

    const handleNewDataEntry = (dataPointId:  string) => {
        setOpenNewDataEntry(true)
        setUniqueDataPoint(dataPointId)
    }

    if (!viewDataEntries) return null;

    const renderValue = (value: unknown) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className="w-full pb-5">
            {isLoading && <p className="mt-10">Loading...</p>}

            {!isLoading && (!entries || entries.length === 0) && (
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

            {!isLoading && entries && entries.length > 0 && (
                <>
                    <AnalyseData
                        analyseData={analyseData}
                        uniqueId={uniqueId}
                        onClose={() => setAnalyseData(false)}
                    />

                    <div className="flex justify-between gap-5 mt-3">
                        <button
                            className="px-5 py-1 flex items-center bg-blue-600 text-white rounded-md cursor-pointer"
                            onClick={() => setAnalyseData(true)}
                        >
                            <ChartLine size={15} color="white" className="mr-1 inline animate-pulse " />
                            Analyse data
                        </button>

                        <button
                            className="px-5 py-1 w-[200px] flex items-center bg-blue-600 text-white rounded-md cursor-pointer"
                            onClick={() => handleNewDataEntry(entries[0].fieldId )}
                        >
                            <Plus size={15} color="white" className="mr-1 inline" />
                            New Data Entry
                        </button>
                    </div>
                    <h2 className="mt-5 text-blue-500 text-lg lg:text-xl"> {entries[0].dataPointName ? 'Data Entries: ' + entries[0].dataPointName : '' }</h2>

                    <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
                        <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Created On</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {entries.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium align-top">{index + 1}</td>
                                        <td className="px-6 py-2 align-top">
                                            <table className="text-md">
                                                <tbody>
                                                    {entry.data && typeof entry.data === 'object' ? (
                                                        Object.entries(entry.data).length > 0 ? (
                                                            Object.entries(entry.data).map(([key, value]) => (
                                                                <tr key={key}
                                                                    className="flex justify-between lg:min-w-[500px] lg:max-w-[500px]
                                                            border-b border-gray-200 last:border-b-0
                                                            "
                                                                >
                                                                    <td className="font-medium flex flex-wrap lg:min-w-[250px] lg:max-w-[230px] py-2">{toSentenceCase(key)}:</td>
                                                                    <td className="flex flex-wrap justify-end lg:min-w-[250px] lg:max-w-[250px] py-2">{renderValue(value)}</td>
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
                                        <td className="px-6 py-4 align-top">
                                            {formatDate(entry.createdAt ?? '')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={pagination.pages}
                        limit={limit}
                        onPageChange={(newPage) => setPage(newPage)}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                    />


                </>

            )}

            <NewDataPoint
                openNewDataEntry={openNewDataEntry}
                onClose={() => setOpenNewDataEntry(false)}
                uniqueId={uniqueDataPoint}
                refetchEntries={refetch}
            />
        </div>
    );
};

export default ViewDataEntries;
