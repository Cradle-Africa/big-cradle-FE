"use client";

import axios from "@/app/lib/axios";
import { useAnalyseData, useFetchDataPointOfDataEntries, useFetchSingleDataPoint, useFetchSinglePipeline } from "../_features/hook";
import { formatDate } from "@/app/utils/formatDate";
import { toSentenceCase } from "@/app/utils/caseFormat";
import { ArrowLeft, FileStackIcon, Plus, Share2, Sparkles, X } from "lucide-react";
import AnalyseData from "../_components/AnalyseData";
import { useEffect, useState } from "react";
import Pagination from "../_components/Pagination";
import NewDataEntry from "./new/NewDataEntry";
import { useRouter, useSearchParams } from "next/navigation";
import { ExportToExcel } from "../_components/ExportToExcel";
import Link from "next/link";
import ShareDataPoint from "../datapoint/ShareDataPoint";
import { Spinner } from "@radix-ui/themes";
import { getBusinessId } from "@/app/utils/user/userData";
import toast from "react-hot-toast";

interface ViewDataEntriesProps {
    viewDataEntries: boolean;
    pipelineId: string;
    setViewDataEntries: (value: boolean) => void;
}

const ViewDataEntries: React.FC<ViewDataEntriesProps> = ({
    viewDataEntries,
    pipelineId,
}) => {

    const [openNewDataEntry, setOpenNewDataEntry] = useState(false);
    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('');
    const [openOptionsEntry, setOpenOptionsEntry] = useState(false);
    const [shareDataPoint, setShareDataPoint] = useState(false);
    const [, setOpenIndex] = useState<number | null>(null);
    const [structuredData, setStructuredData] = useState<any>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [analyseData, setAnalyseData] = useState(false);
    const backParams: string = 'pipelines';
    const router = useRouter();

    const { data, isLoading, refetch } = useFetchDataPointOfDataEntries({
        axios,
        queryParams: {
            dataPoint: pipelineId,
            page: page,
            limit: limit,
        },
    });

    const { data: singlePipeline, refetch: refreshSinglePipeline } = useFetchSinglePipeline({
        axios,
        id: pipelineId || '',
        enabled: true,
    });
    const dataPointId = singlePipeline?.fieldId
    // console.log('data pipeline: ', singlePipeline );

    const entries = data?.entries
    const pagination = data?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 };

    const { data: datapoints } = useFetchSingleDataPoint({
        axios,
        id: singlePipeline?.fieldId ?? '',
        enabled: !singlePipeline?.fieldId, // only run when fieldId is present
    });

    const mutation = useAnalyseData({ axios });

    const handleNewDataEntry = (dataPointId: string) => {
        setOpenOptionsEntry(false); // close EntryOptionsModal
        setOpenNewDataEntry(true); // open NewDataEntry modal
        setUniqueDataPoint(dataPointId);
    };

    const handleCloseNewDataEntry = () => {
        setOpenNewDataEntry(false);
    };

    const handleShareDataPoint = (id: any) => {
        setShareDataPoint(true)
        setOpenIndex(null);
        setUniqueDataPoint(id)
    }

    const businessUserId = getBusinessId() || "";
    const endpoint = "pipeline-fields-entry-attached-to-data-point";

    const handleAnalyseData = (id: string) => {
        setUniqueDataPoint(id);
        setAnalyseData(true);
        handleSubmit();
    };

    const handleSubmit = () => {
        if (mutation.isPending) return;// prevent duplicate submission
        mutation.mutate(
            {
                endpoint,
                businessUserId,
                dataPoint: pipelineId,
            },
            {
                onSuccess: (res) => {
                    toast.dismiss()
                    toast.success("Data analysis completed successfully");
                    try {
                        console.log('DATA--', JSON.stringify(res));
                        setStructuredData(res);
                    } catch (err) {
                        console.error(err);
                        toast.error("Failed to parse response");
                        setStructuredData(null);
                    }
                },
                onError: (error: any) => {
                    toast.dismiss()
                    toast.error(error?.message || "Data analysis failed");
                },
            }
        );
    };

    const searchParams = useSearchParams();
    useEffect(() => {
        refetch();
        refreshSinglePipeline();
    }, [refetch, refreshSinglePipeline, searchParams])


    useEffect(() => {
        if (mutation.isPending) {
            toast.loading('Analyzing data ...')
        };
    })

    if (!viewDataEntries) return null;

    function renderValue(value: any) {
        // Check if it's a file object
        if (value && typeof value === 'object' && value.url && value.filename) {
            return (
                <a
                    href={value.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    {value.filename}
                </a>
            );
        }
        // If it's an array, join with comma and space
        if (Array.isArray(value)) {
            return value.join(", ");
        }
        // Default: display as string
        return String(value);
    }

    const headers = entries && entries.length > 0 ? Object.keys(entries[0].data) : [];

    if (mutation.isPending) {
        return (
            <div className="flex justify-center mt-[20%]"> <Spinner /></div>
        )
    };
    return (
        <div className="w-full pb-5">
            {/* <h2 className="text-xl mb-4">Data entries</h2> */}
            <>
                <h2 className="text-lg font-semibold text-blue-600">
                    {singlePipeline?.dataPointName}
                </h2>

                <div className={` ${entries && entries.length > 0 ? '' : 'justify-end'} flex justify-between gap-5 mt-3`}>

                    <Link
                        className='flex px-3 py-1 items-center rounded-md text-white bg-blue-600'
                        href={`/pages/flywheel?tab=${backParams}`}
                    >
                        <ArrowLeft size={14} className='mr-1 inline' /> <span className="hidden md:inline">Back</span>
                    </Link>

                    <div className="flex justify-between gap-2 ">

                        {!isLoading && entries && entries.length > 0 && (
                            <div className="">
                                {datapoints && entries.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        <ExportToExcel
                                            data={entries.map(e => e.data)}
                                            datapoints={datapoints}
                                            dataPointName={singlePipeline?.dataPointName || "Export"}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <button
                            onClick={() => handleShareDataPoint(singlePipeline?.fieldId)}
                            className="flex items-center cursor-pointer px-3 py-1 border border-blue-600 text-blue-600 rounded-md"
                        > <Share2 size={13} className="inline mr-1" /> Share
                        </button>

                        {!singlePipeline?.fieldId ? (
                            <Link
                                className="px-3 py-1 flex justify-center items-center bg-blue-600 text-white rounded-md cursor-pointer"
                                href={`/pages/flywheel/datapoint/new/${pipelineId}`}
                            >
                                <Plus size={15} color="white" className="mr-1 inline" />
                                New Data point
                            </Link>
                        ) : (
                            <button
                                className="px-3 py-1 flex justify-center items-center border border-blue-600 text-blue-600 rounded-md cursor-pointer"
                                onClick={() => setOpenOptionsEntry(true)}
                            >
                                <Plus size={15} className="mr-1 inline" />
                                New Entry
                            </button>
                        )}

                        {!isLoading && entries && entries.length > 0 && (
                            <>
                                <button
                                    className="px-5 py-1 flex items-center bg-blue-600 text-white rounded-md cursor-pointer"
                                    onClick={() => handleAnalyseData(singlePipeline?.fieldId ?? '')}
                                >
                                    <Sparkles size={15} color="white" className="mr-1 inline animate-pulse " />
                                    Analyse data
                                </button>

                            </>
                        )}

                    </div>
                </div>

                {isLoading && <p className=""><Spinner /></p>}

                {!isLoading && entries && entries.length > 0 && (
                    <>
                        <div className="overflow-x-auto h-full rounded-[8px] border border-gray-200 mt-5">

                            <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {/** Get unique keys across all entries */}
                                        <th className="px-6 py-3 text-left font-normal">Created at</th>
                                        {headers.map((key) => (
                                            <th key={key} className="px-6 py-2 text-left font-normal whitespace-nowrap">
                                                {toSentenceCase(key)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                    {entries.map((entry, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-left">
                                                {formatDate(entry.createdAt ?? '')}
                                            </td>
                                            {headers.map((key) => (
                                                <td key={key} className="px-6 py-2 text-left">
                                                    {renderValue(entry.data?.[key] ?? '')}
                                                </td>
                                            ))}
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
                onClose={() => setAnalyseData(false)}
                structuredData={structuredData}
                mutation={mutation}
            />

            <NewDataEntry
                openNewDataEntry={openNewDataEntry}
                onClose={handleCloseNewDataEntry}
                uniqueId={uniqueDataPoint}
                refetchEntries={refetch}
            />

            <ShareDataPoint
                shareDataPoint={shareDataPoint}
                onClose={() => setShareDataPoint(false)}
                uniqueId={uniqueDataPoint}
                dataPointName={singlePipeline?.dataPointName ?? ''}
            />


            {
                openOptionsEntry && (
                    <>
                        <div className="fixed inset-0 bg-black/40 z-10" />
                        <div className="w-3/4 md:w-2/4 text-center bg-white p-7 rounded-lg z-50 fixed top-[300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setOpenOptionsEntry(false)}>
                                    <X size={25} className="text-red-500 cursor-pointer" />
                                </button>
                            </div>

                            <div className="md:flex justify-between gap-5 mt-10">
                                <div
                                    onClick={() => handleNewDataEntry(dataPointId ?? '')}
                                    className="md:w-1/2 bg-blue-50 text-blue-600 border-dashed border-2 border-blue-600 rounded-md p-7 hover:border-3 hover:border-blue-300 h-48 cursor-pointer">
                                    <div className="bg-white rounded-full p-2 inline-flex items-center justify-center">
                                        <Plus
                                            size={25}
                                            className="inline text-blue-600 rounded-full"
                                        />
                                    </div>

                                    <button
                                        className="mt-3 py-3 px-2 w-full flex items-center justify-center cursor-pointer font-bold rounded-md text-blue-600"
                                    >
                                        New Data Entry
                                    </button>
                                    <p>
                                        Add a new data entry to this pipeline.
                                    </p>
                                </div>

                                <div
                                    onClick={() =>
                                        router.push(`/pages/flywheel/data-entry/new/bulk/${pipelineId}/${singlePipeline?.fieldId}`)
                                    }
                                    className="mt-5 md:mt-0 md:w-1/2 bg-orange-50 text-orange-600 border-dashed border-2 border-orange-600 rounded-md p-7  hover:border-3 hover:border-orange-300 h-48 cursor-pointer">
                                    <div className="bg-white rounded-full p-2 inline-flex items-center justify-center">
                                        <FileStackIcon
                                            size={25}
                                            className="inline text-orange-600 rounded-full"
                                        />
                                    </div>
                                    <Link
                                        className="mt-3 py-3 px-2 flex justify-center items-center cursor-pointer font-bold rounded-md text-orange-600"
                                        href={`/pages/flywheel/data-entry/new/bulk/${pipelineId}/${singlePipeline?.fieldId}`}
                                    >
                                        Bulk Data Entry
                                    </Link>
                                    <p>
                                        Add multiple data entries to this pipeline at once.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

        </div >
    );
};

export default ViewDataEntries;
