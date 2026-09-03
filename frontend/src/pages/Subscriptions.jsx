import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { UtensilsCrossed, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    shift: 'BOTH'
  });

  useEffect(() => {
    fetchSubscriptions();
    fetchDropdowns();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mess');
      if (res.data?.data) {
        setSubscriptions(res.data.data);
      }
    } catch (err) {
      console.error("Fetch subscriptions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [custRes, planRes] = await Promise.all([
        api.get('/customers', { params: { size: 100 } }),
        api.get('/plans', { params: { active: true } })
      ]);
      if (custRes.data?.data?.content) setCustomers(custRes.data.data.content);
      if (planRes.data?.data) setPlans(planRes.data.data);
    } catch (err) {
      console.error("Fetch dropdowns error:", err);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.planId) return;
    try {
      await api.post('/mess', formData);
      setAssignModalOpen(false);
      fetchSubscriptions();
      alert("Mess Plan Assigned Successfully!");
    } catch (err) {
      alert("Failed to assign plan.");
    }
  };

  const columns = [
    {
      header: 'Customer',
      cell: (row) => (
        <div>
          <div className="font-semibold text-white">{row.customerName}</div>
          <div className="text-[11px] font-mono text-indigo-400">{row.customerRegNo}</div>
        </div>
      )
    },
    {
      header: 'Plan',
      cell: (row) => (
        <span className="font-semibold text-xs text-indigo-400">{row.planName}</span>
      )
    },
    {
      header: 'Shift',
      cell: (row) => (
        <span className="text-xs text-slate-300 uppercase">{row.shift}</span>
      )
    },
    {
      header: 'Start Date - End Date',
      cell: (row) => (
        <div className="text-xs text-slate-300 font-mono">
          {row.startDate} to <span className="font-bold text-amber-400">{row.endDate}</span>
        </div>
      )
    },
    {
      header: 'Total Amount',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-emerald-400">₹{row.totalAmount}</span>
      )
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
          row.status === 'ACTIVE'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Mess Subscriptions</h2>
          <p className="text-xs text-slate-400">Assign mess plans to customers and track subscription validity.</p>
        </div>
        <button
          onClick={() => setAssignModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" /> Assign Plan to Customer
        </button>
      </div>

      <DataTable
        columns={columns}
        data={subscriptions}
        loading={loading}
        emptyMessage="No active or past mess subscriptions found."
      />

      {/* Assign Plan Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Mess Subscription Plan"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Customer *</label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.regNo} - {c.mobile})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Mess Plan *</label>
            <select
              required
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Choose Plan --</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.fromDay}-{p.toDay} Days, Rate: ₹{p.rate})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="BOTH">Both (Morning + Evening)</option>
                <option value="MORNING">Morning Only</option>
                <option value="EVENING">Evening Only</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl text-xs text-indigo-300">
            Assigning a plan automatically charges the subscription total rate to the customer's running ledger.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              Assign Subscription
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Subscriptions;
