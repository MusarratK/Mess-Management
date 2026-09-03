import React, { useState } from 'react';
import { MessageSquare, Send, Users, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const WhatsAppCenter = () => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [broadcastGroup, setBroadcastGroup] = useState('ALL');
  const [sending, setSending] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleSingleSend = async (e) => {
    e.preventDefault();
    if (!recipient || !message) return;
    setSending(true);
    setStatusText('');
    try {
      await api.post('/notifications/whatsapp/send', {
        recipientMobile: recipient,
        messageText: message
      });
      setStatusText('WhatsApp message sent successfully!');
      setMessage('');
    } catch (err) {
      setStatusText('Failed to send WhatsApp message.');
    } finally {
      setSending(false);
    }
  };

  const handleBroadcast = async () => {
    if (!message) {
      alert("Please write a message text for broadcast.");
      return;
    }
    setSending(true);
    setStatusText('');
    try {
      const res = await api.post('/notifications/whatsapp/broadcast', {
        filterGroup: broadcastGroup,
        messageText: message
      });
      setStatusText(res.data?.message || 'Broadcast message sent!');
    } catch (err) {
      setStatusText('Failed to dispatch broadcast.');
    } finally {
      setSending(false);
    }
  };

  const handleDuePaymentReminders = async () => {
    setSending(true);
    try {
      const res = await api.post('/notifications/reminders/due-payments');
      setStatusText(res.data?.message || 'Payment reminders sent!');
    } catch (err) {
      setStatusText('Failed to send payment reminders.');
    } finally {
      setSending(false);
    }
  };

  const handleMessEndingAlerts = async () => {
    setSending(true);
    try {
      const res = await api.post('/notifications/reminders/mess-ending');
      setStatusText(res.data?.message || 'Mess ending alerts sent!');
    } catch (err) {
      setStatusText('Failed to send mess ending alerts.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">WhatsApp Notification Center</h2>
        <p className="text-xs text-slate-400">Dispatch direct WhatsApp messages, group broadcasts, and automated reminders.</p>
      </div>

      {statusText && (
        <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-semibold text-center shadow-lg">
          {statusText}
        </div>
      )}

      {/* Automated Triggers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Outstanding Dues Reminders</h4>
              <p className="text-xs text-slate-400">Send WhatsApp balance alerts to customers with balance &gt; 0</p>
            </div>
          </div>
          <button
            onClick={handleDuePaymentReminders}
            disabled={sending}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
          >
            Dispatch
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Mess Ending Alerts</h4>
              <p className="text-xs text-slate-400">Send alerts for subscriptions ending in next 5 days</p>
            </div>
          </div>
          <button
            onClick={handleMessEndingAlerts}
            disabled={sending}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
          >
            Dispatch
          </button>
        </div>
      </div>

      {/* Message Composer & Broadcast */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" /> WhatsApp Message Composer & Broadcast
        </h3>

        <form onSubmit={handleSingleSend} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Direct Recipient Mobile (for single send)</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Broadcast Target Group</label>
              <select
                value={broadcastGroup}
                onChange={(e) => setBroadcastGroup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Active Customers</option>
                <option value="UNVERIFIED">Unverified OTP Customers</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Message Content *</label>
            <textarea
              rows={4}
              required
              placeholder="Write your WhatsApp announcement or reminder message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleBroadcast}
              disabled={sending}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Send Broadcast to Group
            </button>
            <button
              type="submit"
              disabled={sending || !recipient}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Direct Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppCenter;
