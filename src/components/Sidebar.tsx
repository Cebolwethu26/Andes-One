import React from 'react';
import {
  LayoutDashboard,
  Wallet as WalletIcon,
  ArrowLeftRight,
  Send,
  CreditCard,
  Bot,
  ShieldCheck,
  Compass,
  Settings as SettingsIcon,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useAndes } from '../context/AndesContext';
import { ActiveTab } from '../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, setIsExchangeModalOpen, setIsSendModalOpen, setIsReceiveModalOpen } = useAndes();

  const navItems: { label: ActiveTab; icon: React.ReactNode; badge?: string }[] = [
    { label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Wallet', icon: <WalletIcon className="w-4 h-4" /> },
    { label: 'Exchange', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { label: 'Transfers', icon: <Send className="w-4 h-4" /> },
    { label: 'Global Card', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'AI Agents', icon: <Bot className="w-4 h-4" />, badge: 'Active' },
    { label: 'Security Centre', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Travel', icon: <Compass className="w-4 h-4" /> },
    { label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#080A0F] border-r border-[#242D40] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-6 border-b border-[#242D40]">
          <div className="flex items-center gap-3">
            {/* Crest Monogram */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#080A0F] rounded-[7px] flex items-center justify-center">
                <span className="font-serif font-black text-sm tracking-wider text-[#D4AF37]">
                  A
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <h1 className="font-serif text-base font-bold tracking-widest text-[#F8F6F0]">
                  ANDES ONE
                </h1>
              </div>
              <p className="text-[10px] text-[#A8A69E] tracking-wider uppercase">
                A Product of Andes Global
              </p>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-[#D4AF37]/90 italic font-light">
            One account. Every currency. Everywhere.
          </div>
        </div>

        {/* Center: Primary Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#A8A69E] px-3 pb-2">
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.label)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#131824] text-[#D4AF37] border-l-2 border-[#D4AF37] shadow-sm font-semibold'
                    : 'text-[#A8A69E] hover:text-[#F8F6F0] hover:bg-[#0E121B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#D4AF37]' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#D4AF37] px-1.5 py-0.5 rounded border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Transaction Action Trigger Buttons */}
          <div className="pt-4 mt-4 border-t border-[#242D40] space-y-2">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#A8A69E] px-3 pb-1">
              Shortcuts
            </div>

            <button
              onClick={() => {
                setIsExchangeModalOpen(true);
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F8F6F0] bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-lg transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Exchange Currency</span>
            </button>

            <button
              onClick={() => {
                setIsSendModalOpen(true);
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F8F6F0] bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Send Money</span>
            </button>
          </div>
        </div>

        {/* Bottom: Client Profile Card & Prototype Indicator */}
        <div className="p-4 border-t border-[#242D40] bg-[#0A0D14]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center font-bold text-xs text-[#080A0F]">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">Alexander Sterling</div>
              <div className="text-[10px] text-[#D4AF37] font-mono tracking-wider">
                CLIENT #0084 · TIER 1
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#242D40]/60 flex items-center justify-between text-[10px] text-[#A8A69E]">
            <span>Demonstration Prototype</span>
            <span className="text-[#D4AF37]">v2.6 Global</span>
          </div>
        </div>
      </aside>
    </>
  );
};
