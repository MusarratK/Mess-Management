import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { CalendarDays, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    fromDay: 1,
    toDay: 30,
    rate: 3000,
    active: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/plans');
      if (res.data?.data) {
        setPlans(res.data.data);
      }
    } catch (err) {
      console.error("Fetch plans error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({ id: null, name: '', description: '', fromDay: 1, toDay: 30, rate: 3000, active: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setFormData({ ...plan });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/plans/${formData.id}`, formData);
      } else {
        await api.post('/plans', formData);
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert("Failed to save plan.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this mess plan?")) {
      try {
        await api.delete(`/plans/${id}`);
        fetchPlans();
      } catch (err) {
        alert("Failed to delete plan.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Mess Subscription Plans</h2>
          <p className="text-xs text-slate-400">Configure mess plans, duration day ranges, and rates.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" /> Create New Mess Plan
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
          <p className="text-xs text-slate-400">Loading plans...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-base text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{plan.description || 'Standard Canteen Plan'}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${plan.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Day Range:</span> <span className="text-white font-semibold">{plan.fromDay} - {plan.toDay} Days</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Plan Rate:</span> <span className="text-emerald-400 font-extrabold font-mono text-sm">₹{plan.rate}</span></div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 bg-rose-950/60 hover:bg-rose-900/60 text-rose-400 rounded-xl text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={formData.id ? 'Edit Mess Plan' : 'Create Mess Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Plan Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">From Day *</label>
              <input
                type="number"
                required
                min={1}
                value={formData.fromDay}
                onChange={(e) => setFormData({ ...formData, fromDay: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">To Day *</label>
              <input
                type="number"
                required
                min={1}
                value={formData.toDay}
                onChange={(e) => setFormData({ ...formData, toDay: parseInt(e.target.value) || 30 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Plan Rate (₹) *</label>
            <input
              type="number"
              required
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
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
              Save Plan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Plans;
