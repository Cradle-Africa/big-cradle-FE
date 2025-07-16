import axios from "@/app/lib/axios";
import { PaginationMeta, Pipeline } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { Calendar, Funnel, MoreVertical, Pencil, Plus, Share2, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFetchDepartments } from "../../user/department/_features/hook";
import Pagination from "../_components/Pagination";
import ShareDataPoint from "../datapoint/ShareDataPoint";
import EditPipeline from "./edit/EditPipeline";
import radialIcon from '@/public/radial.png'
// import 	{ RiLoader3Line } from 'react-icons/ri'
import Image from "next/image";
import DeletePipeline from "./DeletePipeline";
import { useRouter } from 'next/navigation'; // for App Router
import DeleteDataPoint from "../datapoint/DeleteDataPoint";

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
    const router = useRouter();

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
    const [uniqueId, setUniqueId] = useState<string>('');
    const [deletingDataPoint, setDeletingDataPoint] = useState(false);
    const [dataPointName, setDataPointName] = useState<string>('');


    const handleShareDataPipeline = (dataPointId: string) => {
        setShareDataPipelie(true)
        setUniqueDataPoint(dataPointId)
    }

    const handleDeleteDataPoint = async (id: any, dataPointName: any) => {
        setDeletingDataPoint(true);
        setOpenIndex(null);
        setUniqueDataPoint(id);
        setDataPointName(dataPointName);
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
                    {pipelineData.map((pipeline, index) => {

                        return (
                            <div
                                key={index}
                                onClick={() =>
                                    router.push(`/pages/flywheel/data-entry/${pipeline?.id}`)
                                }
                                // className="group border bg-white border-gray-200 rounded-lg px-6 py-6 hover:bg-blue-600 hover:text-white transition-all ease-in-out duration-900 cursor-pointer"
                                className="flex flex-col group border bg-white border-gray-200 rounded-lg px-6 py-6 hover:bg-blue-600 hover:text-white transition-all ease-in-out duration-900 cursor-pointer"

                            >
                                <div className="flex flex-nowrap items-center justify-between">
                                    <div className="inline-block items-center">
                                        <Image
                                            src={radialIcon}
                                            width={15}
                                            height={8}
                                            alt={'Big cradle logo'}
                                            className="inline text-inherit"
                                        />
                                        <h2 className="inline ml-2 text-[18px] text-[#0C0C0C] group-hover:text-white">
                                            {pipeline.dataPointName}
                                        </h2>
                                    </div>

                                    <div
                                        className="whitespace-nowrap relative"
                                        onClick={(e) => e.stopPropagation()} // ⛔ Prevent outer div from firing
                                    >
                                        <button
                                            className="bg-inherit rounded-lg px-2 py-1 cursor-pointer hover:text-blue-600 hover:bg-white"
                                            onClick={() =>
                                                setOpenIndex(openIndex === index ? null : index)
                                            }
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
                                                className="absolute z-60 right-10 py-1 w-auto bg-white rounded-md shadow-md border border-gray-100"
                                            >
                                                <li className="px-2 py-1">
                                                    <button
                                                        onClick={() => {
                                                            setUniqueId(pipeline?.id ?? '');
                                                            setSelectedPipeline(pipeline);
                                                            setEditOpen(true);
                                                        }}
                                                        className="flex w-full px-4 py-2 text-left text-sm rounded-md text-blue-700 hover:bg-blue-200 hover:cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <Pencil size={13} />
                                                            Edit Pipeline
                                                        </div>
                                                    </button>
                                                </li>
                                                <li className="px-2">
                                                    <button
                                                        onClick={() => {
                                                            setUniqueId(pipeline?.id ?? '');
                                                            setSelectedPipeline(pipeline);
                                                            setDeleteOpen(true);
                                                        }}
                                                        className="flex w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-200 hover:cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <Trash size={13} />
                                                            Delete Pipeline
                                                        </div>
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="flex text-[#494949] text-[14px] mt-5 group-hover:text-white">
                                    {pipeline.dataPointDescription?.length > 200
                                        ? pipeline.dataPointDescription.slice(0, 150) + "..."
                                        : pipeline.dataPointDescription}
                                </div>


                                <div className="flex justify-end mt-5 items-center mb-2">
                                    <Calendar size={12} />
                                    <h6 className="ml-1 text-[#494949] text-[12px] group-hover:text-white">
                                        {formatDate(pipeline?.createdAt ?? '')}
                                    </h6>
                                </div>

                                <div
                                    className="flex w-full justify-end border-t border-gray-100 mt-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-end gap-2 mt-3">
                                        {!!pipeline?.fieldId && (
                                            <>
                                                <div
                                                    className="flex bg-white text-blue-600 hover:text-blue-600 hover:bg-white rounded-md px-2 py-[10px] cursor-pointer"
                                                    onClick={() => handleShareDataPipeline(pipeline?.fieldId ?? '')}
                                                >
                                                    <Share2 size={15} />
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteDataPoint(pipeline?.fieldId, pipeline?.dataPointName)}
                                                    className="flex bg-white text-blue-600 hover:text-red-500 hover:bg-red-100 rounded-md px-2 py-[10px] cursor-pointer"
                                                >
                                                    <Trash2 size={15} className="inline" />
                                                </button>

                                                <Link
                                                    href={`/pages/flywheel/datapoint/edit/${pipeline?.fieldId}/${pipeline.dataPointName}`}
                                                    className="flex items-center text-center text-sm cursor-pointer rounded-md px-3 py-2 bg-white text-blue-600 hover:bg-white hover:text-blue-600"
                                                >
                                                    <Pencil size={15} className="mr-1 inline" /> Edit data point
                                                </Link>
                                            </>
                                        )}

                                        {!pipeline?.fieldId && (
                                            <Link
                                                href={`/pages/flywheel/datapoint/new/${pipeline?.id}`}
                                                className="flex items-center text-center text-sm cursor-pointer rounded-md px-3 py-2 bg-white text-blue-600 hover:bg-white hover:text-blue-600"
                                            >
                                                <Plus size={15} className="mr-1 inline" /> Create a data point
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

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

            {
                deleteOpen && selectedPipeline && (
                    <DeletePipeline uniqueId={uniqueId} pipeline={selectedPipeline} setOpen={setDeleteOpen} />
                )
            }

            {
                deletingDataPoint && (
                    <DeleteDataPoint
                        deletingDataPoint={deletingDataPoint}
                        uniqueId={uniqueDataPoint}
                        setDeletingDataPoint={setDeletingDataPoint}
                        dataPointName={dataPointName}
                    />
                )
            }

        </div>


    );
};

export default PipelinePage;

