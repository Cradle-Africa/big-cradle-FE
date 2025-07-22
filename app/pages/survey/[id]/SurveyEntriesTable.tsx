"use client";

import axios from "@/app/lib/axios";
import { formatDate } from "@/app/utils/formatDate";
import { toSentenceCase } from "@/app/utils/caseFormat";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../_components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import AnalyseSurvey from "../_components/AnalyseSurvey";
import { useFetchSingleSurvey, useFetchSurveysDataEntries } from "../_features/hooks";
import { Spinner } from "@radix-ui/themes";
import { getBusinessId } from "@/app/utils/user/userData";
import FilterBar from "../_components/filter/FilterBar";

interface ViewDataEntriesProps {
    viewDataEntries: boolean;
    surveyId: string;
    setViewDataEntries: (value: boolean) => void;
}

const ViewDataEntries: React.FC<ViewDataEntriesProps> = ({
    viewDataEntries,
    surveyId,
}) => {

    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');

    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [analyseData, setAnalyseData] = useState(false);
    const router = useRouter();
    const businessUserId = getBusinessId();

    const { data, isLoading, refetch } = useFetchSurveysDataEntries({
        axios,
        queryParams: {
            businessUserId: businessUserId ?? '',
            page: page,
            surveyId: surveyId,
            limit: limit,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
        },
    });

    const entries = data?.data
    const pagination = data?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 };

    //fetch signle survey
    const { data: singleSurvey, isLoading: isLodingSingleSurvey } = useFetchSingleSurvey({
        axios,
        surveyId: surveyId,
    });

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
            {/* <h2 className="text-xl mb-4">Data entries</h2> */}
            <>
                <h2 className="text-lg font-semibold text-blue-600">
                    {singleSurvey?.data?.surveyName}
                </h2>

                <div className={` ${entries && entries.length > 0 ? '' : 'justify-end'} flex justify-between gap-5 mt-3`}>
                    {!isLoading && !isLodingSingleSurvey && entries && entries.length > 0 && (
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
                            onClick={() => router.back()}
                            className='flex px-3 py-1 items-center rounded-md text-white bg-blue-600'

                        >
                            <ArrowLeft size={14} className='mr-1 inline' /> <span className="hidden md:inline">Back</span>
                        </button>

                    </div>
                </div>

                {isLoading || isLodingSingleSurvey && <p className=""><Spinner /></p>}

                {!isLoading && entries && entries.length > 0 && (
                    <>
                        <FilterBar
                            tempStartDate={selectedStartDate}
                            setTempStartDate={setTempStartDate}
                            tempEndDate={tempEndDate}
                            setTempEndDate={setTempEndDate}
                            onFilter={() => {
                                setSelectedStartDate(tempStartDate);
                                setSelectedEndDate(tempEndDate);
                                setPage(1)
                            }}
                        />
                        <div className="overflow-x-auto h-125 2xl:h-160 rounded-[8px] border border-gray-200 mt-5">

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
                            No entries found
                        </p>
                    </div>
                )}
            </>


            <AnalyseSurvey
                analyseData={analyseData}
                uniqueId={surveyId}
                onClose={() => setAnalyseData(false)}
            />

        </div >
    );
};

export default ViewDataEntries;
