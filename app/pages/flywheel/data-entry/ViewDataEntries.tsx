"use client";

import axios from "@/app/lib/axios";
import { useFetchDataPointOfDataEntries, useFetchSingleDataPoint } from "../_features/hook";
import { formatDate } from "@/app/utils/formatDate";
import { toSentenceCase } from "@/app/utils/caseFormat";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import AnalyseData from "../_components/AnalyseData";
import { useEffect, useState } from "react";
import Pagination from "../_components/Pagination";
import NewDataPoint from "./new/NewDataEntry";
import { useSearchParams } from "next/navigation";
import EntryOptionsModal from "../_components/EntryOptionsModal";
import { ExportToExcel } from "../_components/ExportToExcel";
import Link from "next/link";

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
    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('');
    const [openEntry, setOpenEntry] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [analyseData, setAnalyseData] = useState(false);
    const backParams: string = 'pipelines';

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

    const { data: datapoints } = useFetchSingleDataPoint({
        axios,
        id: entries?.[0]?.fieldId ?? "",
        enabled: !!entries?.[0]?.fieldId, // only run when ID is present
    });

    const handleNewDataEntry = (dataPointId: string) => {
        setOpenNewDataEntry(true)
        setOpenEntry(false);
        setUniqueDataPoint(dataPointId)
    }

    const searchParams = useSearchParams();
    useEffect(() => {
        refetch();
    }, [refetch, searchParams])

    if (!viewDataEntries) return null;

    const renderValue = (value: unknown) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className="w-full pb-5">
            {isLoading && <p className="">Loading...</p>}

            <>
                <div className="flex justify-between gap-5 mt-3">
                    {!isLoading && entries && entries.length > 0 && (
                        <>
                            <button
                                className="px-5 py-1 flex items-center bg-blue-600 text-white rounded-md cursor-pointer"
                                onClick={() => setAnalyseData(true)}
                            >
                                <Sparkles size={15} color="white" className="mr-1 inline animate-pulse " />
                                Analyse data
                            </button>

                            <button
                                className="px-5 py-1 w-[200px] flex justify-center items-center bg-blue-600 text-white rounded-md cursor-pointer"
                                onClick={() => setOpenEntry(true)}
                            >
                                <Plus size={15} color="white" className="mr-1 inline" />
                                Create a New Entry
                            </button>
                        </>
                    )}

                </div>
                {!isLoading && entries && entries.length > 0 && (
                    <>
                        <div className="flex items-center justify-between mt-5 gap-2 flex-wrap">
                            <h2 className="text-lg text-blue-600">
                                {'Pipeline name: ' + entries[0]?.dataPointName}
                            </h2>

                            <div className="flex gap-2 flex-wrap">
                                {/* <DownloadTemplate data={datapoints} dataPointName={singlePipeline?.dataPointName || "Template"} /> */}
                                {datapoints && entries.length > 0 && (
                                    <ExportToExcel
                                        data={entries.map(e => e.data)}
                                        datapoints={datapoints}
                                        dataPointName={entries[0]?.dataPointName || "Export"}
                                    />
                                )}

                            </div>
                        </div>

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
                {!isLoading && entries && entries.length === 0 && (
                    <div className="flex justify-between mt-5">
                        <p>
                            No entries found in this pipeline
                        </p>
                        <Link
                            className='flex px-3 py-2 items-center rounded-md text-white bg-blue-600'
                            href={`/pages/flywheel?tab=${backParams}`}
                        >
                            <ArrowLeft size={14} className='mr-1 inline' /> Back
                        </Link>
                    </div>
                )}

            </>


            <AnalyseData
                analyseData={analyseData}
                uniqueId={uniqueId}
                onClose={() => setAnalyseData(false)}
            />

            <NewDataPoint
                openNewDataEntry={openNewDataEntry}
                onClose={() => setOpenNewDataEntry(false)}
                uniqueId={uniqueDataPoint}
                refetchEntries={refetch}
            />

            {openEntry && entries && entries.length > 0 && (
                <EntryOptionsModal
                    onClose={() => setOpenEntry(false)}
                    onNewEntry={() => handleNewDataEntry(entries[0].fieldId)}
                    fieldId={entries[0].fieldId}
                />
            )}
        </div >
    );
};

export default ViewDataEntries;
