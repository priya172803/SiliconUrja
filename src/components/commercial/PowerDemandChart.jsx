import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sun, 
  Zap, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Info,
  Calendar,
  Filter
} from 'lucide-react';
import { HOURLY_LOAD_CURVE } from './energyData';

export function PowerDemandChart({ preCoolingActive }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showSolarOverlay, setShowSolarOverlay] = useState(true);
  const [showBaselineOverlay, setShowBaselineOverlay] = useState(true);

  // SVG Chart dimensions
  const width = 900;
  const height = 260;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = 2200; // max kVA on Y axis
  const minVal = 0;

  const getX = (index) => padding.left + (index / (HOURLY_LOAD_CURVE.length - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;

  // Compute points for demand curve (with pre-cooling simulation if active)
  const demandPoints = HOURLY_LOAD_CURVE.map((d, i) => {
    let demand = d.demandKVA;
    if (preCoolingActive) {
      if (d.time === "16:00") demand = 1920; // Pre-cooling pre-load
      if (d.time === "18:00") demand = 1400; // Slashed during peak
      if (d.time === "20:00") demand = 1320; // Slashed during peak
    }
    return { ...d, actualDemand: demand, x: getX(i), y: getY(demand) };
  });

  const solarPoints = HOURLY_LOAD_CURVE.map((d, i) => ({
    ...d,
    x: getX(i),
    y: getY(d.solarKW)
  }));

  const baselinePoints = HOURLY_LOAD_CURVE.map((d, i) => ({
    ...d,
    x: getX(i),
    y: getY(d.baselineKVA)
  }));

  // Build SVG path strings
  const demandPath = demandPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const solarPath = solarPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const baselinePath = baselinePoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  // Fill area under demand
  const demandAreaPath = `${demandPath} L ${demandPoints[demandPoints.length - 1].x} ${getY(0)} L ${demandPoints[0].x} ${getY(0)} Z`;
  const solarAreaPath = `${solarPath} L ${solarPoints[solarPoints.length - 1].x} ${getY(0)} L ${solarPoints[0].x} ${getY(0)} Z`;

  // 2,000 kVA Contract Limit Y position
  const limitY = getY(2000);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 shadow-xs mb-6">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              24-Hour Active Demand & Solar Generation Curve
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time load profile vs 2,000 kVA BESCOM Contract Limit & Time-of-Day (ToD) tariff windows
          </p>
        </div>

        {/* Legend / Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-blue-600 rounded-full" />
            <span className="text-slate-700 font-semibold">Active kVA Demand</span>
          </div>
          
          <button
            onClick={() => setShowSolarOverlay(!showSolarOverlay)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
              showSolarOverlay 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Rooftop Solar (kW)</span>
          </button>

          <button
            onClick={() => setShowBaselineOverlay(!showBaselineOverlay)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
              showBaselineOverlay 
                ? 'bg-blue-50 border-blue-200 text-blue-800 font-semibold' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2.5 h-0.5 bg-slate-400 border-dashed" />
            <span>Baseline (Unmanaged)</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500" />
            <span className="text-rose-600 font-mono text-[11px] font-bold">2,000 kVA CMD Limit</span>
          </div>
        </div>
      </div>

      {/* Pre-Cooling Impact Callout Banner when Active */}
      {preCoolingActive && (
        <div className="mb-3.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex flex-wrap items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900">Automated Pre-Cooling Shift Active:</span>
            <span>280 kVA Peak Demand shaved during BESCOM 18:00 - 22:00 IST Window</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-700 font-semibold">Thermal Mass: 740 Ton-Hrs</span>
            <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              Savings: ₹22,400 / day
            </span>
          </div>
        </div>
      )}

      {/* Interactive Responsive SVG Area Chart */}
      <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-xl p-2 border border-slate-100">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="blueDemandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
              <stop offset="90%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="solarGradLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="95%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Pattern for Peak BESCOM tariff window */}
            <pattern id="peakHatchLight" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.25" />
            </pattern>
          </defs>

          {/* Time-of-Day Tariff Background Bands */}
          {/* Off-peak night: 00:00 to 06:00 */}
          <rect 
            x={padding.left} 
            y={padding.top} 
            width={getX(3) - padding.left} 
            height={graphHeight} 
            fill="#dbeafe" 
            fillOpacity="0.35" 
          />
          {/* Peak window: 18:00 to 22:00 */}
          <rect 
            x={getX(9)} 
            y={padding.top} 
            width={getX(11) - getX(9)} 
            height={graphHeight} 
            fill="url(#peakHatchLight)" 
          />
          <rect 
            x={getX(9)} 
            y={padding.top} 
            width={getX(11) - getX(9)} 
            height={graphHeight} 
            fill="#ffe4e6" 
            fillOpacity="0.3" 
          />

          {/* Grid lines (horizontal) */}
          {[500, 1000, 1500, 2000].map((val) => (
            <g key={val}>
              <line 
                x1={padding.left} 
                y1={getY(val)} 
                x2={width - padding.right} 
                y2={getY(val)} 
                stroke={val === 2000 ? '#f43f5e' : '#e2e8f0'} 
                strokeWidth={val === 2000 ? '1.5' : '1'} 
                strokeDasharray={val === 2000 ? '4 3' : '2 4'}
              />
              <text 
                x={padding.left - 8} 
                y={getY(val) + 4} 
                textAnchor="end" 
                className="text-[10px] font-mono fill-slate-400"
              >
                {val}
              </text>
            </g>
          ))}

          {/* 2,000 kVA CMD Label */}
          <text 
            x={width - padding.right - 5} 
            y={limitY - 6} 
            textAnchor="end" 
            className="text-[10px] font-mono font-bold fill-rose-600 tracking-wider uppercase"
          >
            BESCOM CMD Limit: 2,000 kVA
          </text>

          {/* Baseline Curve (Unmanaged) */}
          {showBaselineOverlay && (
            <path 
              d={baselinePath} 
              fill="none" 
              stroke="#94a3b8" 
              strokeWidth="2" 
              strokeDasharray="4 4" 
              strokeOpacity="0.8"
            />
          )}

          {/* Rooftop Solar Generation Area & Line */}
          {showSolarOverlay && (
            <>
              <path d={solarAreaPath} fill="url(#solarGradLight)" />
              <path 
                d={solarPath} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
            </>
          )}

          {/* Active Demand Area & Line */}
          <path d={demandAreaPath} fill="url(#blueDemandGrad)" />
          <path 
            d={demandPath} 
            fill="none" 
            stroke="#2563eb" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* X Axis Time Labels */}
          {HOURLY_LOAD_CURVE.map((d, i) => (
            <g key={i}>
              <line 
                x1={getX(i)} 
                y1={padding.top + graphHeight} 
                x2={getX(i)} 
                y2={padding.top + graphHeight + 5} 
                stroke="#cbd5e1" 
              />
              <text 
                x={getX(i)} 
                y={padding.top + graphHeight + 18} 
                textAnchor="middle" 
                className="text-[10px] font-mono fill-slate-500 font-medium"
              >
                {d.time}
              </text>
            </g>
          ))}

          {/* Interactive Data Points & Hover Targets */}
          {demandPoints.map((p, i) => (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(p)} onMouseLeave={() => setHoveredPoint(null)}>
              {/* Hit target */}
              <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
              
              {/* Visible circle */}
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={hoveredPoint?.time === p.time ? '6' : '3.5'} 
                fill="#2563eb" 
                stroke="#ffffff" 
                strokeWidth="2" 
                className="transition-all"
              />

              {/* Peak indicator highlight at 16:00 */}
              {p.time === "16:00" && (
                <circle cx={p.x} cy={p.y} r="9" fill="none" stroke="#2563eb" strokeWidth="1.5" className="animate-ping" />
              )}
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div 
            className="absolute z-20 pointer-events-none bg-white border border-blue-200 rounded-xl p-3 shadow-xl text-xs font-mono min-w-[200px]"
            style={{ 
              left: `${(hoveredPoint.x / width) * 100}%`, 
              top: `${(hoveredPoint.y / height) * 100}%`,
              transform: 'translate(-50%, -115%)'
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
              <span className="font-bold text-slate-900">{hoveredPoint.time} IST</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                {hoveredPoint.tariffZone}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Active Demand:</span>
                <span className="font-bold text-blue-700">{hoveredPoint.actualDemand} kVA</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Solar Generation:</span>
                <span className="font-bold text-emerald-600">{hoveredPoint.solarKW} kW</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>BESCOM Tariff:</span>
                <span className="text-amber-700 font-bold">₹{hoveredPoint.tariffRate.toFixed(2)} / kWh</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time-of-Day Tariff Explanation Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-100 border border-blue-300" />
            <span>Off-Peak (22:00 - 06:00): ₹5.80/unit (-₹1.00 Rebate)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-200 border border-slate-300" />
            <span>Normal (06:00 - 18:00): ₹6.80/unit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-300" />
            <span className="text-rose-700 font-semibold">BESCOM Peak Surcharge (18:00 - 22:00): ₹8.30/unit (+₹1.50)</span>
          </div>
        </div>

        <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1">
          <span>Rooftop Solar Peak Contribution:</span>
          <strong className="text-slate-900">790 kW at 12:00 IST</strong>
        </div>
      </div>

    </div>
  );
}
