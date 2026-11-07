import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Send,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Layers,
  ShieldCheck,
  Globe2,
  Download,
  FileText,
  Calendar,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { LuxuryCard } from '../LuxuryCard';
import { SpendingChart } from '../SpendingChart';
import { CurrencyCode, Transaction } from '../../types';

export const OverviewView: React.FC = () => {
  const {
    baseCurrency,
    getTotalPortfolioBalance,
    formatMoney,
    convertCurrency,
    wallets,
    transactions,
    setSelectedTransaction,
    setIsExchangeModalOpen,
    setIsSendModalOpen,
    setIsReceiveModalOpen,
    setIsStatementModalOpen,
    setActiveTab,
    liveRatesList,
  } = useAndes();

  const [transactionFilter, setTransactionFilter] = useState<'all' | 'debit' | 'credit' | 'exchange'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('November');

  const portfolioTotal = getTotalPortfolioBalance();

  const filteredTransactions = transactions.filter((t) => {
    if (transactionFilter !== 'all' && t.type !== transactionFilter) return false;
    if (selectedMonth === 'November') {
      return (
        t.date.includes('Today') ||
        t.date.includes('Yesterday') ||
        t.date.includes('Nov') ||
        t.date.includes('Just now')
      );
    }
    if (selectedMonth === 'October') {
      return t.date.includes('Oct');
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Portfolio Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0E121B] via-[#131824] to-[#0E121B] border border-[#242D40] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] tracking-wider uppercase font-mono font-medium">
              <span>ANDES PRIVATE CLIENT #0084</span>
              <span aria-hidden="true">·</span>
              <span>INSTITUTIONAL TIER 1</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F8F6F0] mt-1.5 tracking-tight">
              Welcome to ANDES ONE.
            </h1>
            <p className="text-sm text-[#A8A69E] mt-1 max-w-xl">
              One account. Every currency. Everywhere. Multi-currency liquidity management across South Africa, UK, US, Europe, and Kenya.
            </p>

            {/* Total Consolidated Balance */}
            <div className="mt-5 pt-4 border-t border-[#242D40]/80">
              <div className="text-xs text-[#A8A69E] font-medium uppercase tracking-wider">
                Total Consolidated Portfolio Balance
              </div>
              <div className="flex flex-wrap items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#D4AF37] tabular-nums">
                  {formatMoney(portfolioTotal, baseCurrency)}
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  +2.45% 24h
                </span>
                <span className="text-xs text-[#A8A69E]">
                  ({wallets.length} active global currencies)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Action Bar */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-[#080A0F]/80 p-3 rounded-xl border border-[#242D40] shrink-0">
            <button
              onClick={() => setIsExchangeModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] hover:bg-[#E5C378] text-[#080A0F] font-bold text-xs rounded-lg transition-all shadow-md whitespace-nowrap"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Exchange Currency</span>
            </button>

            <button
              onClick={() => setIsSendModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 bg-[#131824] hover:bg-[#1A2130] text-[#F8F6F0] font-semibold text-xs rounded-lg border border-[#242D40] transition-colors whitespace-nowrap"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
              <span>Send Money</span>
            </button>

            <button
              onClick={() => setIsReceiveModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-[#131824] hover:bg-[#1A2130] text-[#F8F6F0] font-semibold text-xs rounded-lg border border-[#242D40] transition-colors whitespace-nowrap"
            >
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
              <span>Receive Money</span>
            </button>
          </div>
        </div>
      </div>

      {/* Currency Wallet Cards: ZAR, GBP, USD, EUR, KES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-serif font-bold text-[#F8F6F0]">
              Multi-Currency Wallet Vaults
            </h2>
            <div className="text-xs text-[#A8A69E] mt-0.5">
              Instant interbank settlement · 7 Native Clearing Networks
            </div>
          </div>

          <button
            onClick={() => setActiveTab('My Wallet')}
            className="text-xs text-[#D4AF37] hover:text-[#FFF0D0] font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All Accounts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {wallets.map((wallet) => (
            <div
              key={wallet.currency}
              onClick={() => setActiveTab('My Wallet')}
              className="bg-[#0E121B] hover:bg-[#131824] border border-[#242D40] hover:border-[#D4AF37]/50 rounded-xl p-3.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none">{wallet.flag}</span>
                  <div>
                    <div className="font-bold text-xs text-white">{wallet.currency}</div>
                    <div className="text-[10px] text-[#A8A69E] truncate max-w-[70px]">
                      {wallet.name}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-[10px] font-mono font-medium flex items-center ${
                    wallet.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {wallet.change24h >= 0 ? '+' : ''}
                  {wallet.change24h}%
                </div>
              </div>

              <div className="my-3">
                <div className="text-base font-bold font-mono text-white tabular-nums tracking-tight truncate">
                  {formatMoney(wallet.balance, wallet.currency)}
                </div>
                <div className="text-[10px] text-[#A8A69E] font-mono mt-0.5 truncate">
                  ≈ {formatMoney(convertCurrency(wallet.balance, wallet.currency, baseCurrency), baseCurrency)}
                </div>
              </div>

              <div className="pt-2 border-t border-[#242D40] flex items-center justify-between text-[10px] text-[#A8A69E] group-hover:text-[#D4AF37]">
                <span className="truncate max-w-[65px]">{wallet.country}</span>
                <span className="font-mono shrink-0">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Section: Global Card Preview & Spending Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Global Card Preview (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E121B] border border-[#242D40] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#F8F6F0]">Global Andes Metal Card</h3>
                <div className="text-xs text-[#A8A69E]">
                  Zero foreign transaction fee · Obsidian Edition
                </div>
              </div>
              <button
                onClick={() => setActiveTab('Global Card')}
                className="text-xs text-[#D4AF37] hover:underline"
              >
                Card Centre
              </button>
            </div>

            {/* Interactive Luxury Card */}
            <div className="flex justify-center my-2">
              <LuxuryCard variant="obsidian" showControls={true} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#242D40] flex items-center justify-between text-xs text-[#A8A69E]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Chip & PIN + Dynamic CVV Active
            </span>
            <span className="font-mono text-[#D4AF37]">Limit: R75,000</span>
          </div>
        </div>

        {/* Right Column: Spending Overview Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <SpendingChart />
        </div>
      </div>

      {/* Live Demonstration FX Rates Matrix Ticker */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-semibold text-[#F8F6F0] uppercase tracking-wider">
              Live Interbank Foreign Exchange Matrix
            </h3>
          </div>
          <button
            onClick={() => setIsExchangeModalOpen(true)}
            className="text-xs text-[#D4AF37] hover:underline"
          >
            Open FX Desk →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
          {liveRatesList.map((rate) => (
            <div
              key={rate.pair}
              className="p-2.5 bg-[#131824] border border-[#242D40] rounded-lg cursor-pointer hover:border-[#D4AF37]/40 transition-colors"
              onClick={() => setIsExchangeModalOpen(true)}
            >
              <div className="flex items-center justify-between text-[11px] text-[#A8A69E]">
                <span className="font-semibold text-white">{rate.pair}</span>
                <span
                  className={`font-mono text-[10px] ${
                    rate.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {rate.change24h >= 0 ? '+' : ''}
                  {rate.change24h}%
                </span>
              </div>
              <div className="font-mono font-bold text-sm text-[#D4AF37] tabular-nums mt-1">
                {rate.rate.toFixed(rate.pair.includes('KES') || rate.pair.includes('ZAR') ? 2 : 4)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Demonstration Transactions Table */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#242D40]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#F8F6F0]">Transaction History & Clearings</h3>
              <span className="text-[11px] text-[#D4AF37] font-mono">({filteredTransactions.length} records)</span>
            </div>
            <div className="text-xs text-[#A8A69E] mt-0.5">
              Audited account activity across all 7 global multi-currency liquidity rails
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month Filter Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#131824] border border-[#242D40] rounded-lg text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="November" className="bg-[#131824]">November 2026</option>
                <option value="October" className="bg-[#131824]">October 2026</option>
                <option value="All" className="bg-[#131824]">All Recorded Months</option>
              </select>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#131824] border border-[#242D40] rounded-lg">
              {(['all', 'debit', 'credit', 'exchange'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTransactionFilter(f)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap capitalize ${
                    transactionFilter === f
                      ? 'bg-[#D4AF37] text-[#080A0F] font-semibold shadow-sm'
                      : 'text-[#A8A69E] hover:text-white'
                  }`}
                >
                  {f === 'debit' ? 'Debits' : f === 'credit' ? 'Credits' : f === 'exchange' ? 'Exchanges' : 'All'}
                </button>
              ))}
            </div>

            {/* Download Statement Button */}
            <button
              onClick={() => setIsStatementModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:from-[#E5C378] hover:to-[#D4AF37] text-[#080A0F] rounded-lg text-xs font-bold transition-all shadow-md whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Statement</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#242D40] text-[#A8A69E] font-medium">
                <th className="pb-3 font-normal">Transaction</th>
                <th className="pb-3 font-normal hidden sm:table-cell">Category</th>
                <th className="pb-3 font-normal hidden md:table-cell">Settlement Method</th>
                <th className="pb-3 font-normal text-right">Amount</th>
                <th className="pb-3 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242D40]/60">
              {filteredTransactions.map((tx) => {
                const isDebit = tx.type === 'debit';
                const isExchange = tx.type === 'exchange';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="hover:bg-[#131824]/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#131824] border border-[#242D40] flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/40 transition-colors">
                          {isDebit && <ArrowUpRight className="w-4 h-4 text-neutral-300" />}
                          {!isDebit && !isExchange && <ArrowDownLeft className="w-4 h-4 text-emerald-400" />}
                          {isExchange && <RefreshCw className="w-4 h-4 text-[#D4AF37]" />}
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                            {tx.description}
                          </div>
                          <div className="text-[11px] text-[#A8A69E] flex items-center gap-1.5 mt-0.5">
                            <span>{tx.date}</span>
                            <span aria-hidden="true">·</span>
                            <span>{tx.counterparty}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-2 hidden sm:table-cell text-[#A8A69E]">
                      {tx.category}
                    </td>

                    <td className="py-3 px-2 hidden md:table-cell text-[#A8A69E] font-mono text-[11px] truncate max-w-[200px]">
                      {tx.method}
                    </td>

                    <td className="py-3 pl-2 text-right">
                      <div
                        className={`font-mono font-bold tabular-nums ${
                          isDebit ? 'text-white' : !isDebit && !isExchange ? 'text-emerald-400' : 'text-[#D4AF37]'
                        }`}
                      >
                        {isDebit ? '-' : '+'}
                        {formatMoney(tx.amount, tx.currency, true)}
                      </div>
                      <div className="text-[10px] text-[#A8A69E] font-mono">
                        {tx.currency}
                      </div>
                    </td>

                    <td className="py-3 pl-3 text-right">
                      <span className="text-[11px] font-medium text-emerald-400">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
