import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Calendar,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Building,
  Sparkles,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { downloadStatementFile } from '../../utils/pdfGenerator';
import { CurrencyCode, Transaction } from '../../types';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCurrency?: CurrencyCode;
}

export const StatementModal: React.FC<StatementModalProps> = ({
  isOpen,
  onClose,
  defaultCurrency,
}) => {
  const {
    baseCurrency,
    formatMoney,
    transactions,
    getTotalPortfolioBalance,
    addNotification,
  } = useAndes();

  const [selectedMonth, setSelectedMonth] = useState<string>('November');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [statementCurrency, setStatementCurrency] = useState<CurrencyCode>(defaultCurrency || baseCurrency);

  if (!isOpen) return null;

  // Filter transactions for the selected month demonstration
  const monthTransactions = transactions.filter((t) => {
    // Demonstration data matches November and October
    if (selectedMonth === 'November') {
      return t.date.includes('Today') || t.date.includes('Yesterday') || t.date.includes('Nov') || t.date.includes('Just now');
    }
    if (selectedMonth === 'October') {
      return t.date.includes('Oct');
    }
    return true;
  });

  const displayTransactions = monthTransactions.length > 0 ? monthTransactions : transactions.slice(0, 5);

  const totalCredits = displayTransactions
    .filter((t) => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDebits = displayTransactions
    .filter((t) => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);

  const closingBalance = getTotalPortfolioBalance(statementCurrency);
  const openingBalance = Math.max(0, closingBalance - totalCredits + totalDebits);

  const handleDownloadPdf = () => {
    downloadStatementFile({
      monthName: selectedMonth,
      year: selectedYear,
      clientName: 'Alexander Sterling',
      accountNumber: 'ANDES-0084-VIP',
      openingBalance: formatMoney(openingBalance, statementCurrency, true),
      closingBalance: formatMoney(closingBalance, statementCurrency, true),
      totalCredits: formatMoney(totalCredits, statementCurrency, true),
      totalDebits: formatMoney(totalDebits, statementCurrency, true),
      transactions: displayTransactions,
      reportingCurrency: statementCurrency,
    });

    addNotification(
      'Statement Downloaded',
      `ANDES_ONE_Statement_${selectedMonth}_${selectedYear}.pdf saved to your device.`,
      'success'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0E121B] border border-[#D4AF37]/40 rounded-2xl p-5 sm:p-7 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#242D40] shrink-0">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
              AUDITED FINANCIAL STATEMENTS
            </span>
            <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
              Account Statement Generator
            </h2>
            <p className="text-xs text-[#A8A69E] mt-0.5">
              Generate and download certified monthly statements with full cryptographic transaction proofs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Month & Year Selector + Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 shrink-0">
          <div>
            <label className="block text-xs font-medium text-[#A8A69E] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Select Statement Month</span>
            </label>
            <div className="flex items-center gap-1.5 p-1 bg-[#131824] border border-[#242D40] rounded-xl text-xs">
              {['November', 'October', 'September'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all ${
                    selectedMonth === m
                      ? 'bg-[#D4AF37] text-[#080A0F] font-bold shadow-sm'
                      : 'text-[#A8A69E] hover:text-white'
                  }`}
                >
                  {m} 2026
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A8A69E] mb-1.5">
              Reporting Valuation Currency
            </label>
            <div className="flex items-center gap-1 p-1 bg-[#131824] border border-[#242D40] rounded-xl text-xs overflow-x-auto">
              {(['ZAR', 'GBP', 'USD', 'EUR', 'KES', 'NGN', 'AED'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setStatementCurrency(c)}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-xs transition-all whitespace-nowrap ${
                    statementCurrency === c
                      ? 'bg-[#1A2130] text-[#D4AF37] font-bold border border-[#D4AF37]/50'
                      : 'text-[#A8A69E] hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Document Preview Sheet */}
        <div className="flex-1 overflow-y-auto bg-[#080A0F] border border-[#242D40] rounded-xl p-5 text-xs text-[#F8F6F0] space-y-5 my-2 print:bg-white print:text-black">
          {/* Statement Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242D40]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded border border-[#D4AF37] bg-[#0E121B] flex items-center justify-center font-serif font-bold text-xs text-[#D4AF37]">
                  A
                </div>
                <span className="font-serif font-bold text-base tracking-widest text-[#F8F6F0]">
                  ANDES ONE
                </span>
              </div>
              <div className="text-[10px] text-[#A8A69E] mt-1">
                A Product of Andes Global · Private Banking Division
              </div>
              <div className="text-[10px] text-neutral-400">
                Mayfair London & V&A Waterfront Cape Town
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <div className="font-bold text-white uppercase tracking-wider">Official Account Statement</div>
              <div className="text-[#D4AF37] font-mono mt-0.5">
                Period: 01 {selectedMonth} 2026 – 30 {selectedMonth} 2026
              </div>
              <div className="text-[10px] text-[#A8A69E] font-mono mt-0.5">
                Statement Ref: STM-{selectedMonth.slice(0, 3).toUpperCase()}-2026-0084
              </div>
            </div>
          </div>

          {/* Account & Client Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#131824] rounded-lg border border-[#242D40]">
            <div>
              <div className="text-[10px] text-[#A8A69E]">Account Holder</div>
              <div className="font-semibold text-white mt-0.5">Alexander Sterling</div>
            </div>
            <div>
              <div className="text-[10px] text-[#A8A69E]">Client Identifier</div>
              <div className="font-mono text-white mt-0.5">#0084 · Tier 1 Prime</div>
            </div>
            <div>
              <div className="text-[10px] text-[#A8A69E]">Reporting Currency</div>
              <div className="font-mono text-[#D4AF37] font-bold mt-0.5">{statementCurrency}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#A8A69E]">Clearing Rails</div>
              <div className="text-white mt-0.5">Multi-Currency Global</div>
            </div>
          </div>

          {/* Summary Figures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#131824] rounded-lg border border-[#242D40]">
              <div className="text-[10px] text-[#A8A69E]">Opening Balance</div>
              <div className="font-mono font-bold text-white text-sm mt-1 tabular-nums">
                {formatMoney(openingBalance, statementCurrency, true)}
              </div>
            </div>
            <div className="p-3 bg-[#131824] rounded-lg border border-[#242D40]">
              <div className="text-[10px] text-[#A8A69E]">Total Inflow (Credits)</div>
              <div className="font-mono font-bold text-emerald-400 text-sm mt-1 tabular-nums">
                +{formatMoney(totalCredits, statementCurrency, true)}
              </div>
            </div>
            <div className="p-3 bg-[#131824] rounded-lg border border-[#242D40]">
              <div className="text-[10px] text-[#A8A69E]">Total Outflow (Debits)</div>
              <div className="font-mono font-bold text-rose-400 text-sm mt-1 tabular-nums">
                -{formatMoney(totalDebits, statementCurrency, true)}
              </div>
            </div>
            <div className="p-3 bg-[#131824] rounded-lg border border-[#D4AF37]/40">
              <div className="text-[10px] text-[#A8A69E]">Closing Balance</div>
              <div className="font-mono font-bold text-[#D4AF37] text-sm mt-1 tabular-nums">
                {formatMoney(closingBalance, statementCurrency, true)}
              </div>
            </div>
          </div>

          {/* Itemized Transactions Table */}
          <div>
            <div className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">
              Itemized Account Activity ({displayTransactions.length} records)
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#242D40] text-[#A8A69E] text-[10px] uppercase font-mono">
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2 px-2">Description / Beneficiary</th>
                  <th className="py-2 px-2 hidden sm:table-cell">Category</th>
                  <th className="py-2 px-2 hidden md:table-cell">Reference</th>
                  <th className="py-2 pl-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242D40]/50 font-mono text-[11px]">
                {displayTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#131824]">
                    <td className="py-2.5 pr-2 text-neutral-400 whitespace-nowrap">{tx.date}</td>
                    <td className="py-2.5 px-2 font-sans font-medium text-white">
                      <div>{tx.description}</div>
                      <div className="text-[10px] text-[#A8A69E] font-sans">{tx.counterparty}</div>
                    </td>
                    <td className="py-2.5 px-2 hidden sm:table-cell text-neutral-400 font-sans text-[10px]">
                      {tx.category}
                    </td>
                    <td className="py-2.5 px-2 hidden md:table-cell text-[#A8A69E] text-[10px]">
                      {tx.reference}
                    </td>
                    <td className="py-2.5 pl-2 text-right font-bold whitespace-nowrap">
                      <span className={tx.type === 'debit' ? 'text-white' : 'text-emerald-400'}>
                        {tx.type === 'debit' ? '-' : '+'}
                        {formatMoney(tx.amount, tx.currency, true)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cryptographic Seal & Compliance Note */}
          <div className="pt-3 border-t border-[#242D40] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-[#A8A69E]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>SHA-256 Ledger Stamp: 9fa821c4091b72e819ac44b98129031ef84128a1</span>
            </div>
            <div className="font-mono">Certified by Andes Global Clearing Ltd</div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#242D40] shrink-0">
          <div className="text-[11px] text-[#A8A69E] hidden sm:block">
            Standard ISO 20022 compliant mock statement
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#131824] hover:bg-[#1A2130] text-neutral-200 border border-[#242D40] rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Print Preview</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:from-[#E5C378] hover:to-[#D4AF37] text-[#080A0F] font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Statement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
