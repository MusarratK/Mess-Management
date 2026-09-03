import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import QrScannerModal from '../components/QrScannerModal';
import { ClipboardCheck, QrCode, CheckCircle2, XCircle, Save } from 'lucide-react';
import api from '../api/axios';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState('BOTH');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedShift]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, custRes] = await Promise.all([
        api.get('/attendance', { params: { date: selectedDate, shift: selectedShift } }),
        api.get('/customers', { params: { size: 100 } })
      ]);

      const attList = attRes.data?.data || [];
      const custPage = custRes.data?.data?.content || [];
      setCustomers(custPage);

      const map = {};
      custPage.forEach((c) => {
        const found = attList.find((a) => a.customerId === c.id);
        map[c.id] = found ? found.status : 'ABSENT';
      });
      setStatusMap(map);
      setAttendance(attList);
    } catch (err) {
      console.error("Fetch attendance error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (customerId) => {
    setStatusMap((prev) => ({
      ...prev,
      [customerId]: prev[customerId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
  };

  const handleSaveBulk = async () => {
    try {
      const records = Object.keys(statusMap).map((custKey) => ({
        customerId: parseInt(custKey),
        status: statusMap[custKey]
      }));

      await api.post('/attendance/bulk', {
        date: selectedDate,
        shift: selectedShift,
        records
      });

      alert("Daily Attendance Saved Successfully!");
      fetchData();
    } catch (err) {
      alert("Failed to save attendance.");
    }
  };

  const handleQrScanSuccess = async (scannedRegNo) => {
    try {
      const res = await api.post('/attendance/scan', {
        qrCode: scannedRegNo,
        shift: selectedShift
      });
      alert(res.data?.message || "QR Code Check-In Verified!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or unregistered QR code scan!");
    }
  };

  const columns = [
    {
      header: 'Customer',
      cell: (row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-[11px] font-mono text-indigo-400">{row.regNo}</div>
        </div>
      )
    },
    {
      header: 'Mobile',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-300">{row.mobile}</span>
      )
    },
    {
      header: 'Plan Status',
      cell: (row) => (
        <span className="text-xs text-emerald-400 font-semibold">{row.activeSubscriptionPlan || 'No Active Plan'}</span>
      )
    },
    {
      header: 'Mark Status',
      cell: (row) => {
        const isPresent = statusMap[row.id] === 'PRESENT';
        return (
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isPresent
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-600/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {isPresent ? 'PRESENT' : 'ABSENT'}
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Attendance Register</h2>
          <p className="text-xs text-slate-400">Daily meal attendance check-in and live barcode scanner verification.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
          >
            <QrCode className="w-4 h-4" /> Live QR Scan Check-In
          </button>
          <button
            onClick={handleSaveBulk}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Save className="w-4 h-4" /> Save Register
          </button>
        </div>
      </div>

      {/* Date & Shift Selectors */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['BOTH', 'MORNING', 'EVENING'].map((shift) => (
            <button
              key={shift}
              onClick={() => setSelectedShift(shift)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition ${
                selectedShift === shift
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {shift}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        emptyMessage="No customer records found."
      />

      <QrScannerModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onScanSuccess={handleQrScanSuccess}
      />
    </div>
  );
};

export default Attendance;
