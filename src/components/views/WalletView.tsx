import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  ArrowLeftRight,
  ArrowDownRight,
  ArrowUpRight,
  Send,
  Download,
  Share2,
  FileSpreadsheet,
  Building,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Wallet,
  ArrowDownUp,
  Filter,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { CurrencyCode } from '../../types';

export const WalletView: React.FC = () => {
  const {
    wallets,
    formatMoney,
    transactions,
    setSelectedTransaction,
    setIsExchangeModalOpen,
    setIsSendModalOpen,
    setIsReceiveModalOpen,
    setIsWithdrawModalOpen,
    setIsStatementModalOpen,
    executeExchange,
    simulateDeposit,
    convertCurrency,
    addNotification,
  } = useAndes();

  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('ZAR');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Embedded Interactive Converter State
  const [targetCurrency, setTargetCurrency] = useState<CurrencyCode>('USD');
  const [convertAmount, setConvertAmount] = useState<string>('1000');
  const [rateLockTimer, setRateLockTimer] = useState<number>(30);
  const [conversionSuccess, setConversionSuccess] = useState<{
    from: CurrencyCode;
    to: CurrencyCode;
    fromAmount: number;
    toAmount: number;
    rate: number;
    reference: string;
  } | null>(null);

  // Sub-ledger filter
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'credit' | 'debit' | 'exchange'>('all');

  const selectedWallet = wallets.find((w) => w.currency === activeCurrency) || wallets[0];

  // Make sure targetCurrency isn't the same as activeCurrency
  useEffect(() => {
    if (targetCurrency === activeCurrency) {
      const fallback = wallets.find((w) => w.currency !== activeCurrency)?.currency || 'USD';
      setTargetCurrency(fallback);
    }
  }, [activeCurrency, targetCurrency, wallets]);

  // Rate countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRateLockTimer((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const walletTransactions = transactions.filter((t) => {
    const isThisCurrency = t.currency === activeCurrency;
    if (!isThisCurrency) return false;
    if (ledgerFilter === 'all') return true;
    return t.type === ledgerFilter;
  });

  const numericConvertAmount = parseFloat(convertAmount) || 0;
  const currentExchangeRate = convertCurrency(1, activeCurrency, targetCurrency);
  const calculatedFinalAmount = numericConvertAmount * currentExchangeRate;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    addNotification('Copied', `${key} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadStatement = () => {
    setIsStatementModalOpen(true);
  };

  const handleExecuteWalletConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericConvertAmount <= 0) return;
    if (numericConvertAmount > selectedWallet.balance) {
      addNotification('Conversion Failed', `Insufficient ${activeCurrency} balance.`, 'warning');
      return;
    }

    const res = executeExchange(activeCurrency, targetCurrency, numericConvertAmount);
    if (res.success) {
      setConversionSuccess({
        from: activeCurrency,
        to: targetCurrency,
        fromAmount: numericConvertAmount,
        toAmount: res.amountTo,
        rate: res.rate,
        reference: res.reference,
      });
      setTimeout(() => setConversionSuccess(null), 6000);
    }
  };

  const handleQuickDeposit = () => {
    const defaultAmts: Record<CurrencyCode, number> = {
      ZAR: 10000,
      USD: 1000,
      GBP: 500,
      EUR: 750,
      KES: 50000,
      NGN: 250000,
      AED: 2000,
    };
    simulateDeposit(activeCurrency, defaultAmts[activeCurrency], 'Zurich Institutional Liquidity');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Overview */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
            GLOBAL MULTI-CURRENCY VAULT
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
            Sovereign Currency Accounts
          </h2>
          <p className="text-xs text-[#A8A69E] mt-1">
            Displaying 7 liquid currencies: ZAR, GBP, USD, EUR, KES, NGN, and AED with native interbank rails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReceiveModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#131824] hover:bg-[#1A2130] text-white border border-[#242D40] rounded-xl text-xs font-semibold transition-colors"
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#131824] hover:bg-[#1A2130] text-white border border-[#242D40] rounded-xl text-xs font-semibold transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Withdraw</span>
          </button>
          <button
            onClick={() => setIsExchangeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C378] text-[#080A0F] font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Exchange</span>
          </button>
        </div>
      </div>

      {/* Top 7 Currency Wallet Selector Cards (Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {wallets.map((w) => {
          const isSelected = w.currency === activeCurrency;
          return (
            <button
              key={w.currency}
              onClick={() => setActiveCurrency(w.currency)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#131824] border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]/40'
                  : 'bg-[#0E121B] border-[#242D40] hover:border-[#D4AF37]/30 hover:bg-[#111622]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl select-none">{w.flag}</span>
                <span
                  className={`text-[10px] font-mono font-medium ${
                    w.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {w.change24h >= 0 ? '+' : ''}
                  {w.change24h}%
                </span>
              </div>

              <div className="mt-2.5">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{w.currency}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                </div>
                <div className="text-sm font-bold font-mono text-[#F8F6F0] tabular-nums mt-0.5 truncate">
                  {formatMoney(w.balance, w.currency)}
                </div>
                <div className="text-[10px] text-[#A8A69E] truncate mt-0.5">{w.country}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Wallet Detail + Embedded Converter + Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Wallet Detail & Embedded Currency Converter (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Wallet Details Card */}
          <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#242D40]">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedWallet.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-serif font-bold text-[#F8F6F0]">
                      {selectedWallet.name}
                    </h2>
                    <span className="text-xs font-mono font-semibold text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20">
                      {selectedWallet.currency}
                    </span>
                  </div>
                  <div className="text-xs text-[#A8A69E] mt-0.5">
                    {selectedWallet.country} · Native Central Bank Clearing
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[11px] text-[#A8A69E] uppercase font-mono tracking-wider">
                  Available Balance
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#D4AF37] tabular-nums">
                  {formatMoney(selectedWallet.balance, selectedWallet.currency)}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-5">
              <button
                onClick={() => setIsReceiveModalOpen(true)}
                className="p-3 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] hover:border-[#D4AF37]/50 rounded-xl text-center transition-colors"
              >
                <ArrowDownRight className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-xs font-semibold text-white">Deposit</div>
                <div className="text-[10px] text-[#A8A69E]">Inbound Rails</div>
              </button>

              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="p-3 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] hover:border-[#D4AF37]/50 rounded-xl text-center transition-colors"
              >
                <ArrowUpRight className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <div className="text-xs font-semibold text-white">Withdraw</div>
                <div className="text-[10px] text-[#A8A69E]">Direct Payout</div>
              </button>

              <button
                onClick={() => setIsSendModalOpen(true)}
                className="p-3 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] hover:border-[#D4AF37]/50 rounded-xl text-center transition-colors"
              >
                <Send className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                <div className="text-xs font-semibold text-white">Transfer</div>
                <div className="text-[10px] text-[#A8A69E]">Instant Wire</div>
              </button>

              <button
                onClick={handleQuickDeposit}
                className="p-3 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] hover:border-emerald-500/40 rounded-xl text-center transition-colors"
                title="Quick simulate inbound deposit"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-xs font-semibold text-emerald-400">Quick Test Credit</div>
                <div className="text-[10px] text-[#A8A69E]">Instant Simulated</div>
              </button>
            </div>

            {/* Native Banking Coordinates */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-semibold text-[#F8F6F0] uppercase tracking-wider">
                  Account Coordinates & Clearing
                </h3>
                <button
                  onClick={handleDownloadStatement}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Audited Statement</span>
                </button>
              </div>

              <div className="bg-[#131824] border border-[#242D40] rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#A8A69E]">Beneficiary</div>
                    <div className="font-semibold text-white">Alexander Sterling</div>
                  </div>
                  <button
                    onClick={() => handleCopy('Alexander Sterling', 'Beneficiary')}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedKey === 'Beneficiary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#242D40]">
                  <div>
                    <div className="text-[10px] text-[#A8A69E]">Account Identifier</div>
                    <div className="font-mono text-white font-medium">{selectedWallet.accountNumber}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedWallet.accountNumber, 'Account Identifier')}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedKey === 'Account Identifier' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#242D40]">
                  <div>
                    <div className="text-[10px] text-[#A8A69E]">Routing / Clearing Network</div>
                    <div className="font-mono text-white font-medium">{selectedWallet.sortOrRouting}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedWallet.sortOrRouting, 'Routing')}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedKey === 'Routing' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#242D40]">
                  <div>
                    <div className="text-[10px] text-[#A8A69E]">IBAN / SWIFT Code</div>
                    <div className="font-mono text-white font-medium">{selectedWallet.ibanOrSwift}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedWallet.ibanOrSwift, 'IBAN')}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedKey === 'IBAN' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Interactive Currency Converter */}
          <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#242D40]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                  INSTANT LIQUIDITY ENGINE
                </span>
                <h3 className="text-base font-serif font-bold text-[#F8F6F0] mt-0.5">
                  Interactive Currency Converter
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Rate locked: {rateLockTimer}s</span>
              </div>
            </div>

            {/* Success Banner if converted */}
            {conversionSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-white">Conversion Successful & Settled</div>
                  <div className="text-neutral-300 mt-0.5">
                    Converted {formatMoney(conversionSuccess.fromAmount, conversionSuccess.from, true)} to{' '}
                    <span className="font-bold text-[#D4AF37]">
                      {formatMoney(conversionSuccess.toAmount, conversionSuccess.to, true)}
                    </span>{' '}
                    at rate 1 {conversionSuccess.from} = {conversionSuccess.rate.toFixed(4)} {conversionSuccess.to}. Ref: {conversionSuccess.reference}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleExecuteWalletConversion} className="space-y-4">
              {/* From Row */}
              <div className="bg-[#131824] border border-[#242D40] rounded-xl p-3.5">
                <div className="flex justify-between text-xs text-[#A8A69E] mb-1.5">
                  <span>From Currency</span>
                  <span>
                    Balance: <span className="font-mono text-white">{formatMoney(selectedWallet.balance, activeCurrency, true)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-xl font-mono font-bold text-white focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A2130] rounded-lg border border-[#242D40] font-semibold text-xs text-white shrink-0">
                    <span>{selectedWallet.flag}</span>
                    <span>{activeCurrency}</span>
                  </div>
                </div>
              </div>

              {/* Swap indicator */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    const temp = activeCurrency;
                    setActiveCurrency(targetCurrency);
                    setTargetCurrency(temp);
                  }}
                  className="w-8 h-8 rounded-full bg-[#1A2130] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#080A0F] flex items-center justify-center transition-all shadow-md"
                  title="Swap currencies"
                >
                  <ArrowDownUp className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* To Row */}
              <div className="bg-[#131824] border border-[#242D40] rounded-xl p-3.5">
                <div className="flex justify-between text-xs text-[#A8A69E] mb-1.5">
                  <span>To Currency (Final Converted Amount)</span>
                  <span>
                    Holding: <span className="font-mono text-[#D4AF37]">{formatMoney(wallets.find(w => w.currency === targetCurrency)?.balance || 0, targetCurrency, true)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-full text-xl font-mono font-bold text-[#D4AF37] tabular-nums truncate">
                    {calculatedFinalAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>

                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value as CurrencyCode)}
                    className="px-3 py-1.5 bg-[#1A2130] rounded-lg border border-[#242D40] font-semibold text-xs text-white focus:outline-none cursor-pointer shrink-0"
                  >
                    {wallets.map((w) => (
                      <option key={w.currency} value={w.currency} disabled={w.currency === activeCurrency}>
                        {w.flag} {w.currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rates & Conversion Fee Breakdown (Clearly Labelled Demonstration Rates) */}
              <div className="bg-[#080A0F] border border-[#242D40] rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A8A69E]">Demonstration Interbank Rate</span>
                  <span className="font-mono text-white">
                    1 {activeCurrency} = {currentExchangeRate.toFixed(4)} {targetCurrency}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#A8A69E]">Conversion Fee</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    0.00% (No Markup · Demonstration Rate)
                  </span>
                </div>

                <div className="flex justify-between pt-1.5 border-t border-[#242D40]">
                  <span className="text-[#A8A69E]">Final Amount Credited</span>
                  <span className="font-mono font-bold text-[#D4AF37]">
                    {formatMoney(calculatedFinalAmount, targetCurrency, true)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={numericConvertAmount <= 0 || numericConvertAmount > selectedWallet.balance}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:from-[#E5C378] hover:to-[#D4AF37] text-[#080A0F] font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  Execute Conversion ({activeCurrency} → {targetCurrency})
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Currency Sub-Ledger & Complete History (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E121B] border border-[#242D40] rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#242D40]">
            <div>
              <h3 className="text-sm font-semibold text-[#F8F6F0]">
                {selectedWallet.currency} Sub-Ledger History
              </h3>
              <div className="text-xs text-[#A8A69E]">
                {walletTransactions.length} operations recorded
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsStatementModalOpen(true)}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Statement</span>
              </button>
              <button
                onClick={() => {
                  addNotification('Ledger Exported', `CSV statement for ${selectedWallet.currency} downloaded.`, 'info');
                }}
                className="text-xs text-[#A8A69E] hover:text-white flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#131824] border border-[#242D40] rounded-lg mb-4">
            {(['all', 'credit', 'debit', 'exchange'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setLedgerFilter(filter)}
                className={`flex-1 py-1 text-[11px] font-medium rounded-md capitalize transition-colors ${
                  ledgerFilter === filter
                    ? 'bg-[#D4AF37] text-[#080A0F] font-semibold'
                    : 'text-[#A8A69E] hover:text-white'
                }`}
              >
                {filter === 'credit' ? 'Deposits' : filter === 'debit' ? 'Debits' : filter}
              </button>
            ))}
          </div>

          {walletTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#A8A69E]">
              No transactions recorded matching the selected filter in {selectedWallet.currency}.
            </div>
          ) : (
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {walletTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className="p-3 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-medium text-white truncate">{tx.description}</div>
                    <div className="text-[10px] text-[#A8A69E] mt-0.5">
                      {tx.date} · {tx.category}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-mono text-xs font-bold tabular-nums ${
                        tx.type === 'debit'
                          ? 'text-white'
                          : tx.type === 'credit'
                          ? 'text-emerald-400'
                          : 'text-[#D4AF37]'
                      }`}
                    >
                      {tx.type === 'debit' ? '-' : '+'}
                      {formatMoney(tx.amount, tx.currency, true)}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">Settled</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
