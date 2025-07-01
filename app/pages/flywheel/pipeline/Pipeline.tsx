import { PaginationMeta, Pipeline } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { Calendar, Eye, LetterText, Share2 } from "lucide-react";
import Link from "next/link";
import Pagination from "../_components/Pagination";
import { useState } from "react";
import ShareDataPoint from "../datapoint/ShareDataPoint";

type DataPipelineProps = {
    data: Pipeline[];
    pagination: PaginationMeta;
    onPageChange: (newPage: number) => void;
    onLimitChange: (newLimit: number) => void;
};

const PipelinePage = ({
    data,
    pagination,
    onPageChange,
    onLimitChange,
}: DataPipelineProps) => {
    const [shareDataPipeline, setShareDataPipelie] = useState(false);
    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('')
    const handleShareDataPipeline = (dataPointId: string) => {
        setShareDataPipelie(true)
        setUniqueDataPoint(dataPointId)
    }
    return (
        <div>
            <div className="grid grid-cols-1 md:grid md:grid-cols-2 xl:grid xl-grid-cols-3 w-full gap-5 mt-5">
                {
                    data.map((pipeline, index) =>
                        <div key={index} className="border bg-white border-gray-200 rounded-lg px-6 py-6">
                            <div className="flex items-center ">
                                <LetterText size={16} className="text-[#0C0C0C]" />
                                <h2 className="ml-2 text-[18px] text-[#0C0C0C]">
                                    {pipeline.dataPointName}
                                </h2>
                            </div>
                            <p className="text-[#494949] text-[14px] mt-5">
                                {pipeline.dataPointDescription}
                            </p>
                            <div className="flex w-full justify-start mt-5 pb-3">
                                <div className="flex items-center ">
                                    <Calendar size={12} />
                                    <h6 className="ml-1 text-[#494949] text-[12px]">{formatDate(pipeline?.createdAt ?? '')}</h6>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Share2
                                    size={15}
                                    onClick={() => handleShareDataPipeline(pipeline?.fieldId ?? '' )}
                                    className={` ${!pipeline?.fieldId ? 'hidden': 'block' } cursor-pointer bg-gray-100 rounded-md 
                                        px-2 py-1 hover:bg-blue-600 hover:text-white 
                                        w-5 h-5 lg:w-8 lg:h-8 lg:mt-5`}
                                />
                                <Link
                                    href={`/pages/flywheel/data-entry/${pipeline.id}`}
                                    className="flex items-center text-center mt-5 text-sm cursor-pointer bg-gray-100 rounded-md px-3 py-1 hover:bg-blue-600 hover:text-white ">
                                    <Eye size={15} className='mr-1 inline' /> View Entries
                                </Link>
                            </div>

                        </div>
                    )
                }
            </div >

            {pagination && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    limit={pagination.limit}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                />
            )}

            <ShareDataPoint
                shareDataPoint={shareDataPipeline}
                onClose={() => setShareDataPipelie(false)}
                uniqueId={uniqueDataPoint}
            />
        </div>


    );
};

export default PipelinePage;

