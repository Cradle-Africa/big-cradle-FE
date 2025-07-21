"use client";

import Link from "next/link";
import { ArrowRight, Pencil, Share2, Trash2 } from "lucide-react";
import { Pipeline, SurveyListItem } from "@/app/lib/type";

type Props = {
    pipeline?: Pipeline;
    survey?: SurveyListItem;
    onDelete?: (fieldId?: string, name?: string) => void;
    onShare?: (fieldId: string) => void;
};

export default function DataPointActions({ pipeline, survey, onDelete, onShare }: Props) {
    // Don't render anything if neither pipeline nor survey exists
    if (!pipeline && !survey) return null

    return (
        <>
            {/* pipelines cards */}
            {pipeline && (
                <div className="flex w-full items-center justify-center gap-2 mt-5">
                    {pipeline?.fieldId ? (
                        <div className="flex w-full justify-center gap-2">
                            <div className="w-2/3">
                                <Link
                                    href={`/pages/flywheel/data-entry/${pipeline.id}`}
                                    className="w-full flex justify-center items-center text-sm cursor-pointer rounded-md px-3 py-2 bg-[#F0F8FF] text-[#0D89FF] hover:bg-blue-100 border border-[#0D89FF]"
                                >
                                    View Entries
                                    <ArrowRight size={15} className="ml-1 inline" />
                                </Link>
                            </div>
                            <div className="w-1/3 flex">
                                <div onClick={() => onShare?.(pipeline.fieldId ?? '')} className="px-1">
                                    <div className="flex justify-center cursor-pointer items-center text-center w-10 h-10 rounded-full bg-gray-100 text-black hover:bg-blue-600 hover:text-white">
                                        <Share2 size={15} />
                                    </div>
                                </div>

                                <button onClick={() => onDelete?.(pipeline?.fieldId, pipeline?.dataPointName)} className="px-1">
                                    <div className="flex justify-center cursor-pointer items-center text-center w-10 h-10 rounded-full bg-gray-100 text-black hover:bg-blue-600 hover:text-white">
                                        <Trash2 size={15} />
                                    </div>
                                </button>

                                <Link href={`/pages/flywheel/datapoint/edit/${pipeline?.fieldId}`} className="px-1">
                                    <div className="flex justify-center cursor-pointer items-center text-center w-10 h-10 rounded-full bg-gray-100 text-black hover:bg-blue-600 hover:text-white">
                                        <Pencil size={15} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href={`/pages/flywheel/datapoint/new/${pipeline?.id}`}
                            className="flex w-full justify-center items-center text-center text-sm cursor-pointer rounded-md px-3 py-2 bg-[#FEF0FF] hover:bg-[#e9c9ed] text-[#FF0AFF] border border-[#FF0AFF]"
                        >
                            Create a data point
                            <ArrowRight size={15} className="ml-1 inline" />
                        </Link>
                    )}


                </div>
            )}

            {/* surveys cards */}
            {survey && (
                <div className="flex w-full items-start justify-center gap-2 mt-5">
                    {survey && (
                        <div className="flex w-full justify-start gap-2">
                            <div className="w-3/3">
                                <Link
                                    href={`/pages/survey/${survey.id}`}
                                    className="flex w-full justify-center items-center text-sm cursor-pointer rounded-md px-3 py-2 bg-[#F0F8FF] text-[#0D89FF] hover:bg-blue-100 border border-[#0D89FF]"
                                >
                                    View Entries
                                    <ArrowRight size={15} className="ml-1 inline" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </>


    )
}
