import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-slate-800 text-gray-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-4 py-2 rounded-md bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors"
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="text-gray-500">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-md transition-colors ${page === currentPage
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                        }`}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-4 py-2 rounded-md bg-slate-800 text-gray-300 hover:bg-slate-700 transition-colors"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-slate-800 text-gray-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
};

export default Pagination;
