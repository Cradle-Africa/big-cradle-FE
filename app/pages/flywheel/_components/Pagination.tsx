// components/Pagination.tsx
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    limit,
    onPageChange,
    onLimitChange,
}) => {
    return (
        <div className="flex items-center gap-4 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white disabled:opacity-50"
            >
                Previous
            </button>

            <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-2 bg-gray-200 rounded-md hover:bg-blue-600 hover:text-white disabled:opacity-50"
            >
                Next
            </button>

            <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="ml-4 py-2 px-2 border border-gray-300 rounded-md outline-none"
            >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
            </select>
        </div>
    );
};

export default PaginationComponent;
