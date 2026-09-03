import React from 'react';
import Modal from './Modal';
import { Download, Printer, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import api from '../api/axios';

const IdCardModal = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  const handleDownloadPdf = async () => {
    try {
      const response = await api.get(`/customers/${customer.id}/id-card`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Customer_ID_Card_${customer.regNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download ID Card PDF:", err);
      alert("Failed to download PDF ID Card.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Customer ID Card Badge">
      <div className="space-y-6">
        {/* Printable Digital Card Layout */}
        <div className="printable-area max-w-xs mx-auto p-5 rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/40 shadow-2xl text-center space-y-4 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-white tracking-wider">MESS CANTEEN</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {customer.verified ? 'VERIFIED' : 'PENDING'}
            </span>
          </div>

          {/* Photo & Name */}
          <div className="space-y-2">
            <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-lg bg-slate-800 flex items-center justify-center">
              {customer.photoUrl ? (
                <img src={customer.photoUrl} alt={customer.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-indigo-400">{customer.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white tracking-tight">{customer.name}</h4>
              <p className="text-xs font-mono font-bold text-indigo-400">{customer.regNo}</p>
            </div>
          </div>

          {/* Info Badge */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs text-left space-y-1">
            <div className="flex justify-between text-slate-400"><span className="font-medium">Mobile:</span> <span className="text-white font-mono">{customer.mobile}</span></div>
            <div className="flex justify-between text-slate-400"><span className="font-medium">College/Org:</span> <span className="text-white">{customer.collegeOrCompany || 'N/A'}</span></div>
            <div className="flex justify-between text-slate-400"><span className="font-medium">Mess Plan:</span> <span className="text-emerald-400 font-semibold">{customer.activeSubscriptionPlan || 'No Active Plan'}</span></div>
            {customer.subscriptionEndDate && (
              <div className="flex justify-between text-slate-400"><span className="font-medium">Valid Until:</span> <span className="text-amber-400 font-semibold">{customer.subscriptionEndDate}</span></div>
            )}
          </div>

          {/* Barcode/QR Mock Placeholder */}
          <div className="p-3 bg-white rounded-xl inline-block">
            <div className="font-mono text-xs text-slate-900 font-bold tracking-widest uppercase">
              *{customer.regNo}*
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Download className="w-4 h-4" /> Download PDF ID Card
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default IdCardModal;
