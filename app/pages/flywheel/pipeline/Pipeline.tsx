import axios from "@/app/lib/axios";
import { PaginationMeta, Pipeline } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { Calendar, Eye, Funnel, LetterText, MoreVertical, Pencil, Plus, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFetchDepartments } from "../../user/department/_features/hook";
import Pagination from "../_components/Pagination";
import ShareDataPoint from "../datapoint/ShareDataPoint";
import EditPipeline from "./EditPipeline";

type DataPipelineProps = {
    pipelineData: Pipeline[];
    pagination: PaginationMeta;
    onPageChange: (newPage: number) => void;
    onLimitChange: (newLimit: number) => void;
    selectedDepartment: string;
    setSelectedDepartment: (val: string) => void;
    loading: boolean;
};


const PipelinePage = ({
    pipelineData,
    // departmentData,
    selectedDepartment,
    setSelectedDepartment,
    pagination,
    onPageChange,
    onLimitChange,
    loading
}: DataPipelineProps) => {
    const [shareDataPipeline, setShareDataPipelie] = useState(false);
    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('')
    const menuRefs = useRef<Record<number, HTMLUListElement | null>>({});

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
    const [uniqueId, setUniqueId] = useState<string>('');


    const handleShareDataPipeline = (dataPointId: string) => {
        setShareDataPipelie(true)
        setUniqueDataPoint(dataPointId)
    }
    const [, setPage] = useState(pagination.page);
    const [limit, setLimit] = useState(pagination.limit);

    const user = getUser()
    let businessUserId = '';
    if (user?.role === 'business') {
        businessUserId = getBusinessId() ?? '';
    } else if (user?.role === 'employee') {
        businessUserId = user?.businessUserId
    }

    //call department list api
    const { data: departments } = useFetchDepartments({
        axios,
        queryParams: {
            businessUserId: businessUserId || undefined,
        },
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (openIndex !== null) {
                const ref = menuRefs.current[openIndex];
                if (ref && !ref.contains(e.target as Node)) {
                    setOpenIndex(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openIndex]);



    const departmentData = departments?.data ?? [];
    return (
        <div>
            <div className="relative lg:w-1/4">
                <select
                    className="mt-5 pl-6 w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
                    value={selectedDepartment}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedDepartment(val); // Updates parent state
                        onPageChange(1);            // Reset pagination in parent
                        onLimitChange(limit);       // Reapply limit in parent
                    }}
                >
                    <option value="">Filter by department </option>
                    {departmentData.map((department, index) => (
                        <option key={index} value={department?.id}>
                            {department?.departmentName}
                        </option>
                    ))}
                </select>
                <Funnel size={14} className="absolute top-1/2 mt-[2px] ml-2" />
            </div>

            {loading ? (
                <div className="mt-5">Loading pipelines...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid md:grid-cols-2  2xl:grid 2xl:grid-cols-3 w-full gap-5 mt-5">
                    {
                        pipelineData.map((pipeline, index) =>
                            <div key={index} className="border bg-white border-gray-200 rounded-lg px-6 py-6 hover:border hover:border-blue-300">
                                <div className="flex flex-nowrap items-center justify-between">
                                    <div className="flex flex-nowrap items-center">
                                        <LetterText size={16} className="text-[#0C0C0C]" />
                                        <h2 className="ml-2 text-[18px] text-[#0C0C0C]">
                                            {pipeline.dataPointName}
                                        </h2>
                                    </div>

                                    <div className="px-6 py-4 border-r border-gray-100 whitespace-nowrap relative">
                                        <button
                                            className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-600 hover:text-white"
                                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        {openIndex === index && (
                                            <ul
                                                ref={(el) => {
                                                    menuRefs.current[index] = el;
                                                }}

                                                onClick={(e) => e.stopPropagation()}
                                                onMouseLeave={() => setOpenIndex(null)}
                                                className="absolute z-60 right-10 py-1 mt-2 w-auto bg-white rounded-md shadow-md border border-gray-100"
                                            >
                                                <li className="px-2 py-2">
                                                    <button
                                                        onClick={() => {
                                                            setUniqueId(pipeline?.id ?? '')
                                                            setSelectedPipeline(pipeline);
                                                            setEditOpen(true);
                                                        }}
                                                        className="flex w-full px-4 py-2 text-left text-sm rounded-md text-blue-700 hover:bg-blue-200 hover:cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <Pencil size={13} />
                                                            Edit
                                                        </div>
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[#494949] text-[14px] mt-5">
                                    {pipeline.dataPointDescription}
                                </p>
                                <div className="flex w-full justify-between mt-10 pb-3">
                                    <div className="flex items-center ">
                                        <Calendar size={12} />
                                        <h6 className="ml-1 text-[#494949] text-[12px]">{formatDate(pipeline?.createdAt ?? '')}</h6>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <div className={` ${!pipeline?.fieldId ? 'hidden' : 'inline'} hover:bg-blue-600 hover:text-white bg-gray-100 rounded-md px-2 py-1 cursor-pointer`}>
                                            <Share2
                                                size={14}
                                                onClick={() => handleShareDataPipeline(pipeline?.fieldId ?? '')}
                                                className=""
                                            />
                                        </div>
                                        <Link
                                            href={`/pages/flywheel/data-entry/${pipeline?.id}/${pipeline?.fieldId}`}
                                            className={` ${!pipeline?.fieldId ? 'hidden' : 'inline'} flex items-center text-center text-sm cursor-pointer bg-gray-100 rounded-md px-3 py-1 hover:bg-blue-600 hover:text-white`}
                                        >
                                            <Eye size={15} className="mr-1 inline" /> View Entries
                                        </Link>

                                        <Link
                                            href={`/pages/flywheel/datapoint/new/${pipeline?.id}`}
                                            className={` ${pipeline?.fieldId ? 'hidden' : 'inline'} flex items-center text-center text-sm cursor-pointer bg-gray-100 rounded-md px-3 py-1 hover:bg-blue-600 hover:text-white`}
                                        >
                                            <Plus size={15} className="mr-1 inline" /> Create a data point
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}

            {pagination && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    limit={pagination.limit}
                    onPageChange={(newPage) => {
                        setPage(newPage);
                        onPageChange(newPage);
                    }}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                        onLimitChange(newLimit);
                    }}
                />
            )}

            <ShareDataPoint
                shareDataPoint={shareDataPipeline}
                onClose={() => setShareDataPipelie(false)}
                uniqueId={uniqueDataPoint}
            />

            {
                editOpen && selectedPipeline && (
                    <EditPipeline uniqueId={uniqueId} pipeline={selectedPipeline} setOpen={setEditOpen} />
                )
            }
        </div>


    );
};

export default PipelinePage;

