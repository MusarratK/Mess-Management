import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, AlertCircle } from 'lucide-react';

const QrScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const scannerRef = useRef(null);
  const [manualCode, setManualCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let scanner = null;
    if (isOpen) {
      setErrorMsg('');
      // Initialize Html5QrcodeScanner
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          if (decodedText) {
            scanner.clear();
            onScanSuccess(decodedText);
            onClose();
          }
        },
        (error) => {
          // Silent scan frame errors
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
      }
    };
  }, [isOpen]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      setManualCode('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Counter Barcode / QR Scanner">
      <div className="space-y-4">
        <p className="text-xs text-slate-400 text-center">
          Point device camera at Customer ID Card Barcode/QR Code for instant attendance check-in.
        </p>

        {/* Live Camera Feed Scanner Container */}
        <div id="reader" className="w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-200"></div>

        {/* Manual Barcode Input Fallback */}
        <div className="pt-3 border-t border-slate-800">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Or enter RegNo / Barcode manually..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default QrScannerModal;
