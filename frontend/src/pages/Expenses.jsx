import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Receipt, Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'GROCERIES',
    title: '',
    amount: 500,
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMode: 'CASH',
    notes: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/expenses');
      if (res.data?.data) {
        setExpenses(res.data.data);
      }
    } catch (err) {
      console.error("Fetch expenses error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      setModalOpen(false);
      fetchExpenses();
      alert("Expense Logged!");
    } catch (err) {
      alert("Failed to log expense.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense entry?")) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        alert("Failed to delete expense.");
      }
    }
  };

  const columns = [
    {
      header: 'Title & Category',
      cell: (row) => (
        <div>
          <div className="font-semibold text-white">{row.title}</div>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
            {row.category}
          </span>
        </div>
      )
    },
    {
      header: 'Expense Date',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-300">{row.expenseDate}</span>
      )
    },
    {
      header: 'Payment Mode',
      cell: (row) => (
        <span className="text-xs text-slate-400">{row.paymentMode}</span>
      )
    },
    {
      header: 'Amount',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-rose-400">₹{row.amount}</span>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="p-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-400 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Expense Tracker</h2>
          <p className="text-xs text-slate-400">Log canteen operational expenses, groceries, LPG gas, and staff payouts.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" /> Log Expense
        </button>
      </div>

      <DataTable
        columns={columns}
        data={expenses}
        loading={loading}
        emptyMessage="No expense entries logged."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Operational Expense"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Expense Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Vegetables & Rice Purchase"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="GROCERIES">Groceries & Dairy</option>
                <option value="LPG_GAS">LPG Gas Cylinders</option>
                <option value="STAFF_WAGES">Staff Wages</option>
                <option value="ELECTRICITY_WATER">Utilities & Bills</option>
                <option value="MAINTENANCE">Equipment Repair</option>
                <option value="MISC">Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Expense Date *</label>
              <input
                type="date"
                required
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI / Google Pay</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              Log Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
