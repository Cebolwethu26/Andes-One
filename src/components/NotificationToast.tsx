import React from 'react';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useAndes } from '../context/AndesContext';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useAndes();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 bg-[#0E121B]/95 backdrop-blur-md border border-[#242D40] hover:border-[#D4AF37]/50 rounded-xl shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="shrink-0 mt-0.5">
            {n.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {n.type === 'info' && <Info className="w-4 h-4 text-[#D4AF37]" />}
            {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
          </div>

          <div className="flex-1 text-xs">
            <div className="font-semibold text-white tracking-wide">{n.title}</div>
            <div className="text-[#A8A69E] text-[11px] mt-0.5 leading-relaxed">{n.message}</div>
          </div>

          <button
            onClick={() => dismissNotification(n.id)}
            className="shrink-0 text-neutral-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
