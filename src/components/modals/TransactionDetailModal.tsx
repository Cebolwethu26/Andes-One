import React from 'react';
import { X, Download, Share2, CheckCircle2, ArrowUpRight, ArrowDownLeft, RefreshCw, FileText } from 'lucide-react';
import { useAndes } from '../../context/AndesContext';

export const TransactionDetailModal: React.FC = () => {
  const { selectedTransaction, setSelectedTransaction, formatMoney, addNotification } = useAndes();

  if (!selectedTransaction) return null;

  const isDebit = selectedTransaction.type === 'debit';
  const isExchange = selectedTransaction.type === 'exchange';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0E121B] border border-[#D4AF37]/40 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={() => setSelectedTransaction(null)}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center pb-4 border-b border-[#242D40]">
          <div className="w-12 h-12 rounded-full bg-[#131824] border border-[#242D40] flex items-center justify-center mx-auto mb-3">
            {isDebit && <ArrowUpRight className="w-6 h-6 text-neutral-300" />}
            {!isDebit && !isExchange && <ArrowDownLeft className="w-6 h-6 text-emerald-400" />}
            {isExchange && <RefreshCw className="w-6 h-6 text-[#D4AF37]" />}
          </div>

          <h3 className="text-lg font-serif font-bold text-[#F8F6F0]">
            {selectedTransaction.description}
          </h3>
          <p className="text-xs text-[#A8A69E] mt-0.5">{selectedTransaction.counterparty}</p>

          <div className="mt-3 text-2xl font-bold font-mono tabular-nums text-white">
            {isDebit ? '-' : '+'}
            {formatMoney(selectedTransaction.amount, selectedTransaction.currency, true)}
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{selectedTransaction.status} · Settled</span>
          </div>
        </div>

        {/* Details list */}
        <div className="py-4 space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-[#A8A69E]">Date & Time</span>
            <span className="text-white font-medium">{selectedTransaction.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A8A69E]">Category</span>
            <span className="text-[#D4AF37]">{selectedTransaction.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A8A69E]">Settlement Method</span>
            <span className="text-white text-right max-w-[200px] truncate">{selectedTransaction.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A8A69E]">Network Fee</span>
            <span className="text-emerald-400 font-mono">R0.00 (Zero Markup)</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#242D40]">
            <span className="text-[#A8A69E]">Transaction Reference</span>
            <span className="font-mono text-[#D4AF37]">{selectedTransaction.reference}</span>
          </div>
          {selectedTransaction.notes && (
            <div className="pt-2 border-t border-[#242D40]">
              <span className="text-[10px] text-[#A8A69E] uppercase tracking-wider block mb-1">Audit Ledger Note</span>
              <p className="text-neutral-300 bg-[#131824] p-2 rounded-lg text-[11px] leading-relaxed">
                {selectedTransaction.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              addNotification('Receipt Exported', `Official Andes confirmation for ${selectedTransaction.reference} generated.`, 'info');
            }}
            className="flex-1 py-2 px-3 bg-[#131824] hover:bg-[#1A2130] text-neutral-200 border border-[#242D40] rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>PDF Receipt</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(selectedTransaction.reference);
              addNotification('Copied', `Reference ${selectedTransaction.reference} copied.`, 'info');
            }}
            className="flex-1 py-2 px-3 bg-[#131824] hover:bg-[#1A2130] text-neutral-200 border border-[#242D40] rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Copy Reference</span>
          </button>
        </div>
      </div>
    </div>
  );
};
