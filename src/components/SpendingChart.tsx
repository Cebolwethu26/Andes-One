import React, { useState } from 'react';
import { useAndes } from '../context/AndesContext';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

type Timeframe = '7D' | '30D' | '90D' | '1Y';

export const SpendingChart: React.FC = () => {
  const { baseCurrency, formatMoney } = useAndes();
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; date: string; amount: number; category: string } | null>(null);

  // Data sets for each timeframe
  const dataSets: Record<Timeframe, { date: string; amount: number; category: string }[]> = {
    '7D': [
      { date: 'Mon', amount: 1450, category: 'Dining' },
      { date: 'Tue', amount: 890, category: 'Business' },
      { date: 'Wed', amount: 3200, category: 'Travel' },
      { date: 'Thu', amount: 450, category: 'Subscriptions' },
      { date: 'Fri', amount: 2100, category: 'Dining' },
      { date: 'Sat', amount: 3250, category: 'Travel' },
      { date: 'Sun', amount: 1800, category: 'FX Hedging' },
    ],
    '30D': [
      { date: 'Oct 08', amount: 2400, category: 'Travel' },
      { date: 'Oct 12', amount: 1800, category: 'Dining' },
      { date: 'Oct 16', amount: 4100, category: 'Business' },
      { date: 'Oct 20', amount: 2900, category: 'Travel' },
      { date: 'Oct 24', amount: 1200, category: 'Subscriptions' },
      { date: 'Oct 28', amount: 5600, category: 'FX Hedging' },
      { date: 'Nov 01', amount: 3400, category: 'Travel' },
      { date: 'Nov 04', amount: 4800, category: 'Dining' },
      { date: 'Nov 07', amount: 3250, category: 'Lifestyle' },
    ],
    '90D': [
      { date: 'Sep W1', amount: 11200, category: 'Quarterly Travel' },
      { date: 'Sep W3', amount: 8400, category: 'Syndicate Wire' },
      { date: 'Oct W1', amount: 14600, category: 'Aviation & Hotels' },
      { date: 'Oct W3', amount: 9800, category: 'Treasury Hedge' },
      { date: 'Nov W1', amount: 13140, category: 'Current Cycle' },
    ],
    '1Y': [
      { date: 'Q1', amount: 42000, category: 'Europe & UK Roadshow' },
      { date: 'Q2', amount: 38500, category: 'African Expansion' },
      { date: 'Q3', amount: 54100, category: 'US Venture Syndicate' },
      { date: 'Q4', amount: 49200, category: 'Year-End Institutional' },
    ],
  };

  const currentData = dataSets[timeframe];
  const maxAmount = Math.max(...currentData.map((d) => d.amount)) * 1.15;
  const minAmount = 0;

  // Chart coordinates calculation
  const width = 640;
  const height = 210;
  const paddingX = 40;
  const paddingY = 25;

  const points = currentData.map((d, index) => {
    const x = paddingX + (index / (currentData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.amount - minAmount) / (maxAmount - minAmount)) * (height - paddingY * 2);
    return { ...d, x, y };
  });

  // Build SVG path with cubic bezier curves
  const pathD = points.reduce((acc, curr, index, arr) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[index - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpX1 ? cpY1 : ''}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const totalPeriodSpend = currentData.reduce((acc, d) => acc + d.amount, 0);

  const categories = [
    { name: 'Travel & Aviation', pct: '38%', color: '#D4AF37' },
    { name: 'Private Dining', pct: '24%', color: '#E5C378' },
    { name: 'FX & Hedging', pct: '20%', color: '#9B7823' },
    { name: 'Cloud & Tech', pct: '18%', color: '#6A541A' },
  ];

  return (
    <div className="bg-[#0E121B] border border-[#242D40] rounded-xl p-5 flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#242D40]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#F8F6F0]">Global Spending Overview</h3>
            <span className="text-[11px] text-[#A8A69E]">· 5 Active Currencies</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono tabular-nums text-[#D4AF37]">
              {formatMoney(totalPeriodSpend, baseCurrency)}
            </span>
            <span className="text-xs text-emerald-400 flex items-center font-medium">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              -4.2% vs last cycle
            </span>
          </div>
        </div>

        {/* Timeframe Selector (Interactive Buttons) */}
        <div className="flex items-center gap-1 p-1 bg-[#131824] border border-[#242D40] rounded-lg self-start sm:self-auto">
          {(['7D', '30D', '90D', '1Y'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setHoveredPoint(null);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-[#D4AF37] text-[#080A0F] font-semibold shadow-sm'
                  : 'text-[#A8A69E] hover:text-[#F8F6F0] hover:bg-[#1A2130]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative w-full h-[210px] mt-2 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#D4AF37" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#AA8220" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#FFF0D0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#1A2130"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#spendingGradient)" />

          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.date === p.date ? 6 : 3.5}
                fill={hoveredPoint?.date === p.date ? '#FFF0D0' : '#D4AF37'}
                stroke="#080A0F"
                strokeWidth="2"
                className="transition-all duration-150"
                onMouseEnter={() => setHoveredPoint(p)}
                onClick={() => setHoveredPoint(p)}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="text-[10px] fill-[#7E8B9B] font-mono select-none"
            >
              {p.date}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full bg-[#131824]/95 backdrop-blur border border-[#D4AF37]/50 rounded-lg p-2 shadow-xl z-20 text-xs min-w-[120px]"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100 - 8}%`,
            }}
          >
            <div className="text-[10px] text-[#A8A69E] uppercase tracking-wider">{hoveredPoint.date}</div>
            <div className="font-mono font-bold text-[#F8F6F0] tabular-nums mt-0.5">
              {formatMoney(hoveredPoint.amount, baseCurrency)}
            </div>
            <div className="text-[10px] text-[#D4AF37] mt-0.5">{hoveredPoint.category}</div>
          </div>
        )}
      </div>

      {/* Category breakdown bar */}
      <div className="mt-4 pt-3 border-t border-[#242D40] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        {categories.map((c) => (
          <div key={c.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
            <span className="text-[#A8A69E] truncate">{c.name}</span>
            <span className="font-mono text-[#F8F6F0] font-medium ml-auto tabular-nums">{c.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
