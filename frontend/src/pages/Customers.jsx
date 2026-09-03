import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import CameraCaptureModal from '../components/CameraCaptureModal';
import IdCardModal from '../components/IdCardModal';
import WhatsAppComposerModal from '../components/WhatsAppComposerModal';
import { 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Camera, 
  CreditCard, 
  Trash2, 
  RotateCcw, 
  MessageSquare, 
  QrCode, 
  Edit,
  PhoneCall,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../api/axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tabStatus, setTabStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    regNo: '',
    name: '',
    email: '',
    mobile: '',
    fatherMobile: '',
    gender: 'MALE',
    collegeOrCompany: '',
    academicYear: '',
    branch: '',
    address: '',
    city: '',
    dob: '',
    reference: '',
    openingBalance: 0,
    photoUrl: ''
  });

  const [otpInput, setOtpInput] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [page, tabStatus, search]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers', {
        params: { page, size: 10, search, status: tabStatus }
      });
      if (res.data?.data) {
        setCustomers(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (err) {
      console.error("Fetch customers error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      id: null,
      regNo: '',
      name: '',
      email: '',
      mobile: '',
      fatherMobile: '',
      gender: 'MALE',
      collegeOrCompany: '',
      academicYear: '',
      branch: '',
      address: '',
      city: '',
      dob: '',
      reference: '',
      openingBalance: 0,
      photoUrl: ''
    });
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setFormData({
      id: cust.id,
      regNo: cust.regNo,
      name: cust.name,
      email: cust.email || '',
      mobile: cust.mobile,
      fatherMobile: cust.fatherMobile || '',
      gender: cust.gender || 'MALE',
      collegeOrCompany: cust.collegeOrCompany || '',
      academicYear: cust.academicYear || '',
      branch: cust.branch || '',
      address: cust.address || '',
      city: cust.city || '',
      dob: cust.dob || '',
      reference: cust.reference || '',
      openingBalance: cust.openingBalance || 0,
      photoUrl: cust.photoUrl || ''
    });
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/customers/${formData.id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setFormModalOpen(false);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save customer');
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm("Are you sure you want to soft-delete this customer?")) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        alert("Failed to delete customer");
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.post(`/customers/${id}/restore`);
      fetchCustomers();
    } catch (err) {
      alert("Failed to restore customer");
    }
  };

  const handleSendOtp = async (cust) => {
    setSelectedCustomer(cust);
    try {
      await api.post(`/customers/${cust.id}/otp/send`);
      setOtpModalOpen(true);
    } catch (err) {
      alert("Failed to send WhatsApp OTP");
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !otpInput) return;
    setOtpVerifying(true);
    try {
      await api.post(`/customers/${selectedCustomer.id}/otp/verify`, {
        mobile: selectedCustomer.mobile,
        otpCode: otpInput
      });
      setOtpModalOpen(false);
      setOtpInput('');
      fetchCustomers();
      alert("WhatsApp OTP Verified Successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP Code");
    } finally {
      setOtpVerifying(false);
    }
  };

  const columns = [
    {
      header: 'Customer',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-indigo-400">
            {row.photoUrl ? (
              <img src={row.photoUrl} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              row.name.charAt(0)
            )}
          </div>
          <div>
            <div className="font-semibold text-white leading-tight">{row.name}</div>
            <div className="text-[11px] font-mono text-indigo-400">{row.regNo}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      cell: (row) => (
        <div>
          <div className="font-mono text-xs text-slate-200">{row.mobile}</div>
          {row.fatherMobile && <div className="text-[10px] text-slate-500">Father: {row.fatherMobile}</div>}
        </div>
      )
    },
    {
      header: 'College / Company',
      cell: (row) => (
        <span className="text-xs text-slate-300">{row.collegeOrCompany || '-'}</span>
      )
    },
    {
      header: 'Status & Verification',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.verified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          ) : (
            <button
              onClick={() => handleSendOtp(row)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[10px] font-semibold transition"
            >
              <AlertCircle className="w-3 h-3" /> Verify OTP
            </button>
          )}
        </div>
      )
    },
    {
      header: 'Mess Subscription',
      cell: (row) => (
        <div>
          {row.activeSubscriptionPlan ? (
            <span className="font-semibold text-xs text-indigo-400">{row.activeSubscriptionPlan}</span>
          ) : (
            <span className="text-xs text-slate-500 italic">No Active Plan</span>
          )}
        </div>
      )
    },
    {
      header: 'Running Balance',
      cell: (row) => (
        <span className={`font-mono text-xs font-bold ${row.currentBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
          ₹{row.currentBalance || 0}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedCustomer(row); setIdCardModalOpen(true); }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition"
            title="Print ID Card PDF"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Edit Customer"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.deleted ? (
            <button
              onClick={() => handleRestore(row.id)}
              className="p-1.5 bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60 rounded-lg transition"
              title="Restore Customer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleSoftDelete(row.id)}
              className="p-1.5 bg-rose-950/60 text-rose-400 hover:bg-rose-900/60 rounded-lg transition"
              title="Soft Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Customer Roster</h2>
          <p className="text-xs text-slate-400">Manage member profiles, WhatsApp OTP verification, and ID cards.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <UserPlus className="w-4 h-4" /> Register New Customer
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'unverified', 'deleted'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setTabStatus(tab); setPage(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                tabStatus === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab} Customers
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search name, mobile, regNo..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Roster Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        pageNo={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        emptyMessage="No customer records found."
      />

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={formData.id ? 'Edit Customer Profile' : 'Register New Customer'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Avatar Photo Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-2xl text-indigo-400">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                formData.name ? formData.name.charAt(0) : '?'
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => setCameraModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl text-xs font-semibold border border-slate-700 transition"
              >
                <Camera className="w-4 h-4" /> Capture WebCam Photo
              </button>
              <p className="text-[10px] text-slate-500 mt-1">Live camera snapshot or upload base64 image</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Mobile Number (WhatsApp) *</label>
              <input
                type="text"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Registration No / Barcode</label>
              <input
                type="text"
                placeholder="Auto-generated if empty"
                value={formData.regNo}
                onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Father / Guardian Mobile</label>
              <input
                type="text"
                value={formData.fatherMobile}
                onChange={(e) => setFormData({ ...formData, fatherMobile: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">College / Company</label>
              <input
                type="text"
                value={formData.collegeOrCompany}
                onChange={(e) => setFormData({ ...formData, collegeOrCompany: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Opening Balance (₹)</label>
              <input
                type="number"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setFormModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
            >
              {formData.id ? 'Update Customer' : 'Save & Trigger WhatsApp OTP'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={(photoData) => setFormData({ ...formData, photoUrl: photoData })}
      />

      {/* ID Card Badge Modal */}
      <IdCardModal
        isOpen={idCardModalOpen}
        onClose={() => setIdCardModalOpen(false)}
        customer={selectedCustomer}
      />

      {/* WhatsApp OTP Verification Modal */}
      <Modal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        title="WhatsApp OTP Verification"
      >
        <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">
            An OTP code has been dispatched via WhatsApp to <span className="font-mono text-white">{selectedCustomer?.mobile}</span>. Enter code below to verify:
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Enter 6-digit OTP Code</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. 123456"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full text-center font-mono tracking-widest text-lg bg-slate-950 border border-slate-800 rounded-xl py-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOtpModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={otpVerifying}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/30"
            >
              {otpVerifying ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
