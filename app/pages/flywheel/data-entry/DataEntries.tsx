import { formatDate } from "@/app/utils/formatDate";
import Pagination from "../_components/Pagination";
import { DataEntry, PaginationMeta } from "@/app/lib/type";
import { toSentenceCase } from "@/app/utils/caseFormat";

type DataEntriesProps = {
    data: DataEntry[];
    pagination: PaginationMeta;
    onPageChange: (newPage: number) => void;
    onLimitChange: (newLimit: number) => void;
};

const DataEntries = ({
    data,
    pagination,
    onPageChange,
    onLimitChange,
}: DataEntriesProps) => {
    const renderValue = (value: unknown) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    return (
        <>
            <div className="overflow-x-auto rounded-[8px] border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Pipeline name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Field Values</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Created On</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                        {data.map((entry, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{index + 1}</td>
                                <td className="px-6 py-4 font-medium">Pipeline name</td>
                                <td className="px-6 py-4">
                                    <table className="text-md">
                                        <tbody>
                                            {entry.data && typeof entry.data === 'object' ? (
                                                Object.entries(entry.data).length > 0 ? (
                                                    Object.entries(entry.data).map(([key, value]) => (
                                                        <tr key={key} 
                                                            className="flex justify-between min-w-[500px] max-w-[500px]
                                                            border-b border-gray-200 last:border-b-0
                                                            "
                                                        >
                                                            <td className="font-medium flex flex-wrap min-w-[230px] max-w-[230px] py-2">{toSentenceCase(key)}:</td>
                                                            <td className="flex flex-wrap justify-end min-w-[250px] max-w-[250px] py-2">{renderValue(value)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={2} className="text-gray-400 italic">
                                                            Empty data object
                                                        </td>
                                                    </tr>
                                                )
                                            ) : (
                                                <tr>
                                                    <td colSpan={2} className="text-gray-400 italic">
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </td>
                                <td className="px-6 py-4">
                                    {formatDate(entry.createdAt ?? '')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                limit={pagination.limit}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
            />
        </>
    );
};

export default DataEntries;
