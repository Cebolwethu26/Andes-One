import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ArrowDownRight, Sparkles } from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { CurrencyCode } from '../../types';

export const ReceiveMoneyModal: React.FC = () => {
  const {
    isReceiveModalOpen,
    setIsReceiveModalOpen,
    wallets,
    simulateDeposit,
    addNotification,
  } = useAndes();

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('ZAR');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testDepositAmount, setTestDepositAmount] = useState<string>('5000');
  const [testSender, setTestSender] = useState<string>('Zurich Asset Management');

  if (!isReceiveModalOpen) return null;

  const currentWallet = wallets.find((w) => w.currency === selectedCurrency) || wallets[0];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    addNotification('Copied to Clipboard', `${fieldName} copied successfully.`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulateDeposit = () => {
    const amt = parseFloat(testDepositAmount);
    if (!amt || amt <= 0) return;
    simulateDeposit(selectedCurrency, amt, testSender);
    setIsReceiveModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0E121B] border border-[#D4AF37]/40 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsReceiveModalOpen(false)}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
            INWARD CLEARING NETWORK
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
            Receive Global Funds
          </h2>
          <p className="text-xs text-[#A8A69E] mt-1">
            Dedicated multi-currency local virtual accounts in your name.
          </p>
        </div>

        {/* Currency Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131824] border border-[#242D40] rounded-xl mb-5 overflow-x-auto">
          {wallets.map((w) => (
            <button
              key={w.currency}
              onClick={() => setSelectedCurrency(w.currency)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
                selectedCurrency === w.currency
                  ? 'bg-[#D4AF37] text-[#080A0F] font-bold shadow-sm'
                  : 'text-[#A8A69E] hover:text-white hover:bg-[#1A2130]'
              }`}
            >
              <span>{w.flag}</span>
              <span>{w.currency}</span>
            </button>
          ))}
        </div>

        {/* Banking Details Sheet */}
        <div className="bg-[#131824] border border-[#242D40] rounded-xl p-4 space-y-3 mb-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#242D40]">
            <div>
              <div className="text-xs font-semibold text-white">Alexander Sterling</div>
              <div className="text-[10px] text-[#D4AF37]">Beneficiary Name (Personal & Corporate)</div>
            </div>
            <button
              onClick={() => handleCopy('Alexander Sterling', 'Beneficiary Name')}
              className="text-[#A8A69E] hover:text-white p-1 rounded transition-colors"
              title="Copy"
            >
              {copiedField === 'Beneficiary Name' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#A8A69E]">Account Number</div>
              <div className="text-xs font-mono font-medium text-white">{currentWallet.accountNumber}</div>
            </div>
            <button
              onClick={() => handleCopy(currentWallet.accountNumber, 'Account Number')}
              className="text-[#A8A69E] hover:text-white p-1 rounded transition-colors"
            >
              {copiedField === 'Account Number' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Sort / Routing / Clearing */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#A8A69E]">
                {selectedCurrency === 'ZAR' && 'Branch Code / Bank'}
                {selectedCurrency === 'GBP' && 'UK Sort Code'}
                {selectedCurrency === 'USD' && 'ACH & Wire Routing'}
                {selectedCurrency === 'EUR' && 'Clearing Network'}
                {selectedCurrency === 'KES' && 'Paybill / Till Number'}
                {selectedCurrency === 'NGN' && 'NIP Institution Code & Clearing'}
                {selectedCurrency === 'AED' && 'DIFC UAEFTS Clearing'}
              </div>
              <div className="text-xs font-mono font-medium text-white">{currentWallet.sortOrRouting}</div>
            </div>
            <button
              onClick={() => handleCopy(currentWallet.sortOrRouting, 'Routing Code')}
              className="text-[#A8A69E] hover:text-white p-1 rounded transition-colors"
            >
              {copiedField === 'Routing Code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* IBAN / SWIFT */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#A8A69E]">IBAN / SWIFT BIC</div>
              <div className="text-xs font-mono font-medium text-white">{currentWallet.ibanOrSwift}</div>
            </div>
            <button
              onClick={() => handleCopy(currentWallet.ibanOrSwift, 'IBAN / SWIFT')}
              className="text-[#A8A69E] hover:text-white p-1 rounded transition-colors"
            >
              {copiedField === 'IBAN / SWIFT' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Prototype Deposit Simulator (Interactive Testing) */}
        <div className="bg-[#080A0F] border border-[#D4AF37]/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Prototype Test Inward Deposit</span>
          </div>
          <p className="text-[11px] text-[#A8A69E] mb-3">
            Simulate receiving inbound liquidity directly into your {selectedCurrency} balance to test real-time portfolio updates.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-[10px] text-neutral-400 mb-1">Sender Entity</label>
              <input
                type="text"
                value={testSender}
                onChange={(e) => setTestSender(e.target.value)}
                className="w-full bg-[#131824] border border-[#242D40] rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-neutral-400 mb-1">Amount ({selectedCurrency})</label>
              <input
                type="number"
                value={testDepositAmount}
                onChange={(e) => setTestDepositAmount(e.target.value)}
                className="w-full bg-[#131824] border border-[#242D40] rounded px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateDeposit}
            className="w-full py-2 px-3 bg-[#1A2130] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] hover:text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Simulate Credit (+{testDepositAmount} {selectedCurrency})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
