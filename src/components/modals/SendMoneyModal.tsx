import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, CheckCircle2, User, Building2, Send, Download } from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { CurrencyCode, Beneficiary } from '../../types';

export const SendMoneyModal: React.FC = () => {
  const {
    isSendModalOpen,
    setIsSendModalOpen,
    wallets,
    beneficiaries,
    executeTransfer,
    formatMoney,
    convertCurrency,
    addNotification,
  } = useAndes();

  const [step, setStep] = useState<'details' | 'review' | 'confirmed'>('details');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(beneficiaries[0] || null);
  const [recipientName, setRecipientName] = useState<string>(beneficiaries[0]?.name || '');
  const [accountNumber, setAccountNumber] = useState<string>(beneficiaries[0]?.accountNumber || '');
  const [bankName, setBankName] = useState<string>(beneficiaries[0]?.bankName || '');
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>(beneficiaries[0]?.currency || 'GBP');
  const [sourceCurrency, setSourceCurrency] = useState<CurrencyCode>('ZAR');
  const [amount, setAmount] = useState<string>('1250');
  const [reference, setReference] = useState<string>('Andes Advisory Retainer');
  const [transferResult, setTransferResult] = useState<{
    reference: string;
    convertedAmount: number;
  } | null>(null);

  if (!isSendModalOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  const sourceWallet = wallets.find((w) => w.currency === sourceCurrency);
  
  // Calculate source deduction
  const sourceDeduction = targetCurrency === sourceCurrency
    ? numericAmount
    : convertCurrency(numericAmount, targetCurrency, sourceCurrency);

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setSelectedBeneficiary(b);
    setRecipientName(b.name);
    setAccountNumber(b.accountNumber);
    setBankName(b.bankName);
    setTargetCurrency(b.currency);
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;
    if (sourceDeduction > (sourceWallet?.balance || 0)) {
      addNotification('Insufficient Balance', `You do not have enough ${sourceCurrency} to fund this transfer.`, 'warning');
      return;
    }
    setStep('review');
  };

  const handleConfirmTransfer = () => {
    const res = executeTransfer({
      recipientName,
      accountNumber,
      bankName,
      currency: targetCurrency,
      amount: numericAmount,
      reference,
      sourceCurrency,
    });

    if (res.success) {
      setTransferResult({
        reference: res.reference,
        convertedAmount: res.convertedAmount,
      });
      setStep('confirmed');
    }
  };

  const handleClose = () => {
    setIsSendModalOpen(false);
    setStep('details');
    setTransferResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0E121B] border border-[#D4AF37]/40 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Details */}
        {step === 'details' && (
          <form onSubmit={handleReview}>
            <div className="mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                CROSS-BORDER SETTLEMENT
              </span>
              <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
                Send Money Worldwide
              </h2>
              <p className="text-xs text-[#A8A69E] mt-1">
                Direct bank rails with instant liquidity verification.
              </p>
            </div>

            {/* Saved Beneficiaries Quick Select */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[#A8A69E] mb-2">
                Quick Select Beneficiary
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {beneficiaries.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBeneficiary(b)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs whitespace-nowrap transition-all ${
                      selectedBeneficiary?.id === b.id
                        ? 'bg-[#1A2130] border-[#D4AF37] text-white shadow-sm'
                        : 'bg-[#131824] border-[#242D40] text-[#A8A69E] hover:text-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${b.avatarColor} text-white flex items-center justify-center font-bold text-[10px]`}>
                      {b.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{b.name}</div>
                      <div className="text-[10px] text-neutral-400">{b.currency}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-3 bg-[#131824] border border-[#242D40] rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#A8A69E] mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-[#1A2130] border border-[#242D40] rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A8A69E] mb-1">Bank or Network</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-[#1A2130] border border-[#242D40] rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#A8A69E] mb-1">IBAN / Account / Mobile Money #</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-[#1A2130] border border-[#242D40] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Transfer Amount & Currency */}
            <div className="bg-[#131824] border border-[#242D40] rounded-xl p-4 mb-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-[#A8A69E] mb-1">
                  <span>Send Amount</span>
                  <span>Recipient Receives</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-2xl font-bold font-mono text-[#F8F6F0] focus:outline-none"
                  />
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
                    className="bg-[#1A2130] border border-[#242D40] text-sm font-semibold text-[#F8F6F0] rounded-lg px-3 py-2 focus:outline-none"
                  >
                    {wallets.map((w) => (
                      <option key={w.currency} value={w.currency}>
                        {w.flag} {w.currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Funding Source Wallet */}
              <div className="pt-3 border-t border-[#242D40] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#A8A69E]">Deduct From Wallet: </span>
                  <select
                    value={sourceCurrency}
                    onChange={(e) => setSourceCurrency(e.target.value as CurrencyCode)}
                    className="bg-[#1A2130] border border-[#242D40] text-xs font-semibold text-[#D4AF37] rounded px-2 py-1 ml-1"
                  >
                    {wallets.map((w) => (
                      <option key={w.currency} value={w.currency}>
                        {w.currency} ({formatMoney(w.balance, w.currency, true)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-[#A8A69E]">Total Deducted:</div>
                  <div className="font-mono font-bold text-[#F8F6F0]">
                    {formatMoney(sourceDeduction, sourceCurrency, true)}
                  </div>
                </div>
              </div>
            </div>

            {/* Reference */}
            <div className="mb-5">
              <label className="block text-[11px] text-[#A8A69E] mb-1">Payment Reference</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. Invoice #4891"
                className="w-full bg-[#131824] border border-[#242D40] rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/3 py-2.5 px-4 bg-[#131824] hover:bg-[#1A2130] text-neutral-300 font-medium text-xs rounded-xl border border-[#242D40] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={numericAmount <= 0 || sourceDeduction > (sourceWallet?.balance || 0)}
                className="w-2/3 py-2.5 px-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#080A0F] font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Review Screen */}
        {step === 'review' && (
          <div>
            <div className="mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                TRANSFER VERIFICATION
              </span>
              <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
                Review Transfer Details
              </h2>
              <p className="text-xs text-[#A8A69E] mt-1">
                Please verify recipient account and clearing rails before dispatch.
              </p>
            </div>

            <div className="p-4 bg-[#131824] border border-[#242D40] rounded-xl space-y-3 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Recipient</span>
                <span className="font-semibold text-white">{recipientName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Institution / Rail</span>
                <span className="text-neutral-300">{bankName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Destination Account</span>
                <span className="font-mono text-neutral-300">{accountNumber}</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-[#242D40]">
                <span className="text-[#A8A69E]">Recipient Amount</span>
                <span className="font-mono font-bold text-[#D4AF37]">
                  {formatMoney(numericAmount, targetCurrency, true)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Deducted from {sourceCurrency}</span>
                <span className="font-mono font-medium text-white">
                  {formatMoney(sourceDeduction, sourceCurrency, true)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Transfer Fee</span>
                <span className="font-mono text-emerald-400 font-medium">R0.00 (Free in Prototype)</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-[#242D40]">
                <span className="text-[#A8A69E]">Reference</span>
                <span className="font-mono text-neutral-300">{reference}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-1/3 py-2.5 px-4 bg-[#131824] hover:bg-[#1A2130] text-neutral-300 font-medium text-xs rounded-xl border border-[#242D40] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="w-2/3 py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:from-[#E5C378] hover:to-[#D4AF37] text-[#080A0F] font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Dispatch</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmed Screen */}
        {step === 'confirmed' && transferResult && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-serif font-bold text-[#F8F6F0]">Transfer Dispatched</h3>
            <p className="text-xs text-[#A8A69E] mt-1">
              Settled via Andes Priority Clearing Protocol
            </p>

            <div className="my-6 p-4 bg-[#131824] border border-[#242D40] rounded-xl text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Beneficiary</span>
                <span className="font-semibold text-white">{recipientName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Amount Dispatched</span>
                <span className="font-mono font-bold text-[#D4AF37]">
                  {formatMoney(numericAmount, targetCurrency, true)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Source Deducted</span>
                <span className="font-mono text-white">
                  {formatMoney(transferResult.convertedAmount, sourceCurrency, true)}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-[#242D40]">
                <span className="text-[#A8A69E]">Transfer Reference</span>
                <span className="font-mono text-[#D4AF37]">{transferResult.reference}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Estimated Arrival</span>
                <span className="text-emerald-400 font-medium">Instant / Real-time</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  addNotification('Receipt Exported', 'Simulated PDF wire confirmation downloaded to local storage.', 'info');
                }}
                className="w-1/2 py-2.5 px-4 bg-[#131824] hover:bg-[#1A2130] text-neutral-300 font-medium text-xs rounded-xl border border-[#242D40] transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Receipt</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-1/2 py-2.5 px-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#080A0F] font-bold text-xs rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
