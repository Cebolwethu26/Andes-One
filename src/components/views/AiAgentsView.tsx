import React from 'react';
import {
  Bot,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Sliders,
  Play,
  Terminal,
} from 'lucide-react';
import { useAndes } from '../../context/AndesContext';

export const AiAgentsView: React.FC = () => {
  const {
    aiAgents,
    toggleAgent,
    triggerAgentScan,
    isScanningAgents,
    addNotification,
  } = useAndes();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
            AUTONOMOUS TREASURY INTELLIGENCE
          </span>
          <h2 className="text-xl font-serif font-bold text-[#F8F6F0] mt-0.5">
            Andes Autonomous Financial Agents
          </h2>
          <p className="text-xs text-[#A8A69E] mt-1 max-w-2xl">
            Self-executing algorithmic routines that hedge foreign exchange exposure, eliminate card conversion fees, and optimize idle portfolio yields.
          </p>
        </div>

        <button
          onClick={triggerAgentScan}
          disabled={isScanningAgents}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:from-[#E5C378] hover:to-[#D4AF37] text-[#080A0F] font-bold text-xs rounded-xl shadow-lg transition-all shrink-0 disabled:opacity-50"
        >
          {isScanningAgents ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{isScanningAgents ? 'Auditing Portfolios...' : 'Initiate Optimization Audit'}</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiAgents.map((agent) => (
          <div
            key={agent.id}
            className={`p-6 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              agent.enabled
                ? 'bg-[#0E121B] border-[#242D40] hover:border-[#D4AF37]/50 shadow-sm'
                : 'bg-[#0A0D14] border-[#1A2130] opacity-75'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                      agent.enabled
                        ? 'bg-[#131824] border-[#D4AF37]/40 text-[#D4AF37]'
                        : 'bg-[#131824] border-[#242D40] text-neutral-500'
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">{agent.name}</h3>
                    <div className="text-[11px] text-[#D4AF37]">{agent.tagline}</div>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleAgent(agent.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    agent.enabled ? 'bg-[#D4AF37]' : 'bg-[#242D40]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#080A0F] transition-transform ${
                      agent.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-[#A8A69E] leading-relaxed mb-4">
                {agent.description}
              </p>

              {/* Parameters table */}
              <div className="bg-[#131824] border border-[#242D40] rounded-lg p-3 space-y-2 mb-4">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#A8A69E]">
                  Autonomous Policy Rules
                </div>
                {agent.parameters.map((p) => (
                  <div key={p.label} className="flex justify-between text-xs">
                    <span className="text-[#A8A69E]">{p.label}</span>
                    <span className="font-mono text-white font-medium">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Status & Performance */}
            <div className="pt-3 border-t border-[#242D40] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    agent.enabled ? 'bg-emerald-400' : 'bg-neutral-600'
                  }`}
                />
                <span className="text-neutral-300 font-medium capitalize">
                  {agent.enabled ? agent.status : 'Paused'}
                </span>
                <span aria-hidden="true" className="text-[#A8A69E]">·</span>
                <span className="text-emerald-400 font-mono font-medium">
                  {agent.savingsGenerated}
                </span>
              </div>

              <div className="text-[10px] text-[#A8A69E] truncate">
                {agent.lastAction}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Autonomous Action Logs */}
      <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs font-semibold text-[#F8F6F0] uppercase tracking-wider">
            Live Agent Execution Telemetry
          </h3>
        </div>

        <div className="bg-[#080A0F] border border-[#242D40] rounded-lg p-3 font-mono text-[11px] text-[#A8A69E] space-y-1.5 overflow-x-auto">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="text-[#D4AF37]">[14:28:11]</span>
            <span>Global Spend Concierge: Transaction R3,250.00 routed to native ZAR vault. 0% FX penalty.</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="text-[#D4AF37]">[11:05:42]</span>
            <span>Quantum Anomaly Shield: Multi-currency tap verified with Cape Town geofence coordinates.</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="text-[#D4AF37]">[08:00:00]</span>
            <span>Andes Volatility Guard: USD/ZAR median monitored @ 18.25. Rate lock ceiling verified @ 18.40.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
