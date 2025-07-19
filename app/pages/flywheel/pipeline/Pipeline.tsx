import axios from "@/app/lib/axios";
import { PaginationMeta, Pipeline } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { ArrowRight, Calendar, MoreVertical, Pencil, Share2, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFetchDepartments } from "../../user/department/_features/hook";
import Pagination from "../_components/Pagination";
import ShareDataPoint from "../datapoint/ShareDataPoint";
import EditPipeline from "./edit/EditPipeline";
import radialIcon from '@/public/radial.png'
import Image from "next/image";
import DeletePipeline from "./DeletePipeline";
import { useRouter } from 'next/navigation'; // for App Router
import DeleteDataPoint from "../datapoint/DeleteDataPoint";
import SearchInput from "../../../components/filter/SearchInput";
import DateInput from "../../../components/filter/DateInput";
import DepartmentFilter from "../../../components/filter/DepartmentFilter";
import { Spinner } from "@radix-ui/themes";

type DataPipelineProps = {
    pipelineData: Pipeline[];
    pagination: PaginationMeta;
    onPageChange: (newPage: number) => void;
    onLimitChange: (newLimit: number) => void;
    selectedDepartment: string;
    setSelectedDepartment: (val: string) => void;
    selectedStartDate: string;
    selectedEndDate: string;
    setSelectedStartDate: (val: string) => void;
    setSelectedEndDate: (val: string) => void;
    search: string;
    setSearch: (val: string) => void;
    loading: boolean;
};


const PipelinePage = ({
    pipelineData,
    selectedDepartment,
    setSelectedDepartment,
    selectedStartDate,
    selectedEndDate,
    setSelectedStartDate,
    setSelectedEndDate,
    search,
    setSearch,
    pagination,
    onPageChange,
    onLimitChange,
    loading
}: DataPipelineProps) => {
    const [shareDataPipeline, setShareDataPipelie] = useState(false);
    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('')
    const menuRefs = useRef<Record<number, HTMLUListElement | null>>({});
    const router = useRouter();

    const [tempStartDate, setTempStartDate] = useState(selectedStartDate);
    const [tempEndDate, setTempEndDate] = useState(selectedEndDate);
    const [tempDepartment, setTempDepartment] = useState(selectedDepartment);
    const [tempSearch, setTempSearch] = useState(search);

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
            <div className="flex  justify-between w-full  gap-3 flex-wrap">
                <div className="flex justify-start gap-3 flex-wrap">
                    <SearchInput
                        value={tempSearch}
                        onChange={setTempSearch}
                        onSubmit={() => {
                            setSearch(tempSearch);
                            onPageChange(1);
                            onLimitChange(limit);
                        }}
                    />

                </div>
                <div className="flex justify-end gap-2 flex-wrap">

                    <DateInput
                        value={tempStartDate}
                        onChange={(val) => setTempStartDate(val)}
                        label="Start Date"
                        style="w-34 px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                    />

                    <DateInput
                        value={tempEndDate}
                        onChange={(val) => setTempEndDate(val)}
                        label="End Date"
                        style="w-34 px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                    />

                    <DepartmentFilter
                        value={tempDepartment}
                        onChange={(val) => setTempDepartment(val)}
                        options={departmentData}
                    />

                    <button
                        className="px-4 py-1 mt-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer"
                        onClick={() => {
                            setSelectedStartDate(tempStartDate);
                            setSelectedEndDate(tempEndDate);
                            setSelectedDepartment(tempDepartment);
                            setSearch(tempSearch);
                            onPageChange(1); // reset page when filtering
                            onLimitChange(limit); // ensure correct limit
                        }}
                    >
                        Filter
                    </button>

                </div>
            </div>

            {loading ? (
                <div className="mt-5"><Spinner /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid md:grid-cols-2  2xl:grid 2xl:grid-cols-3 w-full gap-5 mt-5">
                    {pipelineData.map((pipeline, index) => {

                        return (
                            <div
                                key={index}
                                onClick={() =>
                                    router.push(`/pages/flywheel/data-entry/${pipeline?.id}`)
                                }
                                className="flex flex-col group border-1 bg-white border-gray-200 rounded-lg px-6 py-6 cursor-pointer
                                 hover:border-1 hover:border-blue-200 transition-all ease-in-out transform-fill hover:transform-fill "
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
                                        <h2 className="inline ml-2 text-[18px] text-[#0C0C0C] ">
                                            {pipeline.dataPointName}
                                        </h2>
                                    </div>

                                    <div
                                        className="whitespace-nowrap relative"
                                        onClick={(e) => e.stopPropagation()} // Prevent outer div from firing
                                    >
                                        <button
                                            className="bg-inherit flex justify-center items-center rounded-lg py-1 cursor-pointer hover:text-white hover:rounded-full w-8 h-8 hover:bg-blue-600"
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

                                <div className="flex text-[#494949] text-[14px] mt-5 ">
                                    {pipeline.dataPointDescription?.length > 200
                                        ? pipeline.dataPointDescription.slice(0, 150) + "..."
                                        : pipeline.dataPointDescription}
                                </div>


                                <div className="flex justify-start mt-5 items-center mb-5">
                                    <Calendar size={12} />
                                    <h6 className="ml-1 text-[#494949] text-[12px] ">
                                        {formatDate(pipeline?.createdAt ?? '')}
                                    </h6>
                                </div>

                                <div
                                    className="flex w-full justify-center border-t border-gray-100 mt-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex w-full items-center justify-center gap-2 mt-5">
                                        {!!pipeline?.fieldId && (
                                            <div className="flex w-full justify-center gap-2">
                                                <div className="w-2/3">
                                                    <Link
                                                        href={`/pages/flywheel/data-entry/${pipeline?.id}`}
                                                        className="flex justify-center items-center text-sm cursor-pointer rounded-md px-3 py-2 bg-[#F0F8FF] text-[#0D89FF] hover:bg-blue-100  border border-[#0D89FF]"
                                                    >
                                                        View Entries
                                                        <ArrowRight size={15} className="ml-1 inline" />
                                                    </Link>
                                                </div>
                                                <div className="w-1/3 flex">
                                                    <div
                                                        onClick={() => handleShareDataPipeline(pipeline?.fieldId ?? '')}
                                                        className="px-1"
                                                    >
                                                        <div
                                                            className="flex justify-center cursor-pointer items-center text-center w-10 h-10 rounded-full bg-gray-100 text-black hover:bg-blue-600 hover:text-white"
                                                        >
                                                            <Share2 size={15} />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDeleteDataPoint(pipeline?.fieldId, pipeline?.dataPointName)}
                                                        className="px-1"
                                                    >
                                                        <div className="flex justify-center cursor-pointer items-center text-center w-10 h-10 rounded-full bg-gray-100 text-black hover:bg-blue-600 hover:text-white">
                                                            <Trash2 size={15} className="" />
                                                        </div>
                                                    </button>

                                                    <Link
                                                        href={`/pages/flywheel/datapoint/edit/${pipeline?.fieldId}`}
                                                        className="px-1"
                                                    >
                                                        <div className="flex justify-center cursor-pointer items-center text-center w-10 h-10 rounded-full bg-gray-100 text-black hover:bg-blue-600 hover:text-white">
                                                            <Pencil size={15} className="" />
                                                        </div>
                                                    </Link>
                                                </div>

                                            </div>
                                        )}

                                        {!pipeline?.fieldId && (
                                            <Link
                                                href={`/pages/flywheel/datapoint/new/${pipeline?.id}`}
                                                className="flex w-full justify-center items-center text-center text-sm cursor-pointer rounded-md px-3 py-2 bg-[#FEF0FF] hover:bg-[#e9c9ed] text-[#FF0AFF] border border-[#FF0AFF]"
                                            >
                                                Create a data point
                                                <ArrowRight size={15} className="ml-1 inline" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {pagination && pipelineData.length > 0 ? (
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
            ): (
                <>No pipeline found</>
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

