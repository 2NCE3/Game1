import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'RESET MISSION',
  cancelLabel = 'CANCEL',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-space-900 border border-red-500/40 rounded-xl shadow-2xl overflow-hidden">
        {/* Top header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-red-950/40 border-b border-red-900/40">
          <div className="flex items-center gap-2.5 text-red-400 font-mono text-sm font-semibold tracking-wider uppercase">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>{title}</span>
          </div>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3 font-mono text-xs">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors shadow-lg shadow-red-600/30"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
