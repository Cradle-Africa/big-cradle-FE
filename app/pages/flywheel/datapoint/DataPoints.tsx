"use client";

import { DataPoint, PaginationMeta } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { Eye, List, Pencil, Plus, Share2 } from "lucide-react";
import Pagination from "../_components/Pagination";
import { useEffect, useRef, useState } from "react";
import ViewDataPoint from "./ViewDataPoint";
import EditDataPoint from "./EditDataPoint";
import ShareDataPoint from "./ShareDataPoint";
import ViewDataEntries from "../data-entry/ViewDataEntries";

type DataPointsProps = {
    data: DataPoint[];
    pagination: PaginationMeta;
    onPageChange: (newPage: number) => void;
    onLimitChange: (newLimit: number) => void;
    creatingDataPoint: boolean;
    setCreatingDataPoint: (value: boolean) => void;
};

const DataPoints = ({
    data,
    pagination,
    onPageChange,
    onLimitChange,
    setCreatingDataPoint
}: DataPointsProps) => {

    const [openViewDataPoint, setOpenViewDataPoit] = useState(false);
    const [editingDataPoint, setEditingDataPoint] = useState(false);
    const [shareDataPoint, setShareDataPoint] = useState(false);
    const [viewDataEntries, setViewDataEntries] = useState(false);


    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('')
    const [uniqueDataEntry, setUniqueDataEntry] = useState<string>('')

    const handleViewDataPoint = (id: any) => {
        setOpenViewDataPoit(true)
        setUniqueDataPoint(id)
    }

    const handleEditDataPoint = (id: any) => {
        setEditingDataPoint(true)
        setUniqueDataPoint(id)
    }

    const handleShareDataPoint = (id: any) => {
        setShareDataPoint(true)
        setUniqueDataPoint(id)
    }

    const handleViewDataEntries = (id: any) => {
        setViewDataEntries(true)
        setUniqueDataEntry(id)
    }

    const [openOptionIndex, setOpenOptionIndex] = useState<string | null>(null);
    const optionRef = useRef<HTMLUListElement | null>(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionRef.current && !optionRef.current.contains(event.target as Node)) {
                setOpenOptionIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div>

            <ViewDataPoint
                openViewDataPoint={openViewDataPoint}
                onClose={() => setOpenViewDataPoit(false)}
                uniqueId={uniqueDataPoint}
            />

            <ShareDataPoint
                shareDataPoint={shareDataPoint}
                onClose={() => setShareDataPoint(false)}
                uniqueId={uniqueDataPoint}
            />

            <EditDataPoint
                editingDataPoint={editingDataPoint}
                uniqueId={uniqueDataPoint}
                setEditingDataPoint={setEditingDataPoint}
            />

            {(viewDataEntries &&
                <div className="flex justify-between">
                    <h2 className="text-md text-black">Data entries</h2>
                    <button
                        className="flex w-[200px] items-center bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer"
                        onClick={() => setViewDataEntries(false)}
                    >
                        <List size={18} color="white" className="mr-1" />
                        View Data Points
                    </button>
                </div>
            )}

            <ViewDataEntries
                viewDataEntries={viewDataEntries}
                uniqueId={uniqueDataEntry}
                setViewDataEntries={setViewDataEntries}
            />

            {!editingDataPoint && !viewDataEntries && (
                <>
                    <div className="flex justify-between">
                        <h2 className="text-lg text-black">Data points</h2>
                        <div>
                            <button
                                className="flex justify-center w-[200px] items-center bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer"
                                onClick={() => setCreatingDataPoint(true)}
                            >
                                <Plus size={18} color="white" className="mr-1" />
                                New Data Point
                            </button>
                        </div>

                    </div>
                    <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
                        <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        #
                                    </th>
                                    <th className="px-3 py-3 text-left text-sm font-semibold">
                                        Fields
                                    </th>
                                    <th className="px-3 py-3 text-left text-sm font-semibold">
                                        Date
                                    </th>
                                    <th className="px-3 py-3 text-left text-sm font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {data.map((dataPoints, index) => (
                                    <tr key={index} className="">
                                        <td className="px-6 py-4 align-top">{index + 1}</td>
                                        <td className="px-3 py-2 align-top">
                                            <table className="w-full">
                                                <tbody>
                                                    <tr>
                                                        <td className=" py-2 align-top">
                                                            {dataPoints.field.map((field: any, idx: number) => (
                                                                <div key={idx} className="mb-4 px-3 py-3 text-sm border rounded border-gray-300 bg-gray-50 pb-2 hover:bg-blue-50">
                                                                    <div className="flex gap-x-4">
                                                                        <span className="min-w-[400px] font-medium flex flex-wrap">{field.label}</span>
                                                                        <span className="min-w-[100px]">{field.type}</span>
                                                                        <span className="min-w-[100px]">{field.required ? "Required" : "Optional"}</span>
                                                                    </div>

                                                                    {field.options && field.options.length > 0 && (
                                                                        <div className="relative mt-1">
                                                                            <button
                                                                                onClick={() =>
                                                                                    setOpenOptionIndex(
                                                                                        openOptionIndex === `${dataPoints.id}-${idx}` ? null : `${dataPoints.id}-${idx}`
                                                                                    )
                                                                                }
                                                                                className="text-blue-600 cursor-pointer underline text-sm"
                                                                            >
                                                                                View options
                                                                            </button>

                                                                            {openOptionIndex === `${dataPoints.id}-${idx}` && (
                                                                                <ul
                                                                                    ref={optionRef}
                                                                                    className="absolute left-0 top-full mt-2 bg-white shadow-lg border border-gray-200 rounded-lg z-50 w-64 max-w-xs text-sm"
                                                                                >
                                                                                    {field.options.map((opt: string, i: number) => (
                                                                                        <li key={i} className="px-4 py-2 border-b border-gray-100 last:border-none hover:bg-gray-100">
                                                                                            {opt}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                </tbody>

                                            </table>
                                        </td>

                                        <td className="px-3 py-4 align-top text-left text-sm">
                                            {formatDate(dataPoints?.createdAt ?? "")}
                                        </td>
                                        <td className="px-3 py-4 text-center align-top">
                                            <Eye
                                                size={35}
                                                onClick={() => handleViewDataPoint(dataPoints?.id)}
                                                className="cursor-pointer bg-gray-100 rounded-full px-2 py-1 hover:bg-blue-600 hover:text-white "
                                            />
                                            <Pencil
                                                size={35}
                                                onClick={() => handleEditDataPoint(dataPoints?.id)}
                                                className="mt-10 cursor-pointer bg-gray-100 rounded-full px-2 py-1 hover:bg-blue-600 hover:text-white "
                                            />
                                            <Share2
                                                size={35}
                                                onClick={() => handleShareDataPoint(dataPoints?.id)}
                                                className="mt-10 cursor-pointer bg-gray-100 rounded-full px-2 py-1 hover:bg-blue-600 hover:text-white "
                                            />
                                            <button
                                                onClick={() => handleViewDataEntries(dataPoints.dataPointId)}
                                                className="w-28 text-center mt-10 text-sm cursor-pointer bg-gray-100 rounded-full px-3 py-1 hover:bg-blue-600 hover:text-white "
                                            >View Entries
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                    {pagination && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            limit={pagination.limit}
                            onPageChange={onPageChange}
                            onLimitChange={onLimitChange}
                        />
                    )}
                </>

            )}

        </div >

    )
};

export default DataPoints;
