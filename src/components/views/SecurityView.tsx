import React from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Fingerprint,
  KeyRound,
  AlertTriangle,
  Laptop,
  CheckCircle2,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';

export const SecurityView: React.FC = () => {
  const {
    is2FAEnabled,
    setIs2FAEnabled,
    isBiometricsEnabled,
    setIsBiometricsEnabled,
    isGeofencingEnabled,
    setIsGeofencingEnabled,
    isEmergencyLocked,
    toggleEmergencyLock,
    addNotification,
  } = useAndes();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
            INSTITUTIONAL GRADE VAULT PROTECTION
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
            Security & Cryptographic Centre
          </h2>
          <p className="text-xs text-[#A8A69E] mt-1 max-w-xl">
            Hardware-backed tokens, biometric authentication, and sovereign emergency kill switches.
          </p>
        </div>

        {/* Emergency Kill Switch */}
        <button
          onClick={toggleEmergencyLock}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
            isEmergencyLocked
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
              : 'bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{isEmergencyLocked ? 'LOCKDOWN ACTIVE (TAP TO RESTORE)' : 'EMERGENCY ACCOUNT FREEZE'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Security Credentials (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E121B] border border-[#242D40] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#F8F6F0] pb-2 border-b border-[#242D40]">
            Authentication Controls
          </h3>

          {/* Biometrics */}
          <div className="flex items-center justify-between p-3.5 bg-[#131824] border border-[#242D40] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1A2130] border border-[#242D40] flex items-center justify-center text-[#D4AF37]">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Biometric FaceID / TouchID</div>
                <div className="text-[11px] text-[#A8A69E]">
                  Required for transfers exceeding R25,000
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !isBiometricsEnabled;
                setIsBiometricsEnabled(next);
                addNotification('Biometrics Updated', next ? 'Device biometrics enabled.' : 'Biometrics paused.', 'info');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isBiometricsEnabled ? 'bg-[#D4AF37]' : 'bg-[#242D40]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#080A0F] transition-transform ${
                  isBiometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Hardware 2FA */}
          <div className="flex items-center justify-between p-3.5 bg-[#131824] border border-[#242D40] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1A2130] border border-[#242D40] flex items-center justify-center text-[#D4AF37]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Hardware Key / TOTP 2FA</div>
                <div className="text-[11px] text-[#A8A69E]">
                  FIDO2 / WebAuthn token verified
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !is2FAEnabled;
                setIs2FAEnabled(next);
                addNotification('2FA Security', next ? 'Two-factor active.' : 'Two-factor paused.', 'info');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                is2FAEnabled ? 'bg-[#D4AF37]' : 'bg-[#242D40]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#080A0F] transition-transform ${
                  is2FAEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Geolocation Fencing */}
          <div className="flex items-center justify-between p-3.5 bg-[#131824] border border-[#242D40] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1A2130] border border-[#242D40] flex items-center justify-center text-[#D4AF37]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Geolocation Transaction Fencing</div>
                <div className="text-[11px] text-[#A8A69E]">
                  Authorizes in-person POS transactions matching phone GPS
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !isGeofencingEnabled;
                setIsGeofencingEnabled(next);
                addNotification('Geofencing Updated', next ? 'GPS location fence enabled.' : 'Location fence disabled.', 'info');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isGeofencingEnabled ? 'bg-[#D4AF37]' : 'bg-[#242D40]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#080A0F] transition-transform ${
                  isGeofencingEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right: Authorized Devices & Sessions (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E121B] border border-[#242D40] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#F8F6F0] pb-2 border-b border-[#242D40]">
            Authorized Devices & Keys
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-[#131824] border border-[#242D40] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">MacBook Pro 16″ (M3 Max)</div>
                  <div className="text-[10px] text-[#A8A69E]">Cape Town, South Africa · Current Session</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-medium">Active</span>
            </div>

            <div className="p-3 bg-[#131824] border border-[#242D40] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-neutral-300" />
                <div>
                  <div className="font-semibold text-white">iPhone 16 Pro (Titanium)</div>
                  <div className="text-[10px] text-[#A8A69E]">London, United Kingdom · 2h ago</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
