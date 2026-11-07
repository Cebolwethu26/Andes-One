import React from 'react';
import {
  Menu,
  Eye,
  EyeOff,
  ArrowLeftRight,
  Send,
  ArrowDownRight,
  Shield,
  Bell,
  Globe,
} from 'lucide-react';
import { useAndes } from '../context/AndesContext';
import { CurrencyCode } from '../types';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const {
    activeTab,
    baseCurrency,
    setBaseCurrency,
    hideBalances,
    setHideBalances,
    setIsExchangeModalOpen,
    setIsSendModalOpen,
    setIsReceiveModalOpen,
    isEmergencyLocked,
    cardFrozen,
    addNotification,
  } = useAndes();

  const currencies: CurrencyCode[] = ['ZAR', 'GBP', 'USD', 'EUR', 'KES', 'NGN', 'AED'];

  return (
    <header className="sticky top-0 z-30 bg-[#080A0F]/90 backdrop-blur-md border-b border-[#242D40] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Context breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-[#131824] rounded-lg transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#A8A69E]">
            ANDES ONE · {activeTab}
          </div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#F8F6F0] tracking-wide leading-none mt-0.5">
            {activeTab === 'Overview' && 'Global Portfolio & Operations'}
            {activeTab === 'My Wallet' && 'Multi-Currency Account Vaults'}
            {activeTab === 'Exchange' && 'Institutional FX & Conversion'}
            {activeTab === 'Transfers' && 'Cross-Border Settlements'}
            {activeTab === 'Global Card' && 'Andes Metal Cards & Controls'}
            {activeTab === 'AI Agents' && 'Autonomous Financial Intelligence'}
            {activeTab === 'Security Centre' && 'Cryptographic Security & Biometrics'}
            {activeTab === 'Travel' && 'Worldwide Travel & VIP Concierge'}
            {activeTab === 'Settings' && 'Preferences & Account Configuration'}
          </h2>
        </div>
      </div>

      {/* Right: Quick actions, Base currency toggle, Privacy button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status flags if locked/frozen */}
        {isEmergencyLocked && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-red-400 bg-red-950/40 border border-red-500/40 rounded-lg">
            <Shield className="w-3.5 h-3.5" />
            Lockdown
          </span>
        )}

        {/* Base Currency Display Selector */}
        <div className="flex items-center bg-[#0E121B] border border-[#242D40] rounded-lg p-0.5 text-xs">
          <span className="text-[10px] text-[#A8A69E] px-2 hidden md:inline">Base:</span>
          {currencies.map((curr) => (
            <button
              key={curr}
              onClick={() => {
                setBaseCurrency(curr);
                addNotification('Base Currency Updated', `All portfolio figures now consolidated into ${curr}.`, 'info');
              }}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                baseCurrency === curr
                  ? 'bg-[#D4AF37] text-[#080A0F] font-bold shadow-sm'
                  : 'text-[#A8A69E] hover:text-white'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>

        {/* Privacy Eye Toggle */}
        <button
          onClick={() => setHideBalances(!hideBalances)}
          title={hideBalances ? 'Show balances' : 'Hide balances for privacy'}
          className="p-2 text-neutral-400 hover:text-[#D4AF37] bg-[#0E121B] hover:bg-[#131824] border border-[#242D40] rounded-lg transition-colors"
        >
          {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setIsReceiveModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F8F6F0] bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-lg transition-colors"
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Receive</span>
          </button>

          <button
            onClick={() => setIsSendModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F8F6F0] bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Send</span>
          </button>

          <button
            onClick={() => setIsExchangeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#080A0F] bg-[#D4AF37] hover:bg-[#E5C378] rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Exchange</span>
          </button>
        </div>
      </div>
    </header>
  );
};
