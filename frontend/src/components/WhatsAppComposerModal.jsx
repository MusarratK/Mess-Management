import React, { useState } from 'react';
import Modal from './Modal';
import { MessageSquare, Send } from 'lucide-react';
import api from '../api/axios';

const WhatsAppComposerModal = ({ isOpen, onClose, defaultMobile = '', defaultCustomerName = '' }) => {
  const [mobile, setMobile] = useState(defaultMobile);
  const [message, setMessage] = useState(
    defaultCustomerName ? `Hello ${defaultCustomerName}, greeting from Mess Management!` : ''
  );
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!mobile || !message) return;
    setSending(true);
    setFeedback(null);
    try {
      await api.post('/notifications/whatsapp/send', {
        recipientMobile: mobile,
        messageText: message
      });
      setFeedback({ type: 'success', text: 'WhatsApp message dispatched successfully!' });
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1500);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to send WhatsApp message.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send WhatsApp Message">
      <form onSubmit={handleSend} className="space-y-4">
        {feedback && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${feedback.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'}`}>
            {feedback.text}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Recipient Mobile Number</label>
          <input
            type="text"
            required
            placeholder="e.g. 9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Message Text</label>
          <textarea
            rows={4}
            required
            placeholder="Write your WhatsApp message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send WhatsApp'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WhatsAppComposerModal;
