import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, CheckCircle2, Building, Smartphone, Wallet, Download } from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { CurrencyCode } from '../../types';

export const WithdrawMoneyModal: React.FC = () => {
  const {
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    wallets,
    executeWithdrawal,
    formatMoney,
    addNotification,
  } = useAndes();

  const [currency, setCurrency] = useState<CurrencyCode>('ZAR');
  const [amount, setAmount] = useState<string>('2500');
  const [method, setMethod] = useState<'bank' | 'mobile' | 'vault'>('bank');
  const [destinationName, setDestinationName] = useState<string>('Standard Bank Private Client');
  const [destinationAccount, setDestinationAccount] = useState<string>('•••• 9942');
  const [step, setStep] = useState<'form' | 'review' | 'confirmed'>('form');
  const [withdrawalResult, setWithdrawalResult] = useState<{ reference: string } | null>(null);

  if (!isWithdrawModalOpen) return null;

  const activeWallet = wallets.find((w) => w.currency === currency) || wallets[0];
  const numericAmount = parseFloat(amount) || 0;
  const isInsufficient = numericAmount > activeWallet.balance;

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0 || isInsufficient) return;
    setStep('review');
  };

  const handleConfirm = () => {
    const res = executeWithdrawal({
      currency,
      amount: numericAmount,
      destination: destinationName,
      account: destinationAccount,
      method:
        method === 'bank'
          ? `Local Direct Settlement Rail (${currency})`
          : method === 'mobile'
          ? 'Mobile Liquidity Settlement'
          : 'Andes Private Vault Cash Order',
    });

    if (res.success) {
      setWithdrawalResult({ reference: res.reference });
      setStep('confirmed');
    }
  };

  const handleClose = () => {
    setIsWithdrawModalOpen(false);
    setStep('form');
    setWithdrawalResult(null);
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

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <form onSubmit={handleReview}>
            <div className="mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                LIQUIDITY OUTWARD RAILS
              </span>
              <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
                Simulated Withdrawal
              </h2>
              <p className="text-xs text-[#A8A69E] mt-1">
                Deduct funds from any of your 7 multi-currency vaults into an external account or cash pickup.
              </p>
            </div>

            {/* Currency selector tabs */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[#A8A69E] mb-1.5">
                Withdrawal Source Wallet
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 p-1 bg-[#131824] border border-[#242D40] rounded-xl">
                {wallets.map((w) => (
                  <button
                    key={w.currency}
                    type="button"
                    onClick={() => setCurrency(w.currency)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-all ${
                      currency === w.currency
                        ? 'bg-[#D4AF37] text-[#080A0F] font-bold shadow-sm'
                        : 'text-[#A8A69E] hover:text-white hover:bg-[#1A2130]'
                    }`}
                  >
                    <span className="text-sm">{w.flag}</span>
                    <span className="text-[11px] font-mono mt-0.5">{w.currency}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <div className="bg-[#131824] border border-[#242D40] rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between text-xs text-[#A8A69E] mb-2">
                <span>Withdrawal Amount</span>
                <span>
                  Available Balance:{' '}
                  <span className="font-mono text-white font-semibold">
                    {formatMoney(activeWallet.balance, currency, true)}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-bold font-mono text-[#F8F6F0] focus:outline-none"
                />
                <span className="font-mono font-bold text-lg text-[#D4AF37] shrink-0">
                  {currency}
                </span>
              </div>

              {isInsufficient && (
                <div className="text-xs text-rose-400 mt-2 font-medium">
                  Amount exceeds current wallet balance of {formatMoney(activeWallet.balance, currency, true)}.
                </div>
              )}
            </div>

            {/* Destination Payout Method */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[#A8A69E] mb-1.5">
                Payout Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('bank');
                    setDestinationName('Standard Bank Private Client');
                    setDestinationAccount('•••• 9942');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'bank'
                      ? 'bg-[#1A2130] border-[#D4AF37] text-white shadow-sm'
                      : 'bg-[#131824] border-[#242D40] text-[#A8A69E] hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4 text-[#D4AF37] mb-1" />
                  <div className="text-xs font-semibold">Bank Account</div>
                  <div className="text-[10px] text-neutral-400">Local EFT / Wire</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('mobile');
                    setDestinationName('M-Pesa / Mobile Money Wallet');
                    setDestinationAccount('+254 712 345 678');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'mobile'
                      ? 'bg-[#1A2130] border-[#D4AF37] text-white shadow-sm'
                      : 'bg-[#131824] border-[#242D40] text-[#A8A69E] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#D4AF37] mb-1" />
                  <div className="text-xs font-semibold">Mobile Wallet</div>
                  <div className="text-[10px] text-neutral-400">Daraja / NIP</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('vault');
                    setDestinationName('Andes Private Vault Cash Courier');
                    setDestinationAccount('Cape Town / DIFC Dubai Desk');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'vault'
                      ? 'bg-[#1A2130] border-[#D4AF37] text-white shadow-sm'
                      : 'bg-[#131824] border-[#242D40] text-[#A8A69E] hover:text-white'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-[#D4AF37] mb-1" />
                  <div className="text-xs font-semibold">Private Cash</div>
                  <div className="text-[10px] text-neutral-400">Vault Handover</div>
                </button>
              </div>
            </div>

            {/* Destination Coordinates */}
            <div className="bg-[#131824] border border-[#242D40] rounded-xl p-3.5 space-y-2.5 mb-5">
              <div className="text-xs font-semibold text-white">Destination Details</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-[#A8A69E] mb-1">Beneficiary Entity</label>
                  <input
                    type="text"
                    required
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    className="w-full bg-[#1A2130] border border-[#242D40] rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#A8A69E] mb-1">Account / IBAN / Phone</label>
                  <input
                    type="text"
                    required
                    value={destinationAccount}
                    onChange={(e) => setDestinationAccount(e.target.value)}
                    className="w-full bg-[#1A2130] border border-[#242D40] rounded px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
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
                disabled={numericAmount <= 0 || isInsufficient}
                className="w-2/3 py-2.5 px-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#080A0F] font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Review Withdrawal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW */}
        {step === 'review' && (
          <div>
            <div className="mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                AUTHORIZATION REVIEW
              </span>
              <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
                Confirm Simulated Withdrawal
              </h2>
              <p className="text-xs text-[#A8A69E] mt-1">
                Please verify destination details before releasing liquidity.
              </p>
            </div>

            <div className="p-4 bg-[#131824] border border-[#242D40] rounded-xl space-y-3 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A8A69E]">Deducted From</span>
                <span className="font-semibold text-white">
                  {activeWallet.name} ({currency})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A69E]">Withdrawal Amount</span>
                <span className="font-mono font-bold text-[#D4AF37] text-sm">
                  {formatMoney(numericAmount, currency, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A69E]">Destination</span>
                <span className="text-white">{destinationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A69E]">Account Identifier</span>
                <span className="font-mono text-neutral-300">{destinationAccount}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#242D40]">
                <span className="text-[#A8A69E]">Clearing Fee</span>
                <span className="font-mono text-emerald-400">R0.00 (Demonstration Free)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A69E]">Wallet Balance After</span>
                <span className="font-mono text-white">
                  {formatMoney(activeWallet.balance - numericAmount, currency, true)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-1/3 py-2.5 px-4 bg-[#131824] hover:bg-[#1A2130] text-neutral-300 font-medium text-xs rounded-xl border border-[#242D40] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="w-2/3 py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:from-[#E5C378] hover:to-[#D4AF37] text-[#080A0F] font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Release</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMED */}
        {step === 'confirmed' && withdrawalResult && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-serif font-bold text-[#F8F6F0]">Withdrawal Dispatched</h3>
            <p className="text-xs text-[#A8A69E] mt-1">
              Your {currency} multi-currency ledger has been updated immediately.
            </p>

            <div className="my-6 p-4 bg-[#131824] border border-[#242D40] rounded-xl text-left space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A8A69E]">Amount</span>
                <span className="font-mono font-bold text-[#D4AF37]">
                  {formatMoney(numericAmount, currency, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A69E]">Destination</span>
                <span className="font-semibold text-white">{destinationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A69E]">Reference ID</span>
                <span className="font-mono text-[#D4AF37]">{withdrawalResult.reference}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#242D40]">
                <span className="text-[#A8A69E]">New {currency} Balance</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {formatMoney(activeWallet.balance, currency, true)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  addNotification('Receipt Exported', `Simulated receipt for ${withdrawalResult.reference} generated.`, 'info');
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
