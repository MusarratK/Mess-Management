import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, FileText, Search } from 'lucide-react';
import api from '../api/axios';

const Ledger = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: 1000,
    paymentMode: 'CASH',
    referenceNo: '',
    description: 'Customer Payment Received'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchCustomerStatement(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers', { params: { size: 100 } });
      if (res.data?.data?.content) {
        setCustomers(res.data.data.content);
        if (res.data.data.content.length > 0) {
          setSelectedCustomerId(res.data.data.content[0].id);
        }
      }
    } catch (err) {
      console.error("Fetch customers error:", err);
    }
  };

  const fetchCustomerStatement = async (custKey) => {
    setLoading(true);
    try {
      const res = await api.get(`/ledger/customer/${custKey}`);
      if (res.data?.data) {
        setStatement(res.data.data);
      }
    } catch (err) {
      console.error("Fetch statement error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.amount) return;
    try {
      await api.post('/payments', formData);
      setPaymentModalOpen(false);
      fetchCustomerStatement(formData.customerId);
      alert("Payment Recorded & Account Balance Updated!");
    } catch (err) {
      alert("Failed to record payment.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Payments & Ledger Statement</h2>
          <p className="text-xs text-slate-400">Record customer credits/payments and track running account balance history.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ ...formData, customerId: selectedCustomerId });
            setPaymentModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
        >
          <Plus className="w-4 h-4" /> Record Customer Payment
        </button>
      </div>

      {/* Customer Account Selector */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
        <label className="text-xs font-semibold text-slate-400">Select Customer Account:</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="max-w-md bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.regNo} - Balance: ₹{c.currentBalance || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Account Statement View */}
      {loading ? (
        <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
          <p className="text-xs text-slate-400">Loading ledger statement...</p>
        </div>
      ) : statement ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Opening Balance</span>
              <h4 className="text-xl font-bold font-mono text-slate-200 mt-1">₹{statement.openingBalance || 0}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-semibold text-rose-400 uppercase">Total Charges (Debit)</span>
              <h4 className="text-xl font-bold font-mono text-rose-400 mt-1">₹{statement.totalDebit || 0}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase">Total Received (Credit)</span>
              <h4 className="text-xl font-bold font-mono text-emerald-400 mt-1">₹{statement.totalCredit || 0}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase">Remaining Balance</span>
              <h4 className="text-xl font-bold font-mono text-white mt-1">₹{statement.remainingBalance || 0}</h4>
            </div>
          </div>

          {/* Transactions History */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
              <h3 className="font-bold text-sm text-white">Running Account Statement Ledger</h3>
            </div>

            <div className="divide-y divide-slate-800/60">
              {statement.transactions?.length === 0 ? (
                <p className="p-6 text-xs text-slate-500 italic">No ledger transactions found for this customer.</p>
              ) : (
                statement.transactions?.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        tx.type === 'DEBIT' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {tx.type === 'DEBIT' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white">{tx.description || tx.type}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{tx.transactionDate} | Mode: {tx.paymentMode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono text-xs font-bold ${tx.type === 'DEBIT' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {tx.type === 'DEBIT' ? '+' : '-'}₹{tx.amount}
                      </div>
                      <div className="text-[10px] text-slate-400">Balance: <span className="font-mono font-semibold text-slate-200">₹{tx.runningBalanceAfter}</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Record Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Customer Payment"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Customer *</label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Select Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.regNo} - Balance: ₹{c.currentBalance || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Amount Paid (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
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

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Reference No / Note</label>
            <input
              type="text"
              placeholder="e.g. UPI Ref #12345678"
              value={formData.referenceNo}
              onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/30"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Ledger;
