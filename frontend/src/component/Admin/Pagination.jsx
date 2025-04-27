import React from 'react'

export const Pagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange }) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    // Calculate visible page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            {/* Page Navigation */}
            <div className="flex gap-1">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800 disabled:opacity-50"
                >
                    «
                </button>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`px-3 py-1 rounded ${currentPage === number
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-zinc-800'
                            }`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800 disabled:opacity-50"
                >
                    »
                </button>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm">Show:</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800"
                >
                    {[10, 25, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};