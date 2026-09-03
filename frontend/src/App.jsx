import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import QrScannerModal from './components/QrScannerModal';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Plans from './pages/Plans';
import Subscriptions from './pages/Subscriptions';
import Guests from './pages/Guests';
import Attendance from './pages/Attendance';
import Ledger from './pages/Ledger';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import WhatsAppCenter from './pages/WhatsAppCenter';
import Settings from './pages/Settings';
import api from './api/axios';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleQrScanSuccess = async (qrCode) => {
    try {
      const res = await api.post('/attendance/scan', { qrCode, shift: 'BOTH' });
      alert(res.data?.message || "Check-In Verified!");
    } catch (err) {
      alert(err.response?.data?.message || "Counter check-in failed!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenQrScanner={() => setQrModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Counter Scan Modal */}
      <QrScannerModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onScanSuccess={handleQrScanSuccess}
      />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/customers" element={<ProtectedLayout><Customers /></ProtectedLayout>} />
          <Route path="/plans" element={<ProtectedLayout><Plans /></ProtectedLayout>} />
          <Route path="/subscriptions" element={<ProtectedLayout><Subscriptions /></ProtectedLayout>} />
          <Route path="/guests" element={<ProtectedLayout><Guests /></ProtectedLayout>} />
          <Route path="/attendance" element={<ProtectedLayout><Attendance /></ProtectedLayout>} />
          <Route path="/ledger" element={<ProtectedLayout><Ledger /></ProtectedLayout>} />
          <Route path="/expenses" element={<ProtectedLayout><Expenses /></ProtectedLayout>} />
          <Route path="/reports" element={<ProtectedLayout><Reports /></ProtectedLayout>} />
          <Route path="/whatsapp" element={<ProtectedLayout><WhatsAppCenter /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
