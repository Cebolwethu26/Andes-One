import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Wifi,
  Sliders,
  Smartphone,
  Eye,
  EyeOff,
  Globe,
  Sparkles,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { LuxuryCard } from '../LuxuryCard';

export const GlobalCardView: React.FC = () => {
  const {
    cardFrozen,
    toggleCardFrozen,
    cardSpendingLimit,
    setCardSpendingLimit,
    formatMoney,
    addNotification,
  } = useAndes();

  const [cardEdition, setCardEdition] = useState<'obsidian' | 'champagne'>('obsidian');
  const [onlineSpending, setOnlineSpending] = useState<boolean>(true);
  const [atmWithdrawals, setAtmWithdrawals] = useState<boolean>(true);
  const [contactless, setContactless] = useState<boolean>(true);
  const [internationalTravel, setInternationalTravel] = useState<boolean>(true);
  const [revealedPin, setRevealedPin] = useState<boolean>(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
            SOLID TITANIUM & OBSIDIAN
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
            Andes Global Metal Card
          </h2>
          <p className="text-xs text-[#A8A69E] mt-1">
            Zero foreign exchange fees. Native multi-currency debit directly against your ZAR, GBP, USD, EUR, and KES balances.
          </p>
        </div>

        {/* Edition Switcher */}
        <div className="flex items-center gap-2 p-1 bg-[#131824] border border-[#242D40] rounded-xl">
          <button
            onClick={() => setCardEdition('obsidian')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              cardEdition === 'obsidian'
                ? 'bg-[#1A2130] text-white font-semibold shadow-sm'
                : 'text-[#A8A69E] hover:text-white'
            }`}
          >
            Obsidian Black
          </button>
          <button
            onClick={() => setCardEdition('champagne')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              cardEdition === 'champagne'
                ? 'bg-[#D4AF37] text-[#080A0F] font-bold shadow-sm'
                : 'text-[#A8A69E] hover:text-white'
            }`}
          >
            Champagne Gold
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Card Visual & Quick Actions (6 cols) */}
        <div className="lg:col-span-6 bg-[#0E121B] border border-[#242D40] rounded-xl p-6 flex flex-col items-center">
          <div className="w-full flex justify-center py-4">
            <LuxuryCard variant={cardEdition} showControls={true} />
          </div>

          {/* Provision to Wallets */}
          <div className="w-full max-w-[420px] pt-4 border-t border-[#242D40] grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => {
                addNotification('Apple Pay Configured', 'Andes Metal card added to Apple Wallet on your primary device.', 'success');
              }}
              className="py-2.5 px-3 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-xl text-xs font-medium text-white transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#D4AF37]" />
              <span>Add to Apple Pay</span>
            </button>

            <button
              onClick={() => {
                addNotification('Google Wallet Ready', 'Andes Metal card provisioned for Google Pay contactless tap.', 'success');
              }}
              className="py-2.5 px-3 bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-xl text-xs font-medium text-white transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Add to Google Pay</span>
            </button>
          </div>
        </div>

        {/* Right: Security & Spending Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Monthly Spending Limit Slider */}
          <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-[#F8F6F0]">Monthly Spending Limit</h3>
                <div className="text-xs text-[#A8A69E]">Applies across all 5 currency wallets</div>
              </div>
              <span className="font-mono text-base font-bold text-[#D4AF37] tabular-nums">
                {formatMoney(cardSpendingLimit, 'ZAR', true)}
              </span>
            </div>

            <input
              type="range"
              min="10000"
              max="250000"
              step="5000"
              value={cardSpendingLimit}
              onChange={(e) => setCardSpendingLimit(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer mt-3"
            />

            <div className="flex justify-between text-[10px] text-[#A8A69E] font-mono mt-1">
              <span>R10,000</span>
              <span>R125,000</span>
              <span>R250,000</span>
            </div>
          </div>

          {/* Card Features Toggles */}
          <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#F8F6F0] mb-2">
              Security & Payment Controls
            </h3>

            {/* Freeze Switch */}
            <div className="flex items-center justify-between p-3 bg-[#131824] border border-[#242D40] rounded-xl">
              <div>
                <div className="text-xs font-semibold text-white">Card Lock & Freeze</div>
                <div className="text-[11px] text-[#A8A69E]">Instant block on all transactions</div>
              </div>
              <button
                onClick={toggleCardFrozen}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  cardFrozen ? 'bg-red-500' : 'bg-[#242D40]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    cardFrozen ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* PIN reveal */}
            <div className="flex items-center justify-between p-3 bg-[#131824] border border-[#242D40] rounded-xl">
              <div>
                <div className="text-xs font-semibold text-white">Card Chip & PIN</div>
                <div className="text-[11px] text-[#A8A69E]">
                  PIN: <span className="font-mono font-bold text-[#D4AF37]">{revealedPin ? '9042' : '••••'}</span>
                </div>
              </div>
              <button
                onClick={() => setRevealedPin(!revealedPin)}
                className="px-3 py-1 bg-[#1A2130] text-[#D4AF37] border border-[#242D40] rounded-lg text-xs font-medium"
              >
                {revealedPin ? 'Hide PIN' : 'View PIN'}
              </button>
            </div>

            {/* Contactless */}
            <div className="flex items-center justify-between p-3 bg-[#131824] border border-[#242D40] rounded-xl">
              <div>
                <div className="text-xs font-semibold text-white">Contactless NFC Payments</div>
                <div className="text-[11px] text-[#A8A69E]">Tap-to-pay at POS terminals up to R1,000 without PIN</div>
              </div>
              <button
                onClick={() => setContactless(!contactless)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  contactless ? 'bg-[#D4AF37]' : 'bg-[#242D40]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    contactless ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* International Roaming */}
            <div className="flex items-center justify-between p-3 bg-[#131824] border border-[#242D40] rounded-xl">
              <div>
                <div className="text-xs font-semibold text-white">International Travel Roaming</div>
                <div className="text-[11px] text-[#A8A69E]">Permit transactions outside South Africa</div>
              </div>
              <button
                onClick={() => setInternationalTravel(!internationalTravel)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  internationalTravel ? 'bg-[#D4AF37]' : 'bg-[#242D40]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    internationalTravel ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
