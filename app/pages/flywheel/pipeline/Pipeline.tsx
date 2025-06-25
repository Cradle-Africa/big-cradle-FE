import { Pipeline } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { Calendar, Eye, LetterText } from "lucide-react";

type DataPipelineProps = {
    data: Pipeline[];
    // pagination: PaginationMeta;
    // onPageChange: (newPage: number) => void;
    // onLimitChange: (newLimit: number) => void;
};

const PipelinePage = ({
    data,
    // pagination,
    // onPageChange,
    // onLimitChange,
}: DataPipelineProps) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid md:grid-cols-2 xl:grid xl-grid-cols-3 w-full gap-5 mt-10">
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
                            <div className="flex w-full justify-end mt-5 border-b border-gray-100 pb-3">
                                <div className="flex items-center ">
                                    <Calendar size={12} />
                                    <h6 className="ml-1 text-[#494949] text-[12px]">{formatDate(pipeline?.createdAt ?? '')}</h6>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5">
                                <button
                                    className="bg-[#3352FF] rounded-[8px] px-4 h-[36px] cursor-pointer"
                                >
                                    <div className="flex fgap2 items-center gap-2">
                                        <Eye size={18} color="white" />
                                        <span className="text-white">View Data Point</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div >
            {/* {pagination && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.total}
                    limit={pagination.limit}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                />
            )} */}
        </div>


    );
};

export default PipelinePage;

