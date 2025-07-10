"use client";

import axios from "@/app/lib/axios";
import { useFetchDataPointOfDataEntries, useFetchSingleDataPoint } from "../_features/hook";
import { formatDate } from "@/app/utils/formatDate";
import { toSentenceCase } from "@/app/utils/caseFormat";
import { ArrowLeft, FileStackIcon, Plus, Sparkles, X } from "lucide-react";
import AnalyseData from "../_components/AnalyseData";
import { useEffect, useState } from "react";
import Pagination from "../_components/Pagination";
import NewDataEntry from "./new/NewDataEntry";
import { useSearchParams } from "next/navigation";
import { ExportToExcel } from "../_components/ExportToExcel";
import Link from "next/link";

interface ViewDataEntriesProps {
    viewDataEntries: boolean;
    pipelineId: string;
    fieldId: string;
    setViewDataEntries: (value: boolean) => void;
}

const ViewDataEntries: React.FC<ViewDataEntriesProps> = ({
    viewDataEntries,
    pipelineId,
    fieldId,
}) => {

    const [openNewDataEntry, setOpenNewDataEntry] = useState(false);
    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('');
    const [openOptionsEntry, setOpenOptionsEntry] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [analyseData, setAnalyseData] = useState(false);
    const backParams: string = 'pipelines';

    const { data, isLoading, refetch } = useFetchDataPointOfDataEntries({
        axios,
        queryParams: {
            dataPoint: pipelineId,
            page: page,
            limit: limit,
        },
    });

    const entries = data?.entries
    const pagination = data?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 };

    const { data: datapoints } = useFetchSingleDataPoint({
        axios,
        id: fieldId ?? "",
        enabled: true, // only run when fieldId is present
    });

    const handleNewDataEntry = (fieldId: string) => {
        setOpenOptionsEntry(false); // close EntryOptionsModal
        setOpenNewDataEntry(true); // open NewDataEntry modal
        setUniqueDataPoint(fieldId);
    };

    const handleCloseNewDataEntry = () => {
        setOpenNewDataEntry(false);
    };

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
    const headers = entries && entries.length > 0 ? Object.keys(entries[0].data) : [];

    return (
        <div className="w-full pb-5">
            <h2 className="text-xl mb-4">Data entries</h2>
            <>
                <div className={` ${entries && entries.length > 0 ? '' : 'justify-end'} flex justify-between gap-5 mt-3`}>
                    {!isLoading && entries && entries.length > 0 && (
                        <>
                            <button
                                className="px-5 py-1 flex items-center bg-blue-600 text-white rounded-md cursor-pointer"
                                onClick={() => setAnalyseData(true)}
                            >
                                <Sparkles size={15} color="white" className="mr-1 inline animate-pulse " />
                                Analyse data
                            </button>
                        </>
                    )}

                    <div className="flex justify-between gap-2 ">
                        <button
                            className="px-3 py-1 flex justify-center items-center bg-blue-600 text-white rounded-md cursor-pointer"
                            onClick={() => setOpenOptionsEntry(true)}
                        >
                            <Plus size={15} color="white" className="mr-1 inline" />
                            New Entry
                        </button>

                        <Link
                            className='flex px-3 py-2 items-center rounded-md text-white bg-blue-600'
                            href={`/pages/flywheel?tab=${backParams}`}
                        >
                            <ArrowLeft size={14} className='mr-1 inline' /> <span className="hidden md:inline">Back</span>
                        </Link>
                    </div>
                </div>

                {isLoading && <p className="">Loading...</p>}

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
                                        <th className="px-6 py-3 text-left text-sm font-normal">#</th>
                                        {/** Get unique keys across all entries */}
                                        {headers.map((key) => (
                                            <th key={key} className="px-6 py-2 text-left font-normal">
                                                {toSentenceCase(key)}
                                            </th>
                                        ))}
                                        <th className="px-6 py-3 text-left text-sm font-normal">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                    {entries.map((entry, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-left">{index + 1}</td>
                                            {headers.map((key) => (
                                                <td key={key} className="px-6 py-2 text-left">
                                                    {renderValue(entry.data?.[key] ?? '')}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 text-left">
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
                    </div>
                )}

            </>


            <AnalyseData
                analyseData={analyseData}
                uniqueId={pipelineId}
                onClose={() => setAnalyseData(false)}
            />

            <NewDataEntry
                openNewDataEntry={openNewDataEntry}
                onClose={handleCloseNewDataEntry}
                uniqueId={uniqueDataPoint}
                refetchEntries={refetch}
            />



            {openOptionsEntry && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-10" />
                    <div className="w-3/4 md:w-2/4 text-center bg-white px-5 py-5 rounded-lg z-50 fixed top-[300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setOpenOptionsEntry(false)}>
                                <X size={20} className="text-red-500 cursor-pointer" />
                            </button>
                        </div>

                        <div className="md:flex justify-between gap-5 mt-5">
                            <div className="md:w-1/2 bg-blue-50 text-blue-600 rounded-md p-5 hover:border hover:border-blue-300 h-28">
                                <Plus
                                    size={25}
                                    color="white"
                                    className="mr-1 inline bg-blue-600 rounded-full p-1"
                                />
                                <button
                                    className="mt-3 py-1 px-2 w-full flex items-center justify-center cursor-pointer text-white rounded-md bg-blue-600"
                                    onClick={() => handleNewDataEntry(fieldId)}
                                >
                                    New Data Entry
                                </button>
                            </div>

                            <div className="mt-5 md:mt-0 md:w-1/2 bg-blue-50 text-blue-600 rounded-md p-5 hover:border hover:border-blue-300 h-28">
                                <FileStackIcon
                                    size={25}
                                    color="white"
                                    className="mr-1 inline bg-blue-600 rounded-full p-1"
                                />
                                <Link
                                    className="mt-3 py-1 px-2 flex justify-center items-center cursor-pointer text-white rounded-md bg-blue-600"
                                    href={`/pages/flywheel/data-entry/new/bulk/${pipelineId}/${fieldId}`}
                                >
                                    Bulk Data Entry
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div >
    );
};

export default ViewDataEntries;
