"use client";

import axios from "@/app/lib/axios";
import { formatDate } from "@/app/utils/formatDate";
import { ArrowLeft, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "../_components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import AnalyseSurvey from "../_components/AnalyseSurvey";
import { useAnalyseSurveyData, useFetchSingleSurvey, useFetchSurveysDataEntries } from "../_features/hooks";
import { Spinner } from "@radix-ui/themes";
import { getBusinessId } from "@/app/utils/user/userData";
import FilterBar from "../_components/filter/FilterBar";
import toast from "react-hot-toast";
import ShareSurvey from "../_components/ShareSurvey";

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
    const [shareSurvey, setShareSurvey] = useState(false);
    const router = useRouter();
    const businessUserId = getBusinessId();
    const [structuredData, setStructuredData] = useState<any>(null);
    const [, setOpenIndex] = useState<number | null>(null);

    //fetch survey's entries
    const { data, isLoading: isLoadingDataEntries, refetch } = useFetchSurveysDataEntries({
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

    // analyse survey data
    const mutation = useAnalyseSurveyData({ axios });

    const searchParams = useSearchParams();
    useEffect(() => {
        refetch();
    }, [refetch, searchParams])

    useEffect(() => {
        if (mutation.isPending) {
            toast.loading('Analyzing data ...')
        };
    })
    if (!viewDataEntries) return null;

    // Build headers using keys/labels
    const keysMap: Record<string, string> = {};
    entries?.forEach((entry: any) => {
        entry.answers.forEach((a: any) => {
            keysMap[a.key] = a.label;
        });
    });

    const keys = Object.keys(keysMap);

    // Render logic for each answer (including file preview)
    const renderAnswer = (answers: any[], key: string) => {
        const answerObj = answers.find((a) => a.key === key);
        const value = answerObj?.answer;

        if (!value) return 'N/A';

        // If value is an object (file upload), display file link
        if (typeof value === 'object' && value.url) {
            return (
                <a
                    href={value.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    {value.filename ?? 'View File'}
                </a>
            );
        }

        // Otherwise, return as plain string
        return String(value);
    };


    const handleAnalyseData = () => {
        setAnalyseData(true);
        handleSubmit();
    };
    // SUbmit analyse data
    const handleSubmit = () => {
        if (mutation.isPending) return;// prevent duplicate submission
        mutation.mutate(
            { surveyId: surveyId },
            {
                onSuccess: (res) => {
                    toast.dismiss()
                    toast.success("Data analysis completed successfully");
                    try {
                        const data = res?.insights ?? res?.data?.insights;
                        setStructuredData(data);
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

    const handleShareSurvey = () => {
        setShareSurvey(true)
        setOpenIndex(null);
    }

    if (mutation.isPending) {
        return(
        <div className="flex justify-center mt-[20%]"> <Spinner/></div>    
        )
    };

    return (
        <div className="w-full pb-5">
            {/* <h2 className="text-xl mb-4">Data entries</h2> */}
            <>
                <div className="flex justify-between gap-2 ">
                    <h2 className="text-lg font-semibold text-blue-600">
                        {singleSurvey?.data?.surveyName}
                    </h2>
                    <>
                        <div className="flex justify-end gap-2 ">
                            <button
                                onClick={() => handleShareSurvey()}
                                className="flex items-center cursor-pointer px-3 py-1 border border-blue-600 text-blue-600 rounded-md"
                            > <Share2 size={13} className="inline mr-1" /> Share
                            </button>
                            {!isLoadingDataEntries && !isLodingSingleSurvey && entries && entries.length > 0 && (
                                <button
                                    className="px-5 h-[36px] flex items-center bg-blue-600 text-white rounded-md cursor-pointer"
                                    onClick={() => handleAnalyseData()}
                                >
                                    <Sparkles size={15} color="white" className="mr-1 inline animate-pulse " />
                                    Analyse data
                                </button>
                            )}
                        </div>
                    </>
                </div>

                {isLoadingDataEntries || isLodingSingleSurvey && <p className=""><Spinner /></p>}

                <div className={` ${entries && entries.length > 0 ? '' : 'justify-start'} flex justify-between items-center gap-3`}>

                    <button
                        onClick={() => router.back()}
                        className='flex px-3 h-[36px] items-center rounded-md text-white bg-blue-600 cursor-pointer'

                    >
                        <ArrowLeft size={14} className='mr-1 inline' /> <span className="hidden md:inline">Back</span>
                    </button>
                    <FilterBar
                        tempStartDate={tempStartDate}
                        setTempStartDate={setTempStartDate}
                        tempEndDate={tempEndDate}
                        setTempEndDate={setTempEndDate}
                        onFilter={() => {
                            setSelectedStartDate(tempStartDate);
                            setSelectedEndDate(tempEndDate);
                            setPage(1)
                        }}
                    />
                </div>

                {!isLoadingDataEntries && entries && entries.length > 0 && (
                    <>
                        <div className="overflow-x-auto  rounded-[8px] border border-gray-200 mt-5">

                            <div className="w-full overflow-x-auto">
                                <table className="min-w-[900px] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-normal w-[160px]">Created at</th>
                                            {keys.map((key) => (
                                                <th
                                                    key={key}
                                                    className="px-6 py-2 text-left font-normal max-w-[300px] break-words whitespace-normal"
                                                >
                                                    {keysMap[key]}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                        {entries.map((entry: any, index: number) => (
                                            <tr key={index} className="hover:bg-gray-50 align-top">
                                                <td className="px-6 py-4 text-left">
                                                    {formatDate(entry.createdAt ?? '')}
                                                </td>
                                                {keys.map((key) => (
                                                    <td
                                                        key={key}
                                                        className="px-6 py-2 text-left max-w-[300px] break-words whitespace-normal"
                                                    >
                                                        {renderAnswer(entry.answers, key)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


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
                {!isLoadingDataEntries && entries && entries.length === 0 && (
                    <div className="flex justify-between mt-5">
                        <p>
                            No entries found
                        </p>
                    </div>
                )}
            </>


            <AnalyseSurvey
                analyseData={analyseData}
                onClose={() => setAnalyseData(false)}
                structuredData={structuredData}
                mutation={mutation}
            />

            <ShareSurvey
                shareSurvey={shareSurvey}
                onClose={() => setShareSurvey(false)}
                uniqueId={surveyId}
            />


        </div >
    );
};

export default ViewDataEntries;
