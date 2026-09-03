import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import WhatsAppComposerModal from '../components/WhatsAppComposerModal';
import { 
  Users, 
  Cake, 
  UserPlus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Utensils, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/summary');
      if (res.data?.data) {
        setSummary(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard summary fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = (mobile, name) => {
    setSelectedMobile(mobile);
    setSelectedName(name);
    setComposerOpen(true);
  };

  const triggerDueReminders = async () => {
    try {
      const res = await api.post('/notifications/reminders/due-payments');
      alert(res.data?.message || 'Payment reminders sent via WhatsApp!');
    } catch (err) {
      alert("Failed to dispatch WhatsApp reminders.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs text-slate-400">Loading dashboard overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Live Operational Metrics
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Mess Management Overview</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time attendance, subscription status, and billing tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <UserPlus className="w-4 h-4" /> Register Customer
          </button>
          <button
            onClick={triggerDueReminders}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
          >
            <MessageSquare className="w-4 h-4" /> Broadcast Dues Reminder
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Customers"
          value={summary?.totalActiveCustomers || 0}
          subtitle={`${summary?.unverifiedCustomersCount || 0} Unverified OTP`}
          icon={Users}
          color="indigo"
          actionLabel="View Roster"
          onAction={() => navigate('/customers')}
        />
        <StatCard
          title="Today's Birthdays"
          value={summary?.todayBirthdaysCount || 0}
          subtitle="Send Birthday Greetings"
          icon={Cake}
          color="rose"
          actionLabel="Greet on WhatsApp"
          onAction={() => navigate('/whatsapp')}
        />
        <StatCard
          title="Mess Ending Soon"
          value={summary?.subscriptionsEndingSoonCount || 0}
          subtitle="Ending in 5 Days"
          icon={Clock}
          color="amber"
          actionLabel="Renew Subscriptions"
          onAction={() => navigate('/subscriptions')}
        />
        <StatCard
          title="Today's Attendance"
          value={summary?.todayAttendanceCount || 0}
          subtitle={`Guest Revenue: ₹${summary?.todayGuestRevenue || 0}`}
          icon={CheckCircle2}
          color="emerald"
          actionLabel="Attendance Register"
          onAction={() => navigate('/attendance')}
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Outstanding Payments & Subscriptions Ending */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscriptions Ending Soon Table */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Subscriptions Ending in 5 Days
              </h3>
              <button onClick={() => navigate('/subscriptions')} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">View All &rarr;</button>
            </div>

            {summary?.subscriptionsEndingSoon?.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No subscriptions ending in the next 5 days.</p>
            ) : (
              <div className="space-y-2">
                {summary?.subscriptionsEndingSoon?.map((sub) => (
                  <div key={sub.id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{sub.customerName} <span className="text-slate-400 font-mono">({sub.customerRegNo})</span></div>
                      <div className="text-[11px] text-slate-400">Plan: <span className="text-indigo-400">{sub.planName}</span> | Ends: <span className="text-amber-400 font-semibold">{sub.endDate}</span></div>
                    </div>
                    <button
                      onClick={() => handleSendReminder(sub.customerMobile, sub.customerName)}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl font-semibold transition flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> Remind
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outstanding Payments List */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" /> Outstanding Customer Balances
              </h3>
              <button onClick={() => navigate('/ledger')} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">View Ledger &rarr;</button>
            </div>

            {summary?.outstandingPaymentsCustomers?.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No pending customer balances!</p>
            ) : (
              <div className="space-y-2">
                {summary?.outstandingPaymentsCustomers?.slice(0, 5).map((cust) => (
                  <div key={cust.id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{cust.name} <span className="text-slate-400 font-mono">({cust.mobile})</span></div>
                      <div className="text-[11px] text-slate-400">Reg: {cust.regNo}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-rose-400">₹{cust.currentBalance}</span>
                      <button
                        onClick={() => handleSendReminder(cust.mobile, cust.name)}
                        className="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl transition"
                        title="Send WhatsApp Payment Due Alert"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Active Plans List */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-indigo-400" /> Active Mess Subscription Plans
              </h3>
              <button onClick={() => navigate('/plans')} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">Manage &rarr;</button>
            </div>

            <div className="space-y-3">
              {summary?.activePlans?.map((plan) => (
                <div key={plan.id} className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 hover:border-indigo-500/30 transition space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-white">{plan.name}</h4>
                    <span className="text-xs font-bold text-emerald-400 font-mono">₹{plan.rate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Duration: {plan.fromDay} - {plan.toDay} Days</p>
                  <button
                    onClick={() => navigate('/subscriptions')}
                    className="w-full mt-2 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                  >
                    Assign to Customer <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Message Composer Modal */}
      <WhatsAppComposerModal
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultMobile={selectedMobile}
        defaultCustomerName={selectedName}
      />
    </div>
  );
};

export default Dashboard;
