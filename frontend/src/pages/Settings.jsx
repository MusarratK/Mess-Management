import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, ShieldCheck, Check } from 'lucide-react';
import api from '../api/axios';

const Settings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await api.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-400">Manage admin credentials and WhatsApp environment configurations.</p>
      </div>

      {/* Change Password Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" /> Change Admin Password
        </h3>

        {msg && (
          <div className={`p-3.5 rounded-2xl text-xs font-semibold ${
            msg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* System Environment Info */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> WhatsApp Integration Status
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">API Provider:</span>
            <span className="text-white font-semibold">Meta WhatsApp Business Cloud API</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Sandbox Fallback:</span>
            <span className="text-emerald-400 font-semibold">ACTIVE (Logs OTP & Reminders in Console)</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">PDF Generator:</span>
            <span className="text-white font-semibold">OpenPDF 1.3.x & ZXing QR Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
