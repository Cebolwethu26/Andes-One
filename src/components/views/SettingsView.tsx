import React from 'react';
import {
  RotateCcw,
  Sliders,
  Shield,
  Bell,
  User,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { CurrencyCode } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    baseCurrency,
    setBaseCurrency,
    hideBalances,
    setHideBalances,
    resetDemonstrationData,
    addNotification,
  } = useAndes();

  const currencies: { code: CurrencyCode; label: string }[] = [
    { code: 'ZAR', label: 'South African Rand (R) · Default Baseline' },
    { code: 'GBP', label: 'British Pound Sterling (£)' },
    { code: 'USD', label: 'United States Dollar ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'KES', label: 'Kenyan Shilling (KSh)' },
    { code: 'NGN', label: 'Nigerian Naira (₦)' },
    { code: 'AED', label: 'United Arab Emirates Dirham (AED)' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
          CONFIGURATION & PREFERENCES
        </span>
        <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
          Account Settings
        </h2>
        <p className="text-xs text-[#A8A69E] mt-1">
          Customize reporting currency, interface privacy, and prototype runtime options.
        </p>
      </div>

      {/* Base Reporting Currency */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F8F6F0]">Consolidated Portfolio Currency</h3>
          <p className="text-xs text-[#A8A69E] mt-0.5">
            Select the master benchmark currency for aggregating your multi-currency balances and reporting metrics.
          </p>
        </div>

        <div className="space-y-2">
          {currencies.map((c) => (
            <label
              key={c.code}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                baseCurrency === c.code
                  ? 'bg-[#131824] border-[#D4AF37]'
                  : 'bg-[#0E121B] border-[#242D40] hover:bg-[#131824]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="baseCurrency"
                  checked={baseCurrency === c.code}
                  onChange={() => {
                    setBaseCurrency(c.code);
                    addNotification('Base Currency Set', `Reporting currency switched to ${c.code}.`, 'info');
                  }}
                  className="accent-[#D4AF37]"
                />
                <span className="text-xs font-semibold text-white">{c.code}</span>
                <span className="text-xs text-[#A8A69E]">· {c.label}</span>
              </div>
              {baseCurrency === c.code && (
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Privacy & View Preferences */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#F8F6F0]">Display & Privacy Controls</h3>

        <div className="flex items-center justify-between p-3.5 bg-[#131824] border border-[#242D40] rounded-xl">
          <div>
            <div className="text-xs font-semibold text-white">Hide Financial Balances (Privacy Shield)</div>
            <div className="text-[11px] text-[#A8A69E]">
              Masks numerical amounts across all screens with '••••••••'
            </div>
          </div>

          <button
            onClick={() => setHideBalances(!hideBalances)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              hideBalances ? 'bg-[#D4AF37]' : 'bg-[#242D40]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#080A0F] transition-transform ${
                hideBalances ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reset Prototype Data */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F8F6F0]">Reset Prototype Demonstration State</h3>
            <p className="text-xs text-[#A8A69E] mt-0.5">
              Restores initial demonstration balances (Total Portfolio: R125,450.00 across ZAR, GBP, USD, EUR, and KES) and transaction history.
            </p>
          </div>

          <button
            onClick={resetDemonstrationData}
            className="flex items-center gap-2 px-4 py-2 bg-[#131824] hover:bg-[#1A2130] text-[#D4AF37] border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-xl text-xs font-semibold transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>
        </div>
      </div>

      {/* Regulatory & Prototype Notice */}
      <div className="p-4 bg-[#080A0F] border border-[#242D40] rounded-xl text-xs text-[#A8A69E] leading-relaxed flex items-start gap-3">
        <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Prototype Notice & Financial Safety: </span>
          ANDES ONE is a financial technology prototype developed by ANDES GLOBAL. All balances, interbank currency conversions, card debits, and transfers are simulated demonstration operations for architecture and product validation. No real fiat funds are processed or exposed.
        </div>
      </div>
    </div>
  );
};
