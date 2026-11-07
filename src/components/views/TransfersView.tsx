import React, { useState } from 'react';
import {
  Send,
  UserPlus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  User,
  ArrowRight,
  Globe2,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { Beneficiary } from '../../types';

export const TransfersView: React.FC = () => {
  const {
    beneficiaries,
    setIsSendModalOpen,
    formatMoney,
    transactions,
    addNotification,
  } = useAndes();

  const [showAddBeneficiary, setShowAddBeneficiary] = useState<boolean>(false);
  const [newBenName, setNewBenName] = useState<string>('');
  const [newBenBank, setNewBenBank] = useState<string>('');
  const [newBenAcc, setNewBenAcc] = useState<string>('');

  const pastTransfers = transactions.filter((t) => t.category === 'Transfer' || t.category === 'Business');

  const handleCreateBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName) return;
    addNotification(
      'Beneficiary Saved to Vault',
      `${newBenName} verified and whitelisted for instant priority transfers.`,
      'success'
    );
    setShowAddBeneficiary(false);
    setNewBenName('');
    setNewBenBank('');
    setNewBenAcc('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
            GLOBAL PAYMENT RAILS
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
            Cross-Border Wire & Settlements
          </h2>
          <p className="text-xs text-[#A8A69E] mt-1">
            Dispatch local EFTs, SEPA, UK Faster Payments, Fedwire, and M-Pesa in seconds.
          </p>
        </div>

        <button
          onClick={() => setIsSendModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C378] text-[#080A0F] font-bold text-xs rounded-xl shadow-md transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Grid: Beneficiaries & Transfer Rails */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Saved Beneficiary Directory (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E121B] border border-[#242D40] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#242D40]">
            <div>
              <h3 className="text-sm font-semibold text-[#F8F6F0]">Saved Beneficiaries</h3>
              <div className="text-xs text-[#A8A69E]">
                Whitelisted recipients with instant settlement authorization
              </div>
            </div>

            <button
              onClick={() => setShowAddBeneficiary(!showAddBeneficiary)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131824] hover:bg-[#1A2130] text-[#D4AF37] border border-[#242D40] rounded-lg text-xs font-medium transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Recipient</span>
            </button>
          </div>

          {/* Add Beneficiary Inline Form */}
          {showAddBeneficiary && (
            <form onSubmit={handleCreateBeneficiary} className="mb-4 p-4 bg-[#131824] border border-[#D4AF37]/40 rounded-xl space-y-3">
              <div className="text-xs font-semibold text-white">Add New Global Beneficiary</div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Legal Name"
                  required
                  value={newBenName}
                  onChange={(e) => setNewBenName(e.target.value)}
                  className="bg-[#1A2130] border border-[#242D40] rounded px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Bank or Network (e.g. Barclays, Standard Bank)"
                  required
                  value={newBenBank}
                  onChange={(e) => setNewBenBank(e.target.value)}
                  className="bg-[#1A2130] border border-[#242D40] rounded px-3 py-1.5 text-xs text-white"
                />
              </div>
              <input
                type="text"
                placeholder="IBAN / Account # / M-Pesa Number"
                required
                value={newBenAcc}
                onChange={(e) => setNewBenAcc(e.target.value)}
                className="w-full bg-[#1A2130] border border-[#242D40] rounded px-3 py-1.5 text-xs text-white font-mono"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddBeneficiary(false)}
                  className="px-3 py-1 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#D4AF37] text-[#080A0F] font-bold text-xs rounded"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          )}

          {/* Beneficiary List */}
          <div className="space-y-3">
            {beneficiaries.map((b) => (
              <div
                key={b.id}
                className="p-3.5 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${b.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-white group-hover:text-[#D4AF37] transition-colors">
                      {b.name}
                    </div>
                    <div className="text-[11px] text-[#A8A69E] mt-0.5">
                      {b.bankName} · <span className="font-mono">{b.accountNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20">
                    {b.currency}
                  </span>
                  <button
                    onClick={() => setIsSendModalOpen(true)}
                    className="p-2 text-neutral-400 hover:text-[#D4AF37] bg-[#0E121B] rounded-lg transition-colors"
                    title="Send to this beneficiary"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Payment Rails & Transfer History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Global Clearing Rails */}
          <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F8F6F0] mb-3">
              Active Clearing Rails
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#131824] border border-[#242D40] rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Andes Instant Liquidity Bridge</div>
                  <div className="text-[10px] text-[#A8A69E]">Sub-second intra-network clearing</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">0s Realtime</span>
              </div>

              <div className="p-3 bg-[#131824] border border-[#242D40] rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">UK Faster Payments & BACS</div>
                  <div className="text-[10px] text-[#A8A69E]">Direct Bank of England settlement</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Instant</span>
              </div>

              <div className="p-3 bg-[#131824] border border-[#242D40] rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">SEPA Instant (Eurozone)</div>
                  <div className="text-[10px] text-[#A8A69E]">Pan-European instant credit transfer</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">&lt; 10 sec</span>
              </div>

              <div className="p-3 bg-[#131824] border border-[#242D40] rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Safaricom M-Pesa Daraja B2C</div>
                  <div className="text-[10px] text-[#A8A69E]">Kenya mobile wallet direct credit</div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Instant</span>
              </div>

              <div className="p-3 bg-[#131824] border border-[#242D40] rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">SWIFT GPI Priority Wire</div>
                  <div className="text-[10px] text-[#A8A69E]">Worldwide correspondent banking</div>
                </div>
                <span className="text-[10px] text-neutral-300 font-mono">Same-day</span>
              </div>
            </div>
          </div>

          {/* Past Transfers */}
          <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F8F6F0] mb-3">
              Transfer Activity
            </h3>

            <div className="space-y-2.5 text-xs">
              {pastTransfers.map((tx) => (
                <div
                  key={tx.id}
                  className="p-2.5 bg-[#131824] border border-[#242D40] rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-white">{tx.counterparty}</div>
                    <div className="text-[10px] text-[#A8A69E]">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white tabular-nums">
                      {formatMoney(tx.amount, tx.currency, true)}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
