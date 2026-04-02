// components/Pagination.tsx
import React from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

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
                className="px-3 py-2 bg-gray-100 text-black rounded-md cursor-pointer hover:bg-blue-600 hover:text-white disabled:opacity-50"
            >
                <GoChevronLeft size={14}/>
            </button>

            <span className="text-sm">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-2 bg-gray-100 text-black rounded-md cursor-pointer hover:bg-blue-600 hover:text-white disabled:opacity-50"
            >
                <GoChevronRight size={14}/>
            </button>

            <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="ml-4 py-[4px] bg-gray-100 px-2 rounded-md outline-none hover:bg-blue-600 hover:text-white cursor-pointer"
            >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
            </select>
        </div>
    );
};

export default PaginationComponent;
