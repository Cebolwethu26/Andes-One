import React, { useState } from 'react';
import { Shield, Wifi, Eye, EyeOff, Lock, Sparkles } from 'lucide-react';
import { useAndes } from '../context/AndesContext';

interface LuxuryCardProps {
  variant?: 'obsidian' | 'champagne';
  showControls?: boolean;
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  variant = 'obsidian',
  showControls = true,
}) => {
  const { cardFrozen, toggleCardFrozen, cardSpendingLimit, setCardSpendingLimit, addNotification } = useAndes();
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const cardNumber = showFullDetails ? '4891 8842 9102 7741' : '•••• •••• •••• 7741';
  const cvv = showFullDetails ? '842' : '•••';

  return (
    <div className="flex flex-col gap-4">
      {/* 3D Glass / Metal Physical Card */}
      <div 
        className="relative w-full max-w-[420px] aspect-[1.586/1] rounded-2xl p-6 transition-all duration-300 select-none cursor-pointer group shadow-2xl overflow-hidden"
        style={{
          perspective: '1000px',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Background metallic gradient & grain */}
        {variant === 'obsidian' ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#181D28] via-[#0E121B] to-[#080A0F] border border-[#D4AF37]/25 rounded-2xl">
            {/* Subtle luxury light sweep */}
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent rotate-45 transform group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAD29A] via-[#D4AF37] to-[#8C6D23] border border-[#FFF0D0]/40 rounded-2xl text-[#0B0E14]">
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 transform group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />
          </div>
        )}

        {/* Frozen Overlay */}
        {cardFrozen && (
          <div className="absolute inset-0 bg-[#080A0F]/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-500/30 text-white">
            <Lock className="w-8 h-8 text-red-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-red-300">Card Locked & Frozen</span>
            <span className="text-[11px] text-neutral-400">Tap unfreeze below to restore transactions</span>
          </div>
        )}

        {/* Card Front Content */}
        {!isFlipped ? (
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top Row: Brand & Contactless */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border border-[#D4AF37]/60 flex items-center justify-center">
                    <span className="font-serif text-[10px] font-bold text-[#D4AF37]">A</span>
                  </div>
                  <span className={`font-serif tracking-widest text-xs font-bold uppercase ${variant === 'obsidian' ? 'text-[#F8F6F0]' : 'text-[#0E121B]'}`}>
                    ANDES ONE
                  </span>
                </div>
                <div className={`text-[9px] tracking-wider uppercase font-medium mt-0.5 ${variant === 'obsidian' ? 'text-[#D4AF37]' : 'text-[#0E121B]/80'}`}>
                  Obsidian Metal · Private Client
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wifi className={`w-4 h-4 rotate-90 ${variant === 'obsidian' ? 'text-[#D4AF37]/80' : 'text-[#0E121B]/80'}`} />
                <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${variant === 'obsidian' ? 'border-[#D4AF37]/30 text-[#D4AF37]' : 'border-[#0E121B]/40 text-[#0E121B]'}`}>
                  Multi-Currency
                </span>
              </div>
            </div>

            {/* Middle Row: EMV Chip & Hologram */}
            <div className="flex items-center gap-4 my-auto">
              <div className="w-10 h-7 rounded bg-gradient-to-br from-[#E6C687] via-[#D4AF37] to-[#997722] border border-[#FFF0D0]/50 p-1 flex flex-col justify-between shadow-inner">
                <div className="border-b border-[#7A5B12]/40 h-1/2 w-full" />
                <div className="border-t border-[#7A5B12]/40 h-1/2 w-full" />
              </div>
              <div className={`text-[10px] font-mono tracking-widest ${variant === 'obsidian' ? 'text-neutral-400' : 'text-[#0E121B]/70'}`}>
                ANDES INSTANT CLEARING
              </div>
            </div>

            {/* Bottom Row: Card Details & Network */}
            <div>
              <div className={`font-mono text-base tracking-[0.25em] font-medium tabular-nums ${variant === 'obsidian' ? 'text-[#F8F6F0]' : 'text-[#0E121B]'}`}>
                {cardNumber}
              </div>

              <div className="flex items-end justify-between mt-3 text-[10px]">
                <div>
                  <div className={`uppercase tracking-wider text-[8px] ${variant === 'obsidian' ? 'text-neutral-400' : 'text-[#0E121B]/70'}`}>Cardholder</div>
                  <div className={`font-medium tracking-wide uppercase ${variant === 'obsidian' ? 'text-[#F8F6F0]' : 'text-[#0E121B]'}`}>ALEXANDER STERLING</div>
                </div>

                <div>
                  <div className={`uppercase tracking-wider text-[8px] ${variant === 'obsidian' ? 'text-neutral-400' : 'text-[#0E121B]/70'}`}>Expires</div>
                  <div className={`font-mono tabular-nums font-medium ${variant === 'obsidian' ? 'text-[#F8F6F0]' : 'text-[#0E121B]'}`}>09/30</div>
                </div>

                {/* Mastercard / Visa / Andes Worldwide insignia */}
                <div className="flex items-center -space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#EB001B]/90 shadow-sm" />
                  <div className="w-5 h-5 rounded-full bg-[#F79E1B]/90 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Card Back */
          <div className="relative z-10 flex flex-col justify-between h-full py-1">
            {/* Magnetic Stripe */}
            <div className="-mx-6 h-9 bg-neutral-900 border-y border-neutral-700/50 mb-3" />
            
            <div className="flex items-center justify-between px-2 text-[10px]">
              <span className="text-neutral-400 font-mono text-[9px]">AUTHORIZED SIGNATURE · NOT TRANSFERABLE</span>
              <div className="bg-white text-black font-mono px-3 py-1 text-xs font-bold rounded-sm tracking-widest">
                CVV: {cvv}
              </div>
            </div>

            <div className="mt-4 text-[9px] text-neutral-400 leading-tight">
              Issued under license by Andes Global Clearing Ltd. Protected by 256-bit biometrics. For 24/7 global private concierge call +44 20 7946 0992 or access Andes Travel Emergency.
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#D4AF37] pt-2 border-t border-white/10">
              <span className="font-mono">ID: ANDES-0084-VIP</span>
              <span className="text-[9px] text-neutral-400">Tap to flip back</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Card Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-[420px] pt-1">
          <button
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-[#131824] hover:bg-[#1A2130] border border-[#242D40] rounded-lg transition-colors"
          >
            {showFullDetails ? <EyeOff className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span>{showFullDetails ? 'Hide Numbers' : 'Reveal Numbers'}</span>
          </button>

          <button
            onClick={toggleCardFrozen}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              cardFrozen
                ? 'bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900/50'
                : 'bg-[#131824] hover:bg-[#1A2130] border-[#242D40] text-neutral-300 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{cardFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
          </button>

          <button
            onClick={() => {
              addNotification('Apple & Google Wallet Ready', 'Andes Obsidian card provisioned for contactless Apple Pay & Google Wallet.', 'success');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apple / Google Pay</span>
          </button>
        </div>
      )}
    </div>
  );
};
