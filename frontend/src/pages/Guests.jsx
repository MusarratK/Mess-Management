import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { UserCheck, Plus, Receipt } from 'lucide-react';
import api from '../api/axios';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    mobile: '',
    date: new Date().toISOString().split('T')[0],
    shift: 'BOTH',
    numberOfGuests: 1,
    ratePerGuest: 100,
    paymentMode: 'CASH',
    notes: ''
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/guests');
      if (res.data?.data) {
        setGuests(res.data.data);
      }
    } catch (err) {
      console.error("Fetch guests error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/guests', formData);
      setModalOpen(false);
      fetchGuests();
      alert("Walk-in guest meal logged!");
    } catch (err) {
      alert("Failed to log guest entry.");
    }
  };

  const columns = [
    {
      header: 'Guest Name',
      cell: (row) => (
        <div>
          <div className="font-semibold text-white">{row.guestName}</div>
          {row.mobile && <div className="text-[11px] font-mono text-slate-400">{row.mobile}</div>}
        </div>
      )
    },
    {
      header: 'Date & Shift',
      cell: (row) => (
        <div className="text-xs text-slate-300">
          <div>{row.date}</div>
          <div className="text-[10px] text-slate-500 uppercase">{row.shift}</div>
        </div>
      )
    },
    {
      header: 'Guests Count',
      cell: (row) => (
        <span className="font-semibold text-xs text-indigo-400">{row.numberOfGuests} Guests</span>
      )
    },
    {
      header: 'Rate / Guest',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-300">₹{row.ratePerGuest}</span>
      )
    },
    {
      header: 'Total Paid',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-emerald-400">₹{row.totalAmount} ({row.paymentMode})</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Walk-in Guest Meals</h2>
          <p className="text-xs text-slate-400">Log non-member walk-in guests and immediate payment collection.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" /> Log Guest Visit
        </button>
      </div>

      <DataTable
        columns={columns}
        data={guests}
        loading={loading}
        emptyMessage="No guest meal entries recorded for today."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Walk-in Guest Meal"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Guest Name / Group Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe & Group"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Mobile Number</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Number of Guests *</label>
              <input
                type="number"
                required
                min={1}
                value={formData.numberOfGuests}
                onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Rate Per Guest (₹) *</label>
              <input
                type="number"
                required
                value={formData.ratePerGuest}
                onChange={(e) => setFormData({ ...formData, ratePerGuest: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex justify-between items-center text-xs">
            <span className="text-slate-300">Total Calculated Amount:</span>
            <span className="font-extrabold font-mono text-sm text-emerald-400">₹{formData.numberOfGuests * formData.ratePerGuest}</span>
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
              Log Guest Meal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Guests;
