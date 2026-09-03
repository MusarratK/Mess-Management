import React, { useState } from 'react';
import { BarChart3, Download, FileText, Calendar } from 'lucide-react';
import api from '../api/axios';

const Reports = () => {
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const downloadCustomerReport = async () => {
    try {
      const response = await api.get('/reports/customer/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Customer_Roster_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download Customer PDF report.");
    }
  };

  const downloadExpenseReport = async () => {
    try {
      const response = await api.get('/reports/expense/pdf', {
        params: { from: fromDate, to: toDate },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Expense_Report_${fromDate}_to_${toDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download Expense PDF report.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Reports Hub</h2>
        <p className="text-xs text-slate-400">Generate printable PDF reports for customer rosters and expenses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Roster Report Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Customer Roster PDF Report</h3>
              <p className="text-xs text-slate-400">Full active customer directory with mobile, college, and balances.</p>
            </div>
          </div>
          <button
            onClick={downloadCustomerReport}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Customer Roster PDF
          </button>
        </div>

        {/* Expense Report Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Date-Range Expense Report</h3>
              <p className="text-xs text-slate-400">Export categorized mess operational expenses for accounting.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={downloadExpenseReport}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Expense PDF Statement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
