import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  loading = false,
  pageNo = 0,
  totalPages = 1,
  onPageChange,
  emptyMessage = 'No records found.',
  renderMobileCard
}) => {
  if (loading) {
    return (
      <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-medium text-slate-400">Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800/80">
        <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-base font-semibold text-slate-300">{emptyMessage}</p>
        <p className="text-xs text-slate-500 mt-1">Try adjusting search filters or adding new records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-800/40 transition">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-3">
        {data.map((row, rowIdx) => (
          <div key={rowIdx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
            {renderMobileCard ? renderMobileCard(row) : (
              columns.map((col, colIdx) => (
                <div key={colIdx} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400">{col.header}:</span>
                  <span className="text-slate-200">{col.cell ? col.cell(row) : row[col.accessor]}</span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400">
          <span>Page {pageNo + 1} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pageNo - 1)}
              disabled={pageNo === 0}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pageNo + 1)}
              disabled={pageNo >= totalPages - 1}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
