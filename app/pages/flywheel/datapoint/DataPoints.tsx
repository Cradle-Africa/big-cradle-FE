"use client";

import { DataPoint, PaginationMeta } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { Eye, List, MoreVertical, Pencil, Plus, Share2, Database } from "lucide-react";
import Pagination from "../_components/Pagination";
import { useEffect, useRef, useState } from "react";
import ViewDataPoint from "./ViewDataPoint";
import EditDataPoint from "./EditDataPoint";
import ShareDataPoint from "./ShareDataPoint";
// import ViewDataEntries from "../data-entry/ViewDataEntries";
import Link from "next/link";

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

    const menuRef = useRef<HTMLUListElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const optionRef = useRef<HTMLUListElement | null>(null);

    const [uniqueDataPoint, setUniqueDataPoint] = useState<string>('')
    // const [uniqueDataEntry, setUniqueDataEntry] = useState<string>('')

    const handleViewDataPoint = (id: any) => {
        setOpenViewDataPoit(true)
        setOpenIndex(null);
        setUniqueDataPoint(id)
    }

    const handleEditDataPoint = (id: any) => {
        setEditingDataPoint(true)
        setOpenIndex(null);
        setUniqueDataPoint(id)
    }

    const handleShareDataPoint = (id: any) => {
        setShareDataPoint(true)
        setOpenIndex(null);
        setUniqueDataPoint(id)
    }

    // const handleViewDataEntries = (id: any) => {
    //     setViewDataEntries(true)
    //     setOpenIndex(null);
    //     setUniqueDataEntry(id)
    // }

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionRef.current && !optionRef.current.contains(event.target as Node)) {
                setOpenIndex(null);
                setOpenIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenIndex(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
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

            {/* <ViewDataEntries
                viewDataEntries={viewDataEntries}
                uniqueId={uniqueDataEntry}
                setViewDataEntries={setViewDataEntries}
            /> */}

            {!editingDataPoint && !viewDataEntries && (
                <>
                    <div className="flex justify-between w-full">
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
                    <div className="overflow-x-auto pb-14 rounded-[8px] border border-gray-200 mt-5">
                        <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        #
                                    </th>
                                    <th className="px-3 py-3 text-left text-sm font-semibold">
                                        Pipeline name
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
                                        <td className="px-3 py-3 align-top">{dataPoints?.dataPointName}</td>
                                        <td className="px-3 py-4 align-top text-left text-sm">
                                            {formatDate(dataPoints?.createdAt ?? "")}
                                        </td>
                                        <td className="px-6 py-4 mb-10 border-r border-gray-100 whitespace-nowrap relative">
                                            <button
                                                className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-600 hover:text-white"
                                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {openIndex === index && (
                                                <ul
                                                    ref={menuRef}
                                                    className="absolute z-60 right-10 py-1 mt-2 w-auto bg-white rounded-md shadow-md border border-gray-100"
                                                >
                                                    <li className="px-2 w-full">
                                                        <button
                                                            onClick={() => handleViewDataPoint(dataPoints?.id)}
                                                            className="flex items-center cursor-pointer px-2 py-2 hover:bg-blue-200 hover:text-blue-600 rounded-md"
                                                        >
                                                            <Eye size={13} className="inline mr-1" />
                                                            View data point
                                                        </button>
                                                    </li>
                                                    <li className="px-2 w-full">
                                                        <button
                                                            onClick={() => handleEditDataPoint(dataPoints?.id)}
                                                            className="w-full flex items-center cursor-pointer px-2 py-2 hover:bg-blue-200 hover:text-blue-600 rounded-md"
                                                        >
                                                            <Pencil size={13} className="inline mr-1" /> Edit
                                                        </button>
                                                    </li>
                                                    <li className="px-2 w-full">
                                                        <button
                                                            onClick={() => handleShareDataPoint(dataPoints?.id)}
                                                            className="flex items-center cursor-pointer px-2 py-2 hover:bg-blue-200 hover:text-blue-600 rounded-md"
                                                        > <Share2 size={13} className="inline mr-1" /> Share Data point
                                                        </button>
                                                    </li>
                                                    <li className="px-2 w-full">
                                                        {/* <button
                                                            onClick={() => handleViewDataEntries(dataPoints.dataPointId)}
                                                            className="flex w-full items-center cursor-pointer px-2 py-2 hover:bg-blue-200 hover:text-blue-600 rounded-md"
                                                        > <Database size={13} className="inline mr-1" /> View Entries
                                                        </button> */}

                                                        <Link
                                                            href={`/pages/flywheel/data-entry/${dataPoints.dataPointId}`}
                                                            className="flex w-full items-center cursor-pointer px-2 py-2 hover:bg-blue-200 hover:text-blue-600 rounded-md">
                                                            <Database size={15} className='mr-1 inline' /> View Entries
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
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
