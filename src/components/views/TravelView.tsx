import React, { useState } from 'react';
import {
  Compass,
  Plane,
  ShieldCheck,
  QrCode,
  Sparkles,
  PhoneCall,
  Globe,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';
import { CurrencyCode } from '../../types';

export const TravelView: React.FC = () => {
  const { formatMoney, addNotification } = useAndes();

  const [activeDestination, setActiveDestination] = useState<{
    city: string;
    country: string;
    currency: CurrencyCode;
    flag: string;
    rate: string;
  }>({
    city: 'London',
    country: 'United Kingdom',
    currency: 'GBP',
    flag: '🇬🇧',
    rate: '1 GBP = 23.40 ZAR',
  });

  const destinations = [
    { city: 'London', country: 'United Kingdom', currency: 'GBP' as CurrencyCode, flag: '🇬🇧', rate: '1 GBP = 23.40 ZAR' },
    { city: 'Dubai', country: 'United Arab Emirates', currency: 'AED' as CurrencyCode, flag: '🇦🇪', rate: '1 AED = 4.97 ZAR' },
    { city: 'Lagos', country: 'Nigeria', currency: 'NGN' as CurrencyCode, flag: '🇳🇬', rate: '1 ZAR = 90.90 NGN' },
    { city: 'Nairobi', country: 'Kenya', currency: 'KES' as CurrencyCode, flag: '🇰🇪', rate: '1 ZAR = 7.09 KES' },
    { city: 'Paris', country: 'France / EU', currency: 'EUR' as CurrencyCode, flag: '🇪🇺', rate: '1 EUR = 19.85 ZAR' },
    { city: 'New York', country: 'United States', currency: 'USD' as CurrencyCode, flag: '🇺🇸', rate: '1 USD = 18.25 ZAR' },
    { city: 'Cape Town', country: 'South Africa', currency: 'ZAR' as CurrencyCode, flag: '🇿🇦', rate: 'Native Base (ZAR)' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
            GLOBAL CITIZEN PRIVILEGES
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
            Worldwide Travel & Concierge
          </h2>
          <p className="text-xs text-[#A8A69E] mt-1 max-w-xl">
            Seamless borderless spending without foreign transaction surcharges, accompanied by global VIP lounge access.
          </p>
        </div>

        <div className="p-3 bg-[#131824] border border-[#242D40] rounded-xl flex items-center gap-3">
          <Plane className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <div className="text-[10px] text-[#A8A69E]">FX Fees Saved (YTD)</div>
            <div className="font-mono text-base font-bold text-emerald-400">R24,850.00</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Destination Currency Auto-Router (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E121B] border border-[#242D40] rounded-xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-[#F8F6F0]">Active Travel Destination</h3>
            <p className="text-xs text-[#A8A69E] mt-0.5">
              Select your itinerary stop to optimize card debit routing directly in local currency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {destinations.map((d) => {
              const isSelected = activeDestination.city === d.city;
              return (
                <div
                  key={d.city}
                  onClick={() => {
                    setActiveDestination(d);
                    addNotification(
                      'Travel Corridor Synced',
                      `Card routing switched to native ${d.currency} for ${d.city}, ${d.country}.`,
                      'info'
                    );
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#131824] border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-md'
                      : 'bg-[#0E121B] border-[#242D40] hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{d.flag}</span>
                    <span className="text-[10px] font-mono text-[#D4AF37]">{d.currency}</span>
                  </div>
                  <div className="mt-2">
                    <div className="font-semibold text-xs text-white">{d.city}</div>
                    <div className="text-[11px] text-[#A8A69E]">{d.country}</div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-1">{d.rate}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency 24/7 Concierge */}
          <div className="pt-4 border-t border-[#242D40] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-white">Andes Private Global Concierge</div>
              <div className="text-[11px] text-[#A8A69E]">
                Dedicated private client desk for private charter, medical emergency & embassy wires
              </div>
            </div>

            <button
              onClick={() => {
                addNotification(
                  'Concierge Contacted',
                  'Your dedicated private banker in Mayfair, London (+44 20 7946 0992) has been notified.',
                  'success'
                );
              }}
              className="px-4 py-2 bg-[#131824] hover:bg-[#1A2130] border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Connect Concierge</span>
            </button>
          </div>
        </div>

        {/* Right: Digital Airport Lounge Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E121B] border border-[#242D40] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#242D40]">
            <div>
              <h3 className="text-sm font-semibold text-[#F8F6F0]">Priority VIP Lounge Pass</h3>
              <div className="text-xs text-[#A8A69E]">1,400+ International Airport Lounges</div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded">
              UNLIMITED VIP
            </span>
          </div>

          {/* Digital Boarding / Pass Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-[#181D28] via-[#0E121B] to-[#080A0F] border border-[#D4AF37]/30 text-white space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-serif tracking-widest text-xs font-bold text-[#D4AF37]">
                  ANDES SKY VAULT
                </div>
                <div className="text-[9px] text-[#A8A69E] uppercase tracking-wider">
                  Prestige Lounge Access Pass
                </div>
              </div>
              <span className="font-mono text-xs text-white">#0084-VIP</span>
            </div>

            {/* Simulated QR Code for scanner */}
            <div className="p-3 bg-white rounded-lg flex items-center justify-center mx-auto w-32 h-32 shadow-inner">
              <QrCode className="w-24 h-24 text-black" />
            </div>

            <div className="text-center text-[10px] text-neutral-400 font-mono">
              SCAN AT LHR T5, JNB O.R. TAMBO, NBO JKIA, OR CDG 2E
            </div>

            <div className="pt-2 border-t border-[#242D40] flex justify-between text-[11px] text-[#A8A69E]">
              <span>Alexander Sterling</span>
              <span className="text-[#D4AF37]">Valid thru 12/2028</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
