import axios from "@/app/lib/axios";
import { PaginationMeta, Pipeline } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { getBusinessId, getUser } from "@/app/utils/user/userData";
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
import { Spinner } from "@radix-ui/themes";
import DataPointActions from "../_components/DataPointActions";
import PipelineActions from "../_components/PipelineActions";
import { Calendar } from "lucide-react";
import FilterBar from "../_components/filter/FilterBar";
import DataPipelineStatus from "../status/DataPointStatus";

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
    const [activateOpen, setActivateOpen] = useState(false);
    const [suspendOpen, setSuspendOpen] = useState(false);

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
            {/* Filter the pipelines */}
            <FilterBar
                tempSearch={tempSearch}
                setTempSearch={setTempSearch}
                tempStartDate={tempStartDate}
                setTempStartDate={setTempStartDate}
                tempEndDate={tempEndDate}
                setTempEndDate={setTempEndDate}
                tempDepartment={tempDepartment}
                setTempDepartment={setTempDepartment}
                departmentData={departmentData}
                onFilter={() => {
                    setSelectedStartDate(tempStartDate);
                    setSelectedEndDate(tempEndDate);
                    setSelectedDepartment(tempDepartment);
                    setSearch(tempSearch);
                    onPageChange(1);
                    onLimitChange(limit);
                }}
            />

            {loading ? (
                <div className="mt-5"><Spinner /></div>
            ) : (
                <>
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

                                        <PipelineActions
                                            index={index}
                                            openIndex={openIndex}
                                            setOpenIndex={setOpenIndex}
                                            status={pipeline.isActive || false}
                                            onEdit={() => {
                                                setUniqueId(pipeline?.id ?? "");
                                                setSelectedPipeline(pipeline);
                                                setEditOpen(true);
                                            }}
                                            onDelete={() => {
                                                setUniqueId(pipeline?.id ?? "");
                                                setSelectedPipeline(pipeline);
                                                setDeleteOpen(true);
                                            }}
                                            onActivateDataPipeline={() => {
                                                setUniqueId(pipeline?.id ?? "");
                                                setSelectedPipeline(pipeline);
                                                setActivateOpen(true);
                                            }}
                                            onSuspendDataPipeline={() => {
                                                setUniqueId(pipeline?.id ?? "");
                                                setSelectedPipeline(pipeline);
                                                setSuspendOpen(true);
                                            }}
                                        />

                                    </div>

                                    <div className="flex text-[#494949] text-[14px] mt-5 ">
                                        {pipeline.dataPointDescription?.length > 200
                                            ? pipeline.dataPointDescription.slice(0, 150) + "..."
                                            : pipeline.dataPointDescription}
                                    </div>

                                    <div className="flex justify-between mt-5 items-center mb-5">
                                        <div className="flex justify-between items-center">
                                            <Calendar size={12} />
                                            <h6 className="ml-1 text-[#494949] text-[12px] ">
                                                {formatDate(pipeline?.createdAt ?? '')}
                                            </h6>
                                        </div>


                                        <div className={`text-xs ${pipeline?.isActive ? 'bg-blue-50 border border-blue-600 text-blue-600 rounded-full px-3 py-[2px]' :
                                            'bg-red-50 border border-red-600 text-red-500 rounded-full px-3 py-[2px]'} `}>
                                            {pipeline?.isActive ? 'Active' : 'Inactive'}
                                        </div>


                                    </div>

                                    <div
                                        className="flex w-full justify-center border-t border-gray-100 mt-auto"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DataPointActions
                                            pipeline={pipeline}
                                            onDelete={handleDeleteDataPoint}
                                            onShare={handleShareDataPipeline}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>

            )}

            {/* pipeline pagination */}
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
            ) : (
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
                activateOpen && selectedPipeline && (
                    <DataPipelineStatus uniqueId={uniqueId} pipeline={selectedPipeline} setOpen={setActivateOpen} activate={true} suspend={false} />
                )
            }

            {
                suspendOpen && selectedPipeline && (
                    <DataPipelineStatus uniqueId={uniqueId} pipeline={selectedPipeline} setOpen={setSuspendOpen} activate={false} suspend={true} />
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

