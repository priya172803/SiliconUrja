import React, { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Sliders,
  IndianRupee,
  Leaf,
  Zap,
  RotateCcw,
  Sparkles,
  Play,
  TrendingUp,
  Info,
} from 'lucide-react';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const BASELINE = {
  carbonTax: 1200,
  reSubsidy: 20,
  peakPenalty: 1.5,
};

function computeSimulation({ carbonTax, reSubsidy, peakPenalty }) {
  const stabilityBase = 82;
  const stabilityGainFromRE = (reSubsidy - BASELINE.reSubsidy) * 0.18;
  const stabilityLossFromPenalty = (peakPenalty - BASELINE.peakPenalty) > 0
    ? (peakPenalty - BASELINE.peakPenalty) * -0.9
    : (BASELINE.peakPenalty - peakPenalty) * 0.5;
  const stabilityGainFromTax = (carbonTax - BASELINE.carbonTax) * 0.0015;
  const stabilityIndex = Math.min(99, Math.max(50, stabilityBase + stabilityGainFromRE + stabilityLossFromPenalty + stabilityGainFromTax));

  const emissionBase = 8.0;
  const emissionFromTax = (carbonTax / BASELINE.carbonTax - 1) * 6.5;
  const emissionFromRE = (reSubsidy / BASELINE.reSubsidy - 1) * 4.8;
  const emissionFromPenalty = (peakPenalty - BASELINE.peakPenalty) * 1.8;
  const emissionReductionPct = Math.min(45, Math.max(0, emissionBase + emissionFromTax + emissionFromRE + emissionFromPenalty));

  const revenueFromTax = (carbonTax / 1000) * 420;
  const revenueCostFromSubsidy = reSubsidy * 28;
  const revenueFromPenalty = (peakPenalty - 1) * 185;
  const revenueShiftCr = Math.max(0, Math.round(revenueFromTax - revenueCostFromSubsidy + revenueFromPenalty));

  const peakShavedMW = Math.round((peakPenalty - 1) * 320 + (reSubsidy / 100) * 480 + (carbonTax / 1000) * 150);
  const reProjectedPct = Math.min(90, 46 + (reSubsidy - BASELINE.reSubsidy) * 0.55);

  return {
    stabilityIndex: stabilityIndex.toFixed(1),
    emissionReductionPct: emissionReductionPct.toFixed(1),
    revenueShiftCr: revenueShiftCr.toLocaleString(),
    peakShavedMW,
    reProjectedPct: reProjectedPct.toFixed(1),
  };
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  const toRad = (d) => ((d - 180) * Math.PI) / 180;
  const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) };
  const end = { x: cx + r * Math.cos(toRad(endDeg)), y: cy + r * Math.sin(toRad(endDeg)) };
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const GaugeArc = ({ value, min = 0, max = 100, label, sublabel, color, unit = '%', warningThreshold = null }) => {
  const normalised = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const angle = normalised * 180;
  const r = 54;
  const cx = 70;
  const cy = 65;

  const trackD = describeArc(cx, cy, r, 0, 180);
  const fillD = angle > 0 ? describeArc(cx, cy, r, 0, angle) : '';
  const isWarning = warningThreshold && value < warningThreshold;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 80" className="w-full max-w-[200px]">
        <path d={trackD} stroke="#e2e8f0" strokeWidth="12" fill="none" strokeLinecap="round" />
        {fillD && (
          <path
            d={fillD}
            stroke={isWarning ? '#dc2626' : color}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
        )}
        <line
          x1={cx}
          y1={cy}
          x2={cx + (r - 6) * Math.cos(((angle - 180) * Math.PI) / 180)}
          y2={cy + (r - 6) * Math.sin(((angle - 180) * Math.PI) / 180)}
          stroke="#334155"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="4.5" fill="#ffffff" stroke="#334155" strokeWidth="2" />
        <text x={cx} y={cy - 12} textAnchor="middle" fill={isWarning ? '#dc2626' : color} fontSize="17" fontWeight="900" fontFamily="JetBrains Mono, monospace">
          {parseFloat(value).toFixed(1)}{unit}
        </text>
      </svg>
      <div className="text-center -mt-2">
        <div className="text-xs font-bold text-slate-800 font-mono">{label}</div>
        {sublabel && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
};

const SliderControl = ({ label, description, value, min, max, step, onChange, unit, color, leftLabel, rightLabel, icon: Icon }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm hover:border-blue-400 transition">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{label}</div>
            <div className="text-[10px] text-slate-500 font-mono">{description}</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black font-mono" style={{ color }}>
            {typeof value === 'number' && unit === '₹' ? `₹${value.toLocaleString()}` : `${value}${unit}`}
          </span>
        </div>
      </div>

      <div className="relative mt-3 mb-1">
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-100 pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-2">
        <span>{leftLabel || `${unit}${min}`}</span>
        <span>{rightLabel || `${unit}${max}`}</span>
      </div>
    </div>
  );
};

export default function PolicySandboxView({ policyParams, setPolicyParams }) {
  const [simResult, setSimResult] = useState(() => computeSimulation(policyParams));
  const [isAnimating, setIsAnimating] = useState(false);
  const computeDebounced = useRef(null);

  const presets = [
    { name: 'Aggressive Carbon Tax', params: { carbonTax: 3500, reSubsidy: 30, peakPenalty: 2.8 } },
    { name: 'Renewable Accelerator', params: { carbonTax: 1500, reSubsidy: 55, peakPenalty: 1.8 } },
    { name: 'Demand-Side Management', params: { carbonTax: 2000, reSubsidy: 25, peakPenalty: 3.5 } },
    { name: 'Revenue Maximisation', params: { carbonTax: 2800, reSubsidy: 15, peakPenalty: 2.2 } },
  ];

  const handleChange = (key) => (val) => {
    const updated = { ...policyParams, [key]: val };
    setPolicyParams(updated);
    clearTimeout(computeDebounced.current);
    computeDebounced.current = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setSimResult(computeSimulation(updated));
        setIsAnimating(false);
      }, 150);
    }, 40);
  };

  const handlePreset = (preset) => {
    setPolicyParams(preset.params);
    setIsAnimating(true);
    setTimeout(() => {
      setSimResult(computeSimulation(preset.params));
      setIsAnimating(false);
    }, 180);
  };

  const handleReset = () => handlePreset({ params: BASELINE });

  const comparisonData = {
    labels: ['Stability Index (%)', 'Emission Reduction (%)', 'RE Penetration (%)'],
    datasets: [
      {
        label: 'Baseline Policy',
        data: [82, 8, 46],
        backgroundColor: 'rgba(148, 163, 184, 0.7)',
        borderColor: '#94a3b8',
        borderWidth: 1.5,
        borderRadius: 4,
      },
      {
        label: 'Simulated Policy',
        data: [
          parseFloat(simResult.stabilityIndex),
          parseFloat(simResult.emissionReductionPct),
          parseFloat(simResult.reProjectedPct),
        ],
        backgroundColor: ['rgba(37, 99, 235, 0.85)', 'rgba(22, 163, 74, 0.85)', 'rgba(217, 119, 6, 0.85)'],
        borderColor: ['#2563eb', '#16a34a', '#d97706'],
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  const comparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono, monospace', size: 10, weight: 'bold' } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono, monospace', size: 10 }, callback: (v) => `${v}%` },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#334155', font: { family: 'JetBrains Mono, monospace', size: 10, weight: 'bold' }, boxWidth: 10, padding: 12 },
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#93c5fd',
        borderWidth: 1.5,
        titleColor: '#0f172a',
        bodyColor: '#334155',
        titleFont: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 10 },
        padding: 10,
        cornerRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-blue-200 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
            <Sliders className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Policy "What-If" Sandbox Simulator</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Recalculates in real-time based on Karnataka Grid Econometric Model v2.4.1
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Preset Scenario Pills */}
      <div>
        <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold mb-2 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Policy Presets — Click to Apply</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePreset(p)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-mono font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <Play className="w-2.5 h-2.5 text-blue-600" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Sliders Column */}
        <div className="xl:col-span-2 space-y-4">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Policy Control Levers</span>
          </div>

          <SliderControl
            label="Carbon Tax Multiplier"
            description="Levied per tonne of CO2 emitted beyond monthly quota"
            value={policyParams.carbonTax}
            min={500}
            max={5000}
            step={100}
            onChange={handleChange('carbonTax')}
            unit="₹"
            color="#2563eb"
            leftLabel="₹500/t (Low)"
            rightLabel="₹5,000/t (Punitive)"
            icon={IndianRupee}
          />

          <SliderControl
            label="Renewable Energy Subsidy Rate"
            description="Capital & operational incentive for commercial & rooftop solar"
            value={policyParams.reSubsidy}
            min={5}
            max={50}
            step={1}
            onChange={handleChange('reSubsidy')}
            unit="%"
            color="#16a34a"
            leftLabel="5% (Min)"
            rightLabel="50% (Max Incentive)"
            icon={Leaf}
          />

          <SliderControl
            label="Industrial Peak-Hour Penalty Multiplier"
            description="Tariff multiplier applied during 18:00–22:00 high-demand window"
            value={policyParams.peakPenalty}
            min={1.0}
            max={3.5}
            step={0.1}
            onChange={handleChange('peakPenalty')}
            unit="×"
            color="#d97706"
            leftLabel="1.0× (Flat rate)"
            rightLabel="3.5× (Peak deterrent)"
            icon={Zap}
          />

          {/* Active Applied Policy Summary */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-blue-900 uppercase tracking-wider font-bold mb-3">
              Active Simulation Parameters
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">Carbon Tax Rate</span>
                <span className="text-blue-900 font-bold">₹{policyParams.carbonTax.toLocaleString()} / tCO2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">RE Capital Subsidy</span>
                <span className="text-emerald-800 font-bold">{policyParams.reSubsidy}% of project cost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Peak Tariff Multiplier</span>
                <span className="text-amber-800 font-bold">{policyParams.peakPenalty.toFixed(1)}× base rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Recalculation Results Column */}
        <div className="xl:col-span-3 space-y-4">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold mb-1 flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Projected Dynamic Recalculation Gauges</span>
          </div>

          {/* 3 Gauges */}
          <div className={`grid grid-cols-3 gap-3 transition-opacity duration-300 ${isAnimating ? 'opacity-40' : 'opacity-100'}`}>
            <div className="bg-white border border-blue-200 rounded-2xl p-3 shadow-sm">
              <GaugeArc
                value={parseFloat(simResult.stabilityIndex)}
                label="Grid Stability Index"
                sublabel="vs Baseline: 82%"
                color="#2563eb"
                warningThreshold={70}
              />
            </div>
            <div className="bg-white border border-blue-200 rounded-2xl p-3 shadow-sm">
              <GaugeArc
                value={parseFloat(simResult.emissionReductionPct)}
                label="Projected CO2 Drop"
                sublabel="vs Baseline: 8.0%"
                color="#16a34a"
                min={0}
                max={45}
              />
            </div>
            <div className="bg-white border border-blue-200 rounded-2xl p-3 shadow-sm">
              <GaugeArc
                value={parseFloat(simResult.reProjectedPct)}
                label="Renewable Share"
                sublabel="vs Baseline: 46%"
                color="#d97706"
                min={0}
                max={90}
              />
            </div>
          </div>

          {/* KPI Cards */}
          <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${isAnimating ? 'opacity-40' : 'opacity-100'}`}>
            <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-1">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  Estimated Tax Revenue Shift
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-blue-800">
                +₹ {simResult.revenueShiftCr} Cr
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                Annual net fiscal surplus from surcharges
              </div>
            </div>
            <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  Peak Load Shaving
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-800">
                -{simResult.peakShavedMW.toLocaleString()} MW
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                Relief during 19:00–21:00 evening surge
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider mb-3">
              Baseline vs Simulated Policy — Comparative Assessment
            </h4>
            <div className="h-44">
              <Bar data={comparisonData} options={comparisonOptions} />
            </div>
          </div>

          {/* Methodology Footnote */}
          <div className="flex items-start space-x-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-mono text-slate-500">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Projections modeled dynamically on Karnataka Energy Dept. Grid Resilience Guidelines. Changes in tax rate drive voluntary compliance shift; peak penalties induce thermal load-shifting to solar daylight windows.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
