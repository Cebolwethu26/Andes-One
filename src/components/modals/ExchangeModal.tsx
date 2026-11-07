import React, { useState, useEffect } from 'react';
import { X, ArrowDownUp, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { CurrencyCode } from '../../types';

export const ExchangeModal: React.FC = () => {
  const {
    isExchangeModalOpen,
    setIsExchangeModalOpen,
    wallets,
    executeExchange,
    formatMoney,
    convertCurrency,
  } = useAndes();

  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('ZAR');
  const [fromAmount, setFromAmount] = useState<string>('500');
  const [rateLockCountdown, setRateLockCountdown] = useState<number>(30);
  const [exchangeResult, setExchangeResult] = useState<{
    success: boolean;
    rate: number;
    amountTo: number;
    reference: string;
  } | null>(null);

  // Rate countdown simulation
  useEffect(() => {
    if (!isExchangeModalOpen) return;
    const timer = setInterval(() => {
      setRateLockCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isExchangeModalOpen]);

  if (!isExchangeModalOpen) return null;

  const fromWallet = wallets.find((w) => w.currency === fromCurrency);
  const toWallet = wallets.find((w) => w.currency === toCurrency);

  const numericFrom = parseFloat(fromAmount) || 0;
  const currentRate = convertCurrency(1, fromCurrency, toCurrency);
  const calculatedToAmount = numericFrom * currentRate;

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConfirm = () => {
    if (numericFrom <= 0) return;
    const res = executeExchange(fromCurrency, toCurrency, numericFrom);
    if (res.success) {
      setExchangeResult(res);
    }
  };

  const handleClose = () => {
    setIsExchangeModalOpen(false);
    setExchangeResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0E121B] border border-[#D4AF37]/40 rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {exchangeResult ? (
          /* Confirmation Screen */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-serif font-bold text-[#F8F6F0]">Exchange Executed</h3>
            <p className="text-xs text-[#A8A69E] mt-1">
              Settled via Andes Institutional Liquidity Network
            </p>

            <div className="my-6 p-4 bg-[#131824] border border-[#242D40] rounded-xl text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Sold</span>
                <span className="font-mono font-medium text-[#F8F6F0]">
                  {formatMoney(numericFrom, fromCurrency, true)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Received</span>
                <span className="font-mono font-bold text-[#D4AF37]">
                  {formatMoney(exchangeResult.amountTo, toCurrency, true)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A8A69E]">Settlement Rate</span>
                <span className="font-mono text-[#F8F6F0]">
                  1 {fromCurrency} = {exchangeResult.rate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-[#242D40]">
                <span className="text-[#A8A69E]">Reference</span>
                <span className="font-mono text-[#D4AF37]">{exchangeResult.reference}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 bg-[#D4AF37] hover:bg-[#E5C378] text-[#080A0F] font-semibold text-sm rounded-xl transition-colors"
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          /* Interactive Exchange Form */
          <div>
            <div className="mb-5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                INSTITUTIONAL FX DESK
              </span>
              <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
                Convert Currency
              </h2>
              <p className="text-xs text-[#A8A69E] mt-1">
                Zero hidden markups. Interbank rate lock with instant settlement.
              </p>
            </div>

            {/* From Box */}
            <div className="bg-[#131824] border border-[#242D40] rounded-xl p-4 mb-2">
              <div className="flex items-center justify-between text-xs text-[#A8A69E] mb-2">
                <span>You Convert</span>
                <span>
                  Available:{' '}
                  <span className="text-[#F8F6F0] font-mono tabular-nums">
                    {formatMoney(fromWallet?.balance || 0, fromCurrency, true)}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-bold font-mono text-[#F8F6F0] focus:outline-none"
                />

                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                  className="bg-[#1A2130] border border-[#242D40] text-sm font-semibold text-[#F8F6F0] rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                >
                  {wallets.map((w) => (
                    <option key={w.currency} value={w.currency} disabled={w.currency === toCurrency}>
                      {w.flag} {w.currency}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Percentage shortcuts */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#242D40]/60">
                <button
                  type="button"
                  onClick={() => setFromAmount(((fromWallet?.balance || 0) * 0.25).toFixed(2))}
                  className="px-2 py-0.5 text-[10px] text-neutral-400 hover:text-white bg-[#1A2130] rounded"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => setFromAmount(((fromWallet?.balance || 0) * 0.5).toFixed(2))}
                  className="px-2 py-0.5 text-[10px] text-neutral-400 hover:text-white bg-[#1A2130] rounded"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setFromAmount((fromWallet?.balance || 0).toFixed(2))}
                  className="px-2 py-0.5 text-[10px] text-[#D4AF37] hover:text-[#FFF0D0] bg-[#1A2130] rounded"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={handleSwap}
                className="w-8 h-8 rounded-full bg-[#1A2130] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#080A0F] flex items-center justify-center transition-all shadow-md"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* To Box */}
            <div className="bg-[#131824] border border-[#242D40] rounded-xl p-4 mt-2">
              <div className="flex items-center justify-between text-xs text-[#A8A69E] mb-2">
                <span>You Receive (Estimated)</span>
                <span>
                  Balance after:{' '}
                  <span className="text-[#D4AF37] font-mono tabular-nums">
                    {formatMoney((toWallet?.balance || 0) + calculatedToAmount, toCurrency, true)}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-full text-2xl font-bold font-mono text-[#D4AF37] tabular-nums truncate">
                  {calculatedToAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                  className="bg-[#1A2130] border border-[#242D40] text-sm font-semibold text-[#F8F6F0] rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                >
                  {wallets.map((w) => (
                    <option key={w.currency} value={w.currency} disabled={w.currency === fromCurrency}>
                      {w.flag} {w.currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rate & Fee Notice */}
            <div className="mt-4 p-3 bg-[#080A0F] border border-[#242D40] rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#A8A69E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Rate Guarantee Lock
                </span>
                <span className="font-mono font-medium text-[#D4AF37]">
                  {rateLockCountdown}s remaining
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#A8A69E]">Direct Interbank Rate</span>
                <span className="font-mono text-[#F8F6F0]">
                  1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#A8A69E]">Andes Clearing Fee</span>
                <span className="font-mono text-emerald-400 font-medium">
                  R0.00 (Zero Markup Prototype)
                </span>
              </div>
            </div>

            {/* Error if insufficient */}
            {numericFrom > (fromWallet?.balance || 0) && (
              <p className="text-xs text-red-400 mt-2 font-medium">
                Insufficient {fromCurrency} balance. Max available is {formatMoney(fromWallet?.balance || 0, fromCurrency, true)}.
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/3 py-2.5 px-4 bg-[#131824] hover:bg-[#1A2130] text-neutral-300 font-medium text-xs rounded-xl border border-[#242D40] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={numericFrom <= 0 || numericFrom > (fromWallet?.balance || 0)}
                className="w-2/3 py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:from-[#E5C378] hover:to-[#D4AF37] text-[#080A0F] font-bold text-xs rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Lock Rate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
