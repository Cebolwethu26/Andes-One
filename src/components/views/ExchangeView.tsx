import React, { useState } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { CurrencyCode } from '../../types';

export const ExchangeView: React.FC = () => {
  const {
    wallets,
    executeExchange,
    formatMoney,
    convertCurrency,
    liveRatesList,
    addNotification,
  } = useAndes();

  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('ZAR');
  const [amount, setAmount] = useState<string>('1000');
  const [orderType, setOrderType] = useState<'Market' | 'Limit'>('Market');
  const [limitRate, setLimitRate] = useState<string>('18.50');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const numericAmount = parseFloat(amount) || 0;
  const currentRate = convertCurrency(1, fromCurrency, toCurrency);
  const targetAmount = numericAmount * currentRate;

  const fromWallet = wallets.find((w) => w.currency === fromCurrency);
  const toWallet = wallets.find((w) => w.currency === toCurrency);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleExecute = () => {
    if (numericAmount <= 0) return;
    setIsExecuting(true);

    setTimeout(() => {
      setIsExecuting(false);
      executeExchange(fromCurrency, toCurrency, numericAmount);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
            INSTITUTIONAL LIQUIDITY PROTOCOL
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
            Global FX Exchange Desk
          </h2>
          <p className="text-xs text-[#A8A69E] mt-1">
            Convert seamlessly between ZAR, GBP, USD, EUR, and KES at interbank rates with zero hidden markups.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 bg-[#131824] border border-[#242D40] rounded-lg text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-neutral-300">Continuous Tier 1 Interbank Pricing</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Exchange Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E121B] border border-[#242D40] rounded-xl p-6">
          {/* Order Type Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setOrderType('Market')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                orderType === 'Market'
                  ? 'bg-[#D4AF37] text-[#080A0F] font-semibold'
                  : 'text-[#A8A69E] hover:text-white bg-[#131824]'
              }`}
            >
              Instant Market Order
            </button>
            <button
              onClick={() => {
                setOrderType('Limit');
                setLimitRate((currentRate * 1.015).toFixed(4));
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                orderType === 'Limit'
                  ? 'bg-[#D4AF37] text-[#080A0F] font-semibold'
                  : 'text-[#A8A69E] hover:text-white bg-[#131824]'
              }`}
            >
              Limit Order (Target Rate)
            </button>
          </div>

          {/* Sell Box */}
          <div className="bg-[#131824] border border-[#242D40] rounded-xl p-4 mb-2">
            <div className="flex items-center justify-between text-xs text-[#A8A69E] mb-2">
              <span>You Sell</span>
              <span>
                Available:{' '}
                <span className="font-mono text-white">
                  {formatMoney(fromWallet?.balance || 0, fromCurrency, true)}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-2xl font-bold font-mono text-white focus:outline-none"
              />

              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                className="bg-[#1A2130] border border-[#242D40] text-sm font-semibold text-white rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              >
                {wallets.map((w) => (
                  <option key={w.currency} value={w.currency} disabled={w.currency === toCurrency}>
                    {w.flag} {w.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Trigger */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwap}
              className="w-8 h-8 rounded-full bg-[#1A2130] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#080A0F] flex items-center justify-center transition-all shadow-md"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Buy Box */}
          <div className="bg-[#131824] border border-[#242D40] rounded-xl p-4 mt-2 mb-4">
            <div className="flex items-center justify-between text-xs text-[#A8A69E] mb-2">
              <span>You Buy (Estimated)</span>
              <span>
                Current Holding:{' '}
                <span className="font-mono text-[#D4AF37]">
                  {formatMoney(toWallet?.balance || 0, toCurrency, true)}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-full text-2xl font-bold font-mono text-[#D4AF37] tabular-nums truncate">
                {targetAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                className="bg-[#1A2130] border border-[#242D40] text-sm font-semibold text-white rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              >
                {wallets.map((w) => (
                  <option key={w.currency} value={w.currency} disabled={w.currency === fromCurrency}>
                    {w.flag} {w.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Limit Price Input if Limit Order */}
          {orderType === 'Limit' && (
            <div className="bg-[#080A0F] border border-[#D4AF37]/40 rounded-xl p-3 mb-4 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#A8A69E]">Desired Execution Rate</span>
                <span className="text-[#D4AF37] font-mono">Market: {currentRate.toFixed(4)}</span>
              </div>
              <input
                type="text"
                value={limitRate}
                onChange={(e) => setLimitRate(e.target.value)}
                className="w-full bg-[#131824] border border-[#242D40] rounded px-3 py-1.5 text-sm font-mono text-white font-bold"
              />
            </div>
          )}

          {/* Comparison Spread Box */}
          <div className="p-4 bg-[#080A0F] border border-[#242D40] rounded-xl text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-[#A8A69E]">Rate Guarantee</span>
              <span className="font-mono text-white">
                1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A8A69E]">Andes Institutional Spread</span>
              <span className="text-emerald-400 font-medium">0.00% (Interbank Raw)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A8A69E]">Typical Retail Bank Spread</span>
              <span className="text-rose-400 font-mono">~3.50% (R{((numericAmount * 0.035 * currentRate) || 0).toFixed(0)} more expensive)</span>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting || numericAmount <= 0 || numericAmount > (fromWallet?.balance || 0)}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:from-[#E5C378] hover:to-[#D4AF37] text-[#080A0F] font-bold text-sm rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isExecuting
                ? 'Routing through Interbank Rails...'
                : orderType === 'Market'
                ? `Execute Market Conversion (${fromCurrency} → ${toCurrency})`
                : `Place Limit Order @ ${limitRate}`}
            </span>
          </button>
        </div>

        {/* Right: Live Rates Matrix & Market Depth (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#F8F6F0] mb-3">
              Currency Pairs & 24h Spreads
            </h3>

            <div className="space-y-2">
              {liveRatesList.map((rate) => (
                <div
                  key={rate.pair}
                  onClick={() => {
                    setFromCurrency(rate.from);
                    setToCurrency(rate.to);
                  }}
                  className="p-3 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] hover:border-[#D4AF37]/50 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-white">{rate.pair}</div>
                    <div className="text-[10px] text-[#A8A69E] font-mono mt-0.5">
                      Low: {rate.low24h} · High: {rate.high24h}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-[#D4AF37] tabular-nums">
                      {rate.rate.toFixed(rate.pair.includes('KES') || rate.pair.includes('ZAR') ? 2 : 4)}
                    </div>
                    <div
                      className={`font-mono text-[10px] font-medium ${
                        rate.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {rate.change24h >= 0 ? '+' : ''}
                      {rate.change24h}%
                    </div>
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
