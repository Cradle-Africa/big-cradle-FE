import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    className?: string;
    showPageInput?: boolean;
    showLimitSelect?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    limit,
    onPageChange,
    onLimitChange,
    className = '',
    showPageInput = true,
    showLimitSelect = true,
}) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPage = Math.max(1, Math.min(totalPages, Number(e.target.value)));
        onPageChange(newPage);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(e.target.value);
        onLimitChange(newLimit);
        onPageChange(1);
    };

    return (
        <div className={`flex items-center gap-3 mt-5 py-5 ${className}`}>
            {/* Previous Button */}
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`py-1 px-4 rounded-md hover:cursor-pointer text-gray-400 bg-gray-100 ${currentPage === 1
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'shadow-md hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90'
                    }`}
            >
                Previous
            </button>

            <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`py-1 px-4 rounded-md hover:cursor-pointer text-gray-400 bg-gray-100 ${currentPage === totalPages
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'shadow-md hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90'
                    }`}
            >
                Next
            </button>

            {showPageInput && (
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={handlePageInputChange}
                    className="w-16 py-1 px-3 rounded-md border border-gray-300 text-center text-sm focus:outline-none"
                />
            )}

            {showLimitSelect && (
                <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="py-1 px-3 rounded-md border border-gray-300 text-sm focus:outline-none"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
            )}
        </div>
    );
};

export default Pagination;