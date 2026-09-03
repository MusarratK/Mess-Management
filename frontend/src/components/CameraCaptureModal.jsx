import React, { useRef, useState, useEffect } from 'react';
import Modal from './Modal';
import { Camera, RefreshCw, Check } from 'lucide-react';

const CameraCaptureModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedPhoto(null);
      setError('');
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 400, height: 400 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setError("Unable to access camera. Please allow permission or upload an image file.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleSnap = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 200, 200);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Capture Customer Photo">
      <div className="space-y-4 text-center">
        {error ? (
          <div className="p-4 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-2xl text-xs">
            {error}
          </div>
        ) : (
          <div className="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden bg-slate-950 border-2 border-indigo-500/40 shadow-inner flex items-center justify-center">
            {!capturedPhoto ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={capturedPhoto} 
                alt="Captured Avatar" 
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!capturedPhoto ? (
            <button
              type="button"
              onClick={handleSnap}
              disabled={!!error}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <Camera className="w-4 h-4" /> Snap Photo
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition"
              >
                <RefreshCw className="w-4 h-4" /> Retake
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-emerald-600/30 transition"
              >
                <Check className="w-4 h-4" /> Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CameraCaptureModal;
