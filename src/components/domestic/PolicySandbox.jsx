import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { POLICY_PRESETS } from './mockData';
import { 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  IndianRupee, 
  ShieldCheck, 
  Leaf, 
  FileCheck2, 
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Send,
  Zap
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PolicySandbox({ baselineHourlyCurve, role }) {
  // Slider states
  const [carbonTax, setCarbonTax] = useState(1800);
  const [renewableSubsidy, setRenewableSubsidy] = useState(18);
  const [peakHourPenalty, setPeakHourPenalty] = useState(1.75);
  const [evOffPeakDiscount, setEvOffPeakDiscount] = useState(25);

  const [activePresetId, setActivePresetId] = useState('custom');
  const [showCabinetModal, setShowCabinetModal] = useState(false);
  const [cabinetSubmitted, setCabinetSubmitted] = useState(false);

  // Dynamic Mathematical Model for Projections
  const simulationResults = useMemo(() => {
    const baselineEmissionsMt = 38.5;
    const taxImpact = ((carbonTax - 500) / 4500) * 14.5;
    const subsidyImpact = ((renewableSubsidy - 5) / 35) * 12.0;
    const peakPenaltyImpact = ((peakHourPenalty - 1.0) / 2.5) * 4.5;
    const totalReductionPct = Math.min(32.0, Number((taxImpact + subsidyImpact + peakPenaltyImpact).toFixed(1)));

    const peakShavingFactor = ((peakHourPenalty - 1.0) / 2.5) * 22;
    const evSmoothingFactor = (evOffPeakDiscount / 50) * 8;
    const stabilityBase = 72;
    const stabilityIndex = Math.min(98, Math.max(55, Math.round(stabilityBase + peakShavingFactor + evSmoothingFactor - (renewableSubsidy > 30 ? 4 : 0))));

    const netEmissionsMt = baselineEmissionsMt * (1 - totalReductionPct / 100);
    const carbonTaxRevenueCr = (netEmissionsMt * 1e6 * carbonTax) / 1e7;
    const subsidyOutflowCr = (renewableSubsidy * 85);
    const peakPenaltyRevenueCr = (peakHourPenalty * 140);
    const netFiscalShiftCr = Math.round(carbonTaxRevenueCr + peakPenaltyRevenueCr - subsidyOutflowCr);

    const peakShavedGW = Number((((peakHourPenalty - 1.0) * 2.8) + (evOffPeakDiscount * 0.04)).toFixed(1));

    return {
      totalReductionPct,
      stabilityIndex,
      netFiscalShiftCr,
      carbonTaxRevenueCr: Math.round(carbonTaxRevenueCr),
      subsidyOutflowCr: Math.round(subsidyOutflowCr),
      peakPenaltyRevenueCr: Math.round(peakPenaltyRevenueCr),
      peakShavedGW,
    };
  }, [carbonTax, renewableSubsidy, peakHourPenalty, evOffPeakDiscount]);

  const handleApplyPreset = (preset) => {
    setActivePresetId(preset.id);
    setCarbonTax(preset.carbonTax);
    setRenewableSubsidy(preset.renewableSubsidy);
    setPeakHourPenalty(preset.peakHourPenalty);
    setEvOffPeakDiscount(preset.evOffPeakDiscount);
  };

  const handleReset = () => {
    setActivePresetId('custom');
    setCarbonTax(1800);
    setRenewableSubsidy(18);
    setPeakHourPenalty(1.75);
    setEvOffPeakDiscount(25);
  };

  // Shaved 24-hr Demand Curve - Light Theme
  const simulatedCurveData = {
    labels: baselineHourlyCurve.map(d => d.hour),
    datasets: [
      {
        label: 'Baseline Actual Demand (GW)',
        data: baselineHourlyCurve.map(d => d.demand),
        borderColor: '#94a3b8',
        borderDash: [4, 4],
        borderWidth: 2,
        pointRadius: 2,
        fill: false,
        tension: 0.35,
      },
      {
        label: 'Projected Shaved Demand (With Policy Levers) (GW)',
        data: baselineHourlyCurve.map(d => {
          if (['16:00', '18:00', '20:00', '22:00'].includes(d.hour)) {
            const factor = d.hour === '18:00' || d.hour === '20:00' ? simulationResults.peakShavedGW : simulationResults.peakShavedGW * 0.6;
            return Math.max(150, d.demand - factor);
          }
          if (['00:00', '02:00', '04:00'].includes(d.hour)) {
            return d.demand + (evOffPeakDiscount * 0.08);
          }
          return d.demand;
        }),
        borderColor: '#2563eb', // Royal Blue
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
          gradient.addColorStop(1, 'rgba(37, 99, 235, 0.02)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#1d4ed8',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        fill: true,
        tension: 0.35,
      },
      {
        label: 'Grid Capacity Ceiling (192 GW)',
        data: baselineHourlyCurve.map(d => d.capacity),
        borderColor: '#e11d48', // Rose
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
      }
    ]
  };

  const simulatedCurveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#334155',
          font: { family: 'JetBrains Mono', size: 11, weight: 'bold' },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        titleColor: '#1e40af',
        bodyColor: '#1e293b',
        padding: 12,
        bodyFont: { family: 'JetBrains Mono' }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(203, 213, 225, 0.5)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 } }
      },
      y: {
        min: 130,
        max: 200,
        grid: { color: 'rgba(203, 213, 225, 0.5)' },
        ticks: { 
          color: '#64748b', 
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (v) => `${v} GW`
        }
      }
    }
  };

  const getStabilityBadge = (val) => {
    if (val >= 85) return { text: 'Optimal Stability', color: 'text-emerald-700 bg-emerald-50 border-emerald-300 font-bold' };
    if (val >= 70) return { text: 'Nominal Buffer', color: 'text-amber-800 bg-amber-50 border-amber-300 font-bold' };
    return { text: 'Stress Risk', color: 'text-rose-700 bg-rose-50 border-rose-300 font-bold' };
  };

  const stabilityBadge = getStabilityBadge(simulationResults.stabilityIndex);

  return (
    <div className="space-y-6">
      
      {/* Top Presets Banner - White & Blue */}
      <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Policy Scenario Presets
            </h3>
            <p className="text-xs text-slate-500">
              One-click state economic and dispatch policy models for Bengaluru
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {POLICY_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                activePresetId === p.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {p.name}
            </button>
          ))}

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-xs bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200"
            title="Reset levers"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Control Panel (Sliders) vs Dynamic Gauges & Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Policy Sliders Control Panel (5 Cols) - White Card */}
        <div className="lg:col-span-5 bg-white border border-blue-100 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                Policy Levers & Regulatory Sliders
              </h4>
              <span className="text-[11px] font-mono text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Live Recalc
              </span>
            </div>

            {/* Slider 1: Carbon Tax Multiplier */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Carbon Tax Multiplier
                </span>
                <span className="text-blue-800 font-black text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ₹{carbonTax.toLocaleString()} / ton
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={carbonTax}
                onChange={(e) => {
                  setCarbonTax(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹500 (Base)</span>
                <span>₹2,500</span>
                <span>₹5,000 (Aggressive)</span>
              </div>
            </div>

            {/* Slider 2: Renewable Energy Subsidy Rate */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Renewable Energy Subsidy Rate
                </span>
                <span className="text-amber-800 font-black text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {renewableSubsidy}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={renewableSubsidy}
                onChange={(e) => {
                  setRenewableSubsidy(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5% (Current Cap)</span>
                <span>20% (Target)</span>
                <span>40% (Surya Mitra Max)</span>
              </div>
            </div>

            {/* Slider 3: Industrial Peak-Hour Penalty Multiplier */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-rose-600" />
                  Industrial Peak-Hour Penalty
                </span>
                <span className="text-rose-800 font-black text-sm bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {peakHourPenalty.toFixed(2)}x Tariff
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.05"
                value={peakHourPenalty}
                onChange={(e) => {
                  setPeakHourPenalty(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.0x (Flat Tariff)</span>
                <span>2.0x (Standard)</span>
                <span>3.5x (Strict Peak Shaving)</span>
              </div>
            </div>

            {/* Slider 4: EV Fleet Off-Peak Concession */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-700 font-bold flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
                  EV Fleet Off-Peak Night Concession
                </span>
                <span className="text-emerald-800 font-black text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {evOffPeakDiscount}% Off
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={evOffPeakDiscount}
                onChange={(e) => {
                  setEvOffPeakDiscount(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Standard)</span>
                <span>25% (Recommended)</span>
                <span>50% (Max Night Shift)</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowCabinetModal(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              Submit Policy Proposal for Cabinet Review
            </button>
          </div>
        </div>

        {/* Dynamic Recalculation Gauges & Shaved Curve (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 3 Key Dynamic Recalculation Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Metric 1: Grid Stability Index */}
            <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono mb-2">
                <span>Grid Stability Index</span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black font-mono text-blue-900">
                {simulationResults.stabilityIndex}%
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${stabilityBadge.color}`}>
                  {stabilityBadge.text}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  Buffer: +{(simulationResults.peakShavedGW + 4.0).toFixed(1)} GW
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${simulationResults.stabilityIndex}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Projected Emission Reduction */}
            <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono mb-2">
                <span>Projected Emission Cut</span>
                <TrendingDown className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black font-mono text-emerald-700">
                -{simulationResults.totalReductionPct}%
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Annual Abatement</span>
                <span className="text-emerald-700 font-bold">
                  {(38.5 * (simulationResults.totalReductionPct / 100)).toFixed(1)} Mt CO₂
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(simulationResults.totalReductionPct / 32) * 100}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Estimated Tax Revenue Shift */}
            <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono mb-2">
                <span>Net Fiscal Revenue Shift</span>
                <IndianRupee className="w-4 h-4 text-amber-600" />
              </div>
              <div className={`text-3xl font-black font-mono ${simulationResults.netFiscalShiftCr >= 0 ? 'text-amber-800' : 'text-rose-700'}`}>
                {simulationResults.netFiscalShiftCr >= 0 ? '+' : ''}₹{simulationResults.netFiscalShiftCr.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 ml-1">Cr</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 font-semibold">
                <span>Tax: ₹{simulationResults.carbonTaxRevenueCr}Cr</span>
                <span>Subsidy: -₹{simulationResults.subsidyOutflowCr}Cr</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(10, (simulationResults.netFiscalShiftCr / 1000) * 100))}%` }}
                />
              </div>
            </div>

          </div>

          {/* Dynamic Comparative Chart: Baseline vs Shaved Peak Curve */}
          <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Simulated 24-Hour Demand Shaving Reaction
                </h4>
                <p className="text-xs text-slate-500">
                  Peak shaving at 18:00 - 22:00: <strong className="text-blue-700 font-mono">-{simulationResults.peakShavedGW} GW deferred</strong>
                </p>
              </div>

              <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded font-bold border border-blue-200">
                Live Simulation Active
              </span>
            </div>

            <div className="w-full h-[250px]">
              <Line data={simulatedCurveData} options={simulatedCurveOptions} />
            </div>
          </div>

        </div>

      </div>

      {/* Cabinet Proposal Submission Modal */}
      {showCabinetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-blue-200 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">
                    Karnataka State Energy Cabinet Submission Memo
                  </h3>
                  <p className="text-xs text-slate-500">Draft Notification KA-SLDC-2026-ENACT</p>
                </div>
              </div>
            </div>

            {cabinetSubmitted ? (
              <div className="py-8 text-center space-y-3 font-mono">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">Proposal Transmitted to Energy Secretariat</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Reference #MEMO-KA-2026-9812 logged on state audit ledger. Scheduled for review in Thursday cabinet agenda.
                </p>
                <button
                  onClick={() => {
                    setShowCabinetModal(false);
                    setCabinetSubmitted(false);
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-lg text-slate-700"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Proposed Carbon Tax:</span>
                    <span className="text-blue-900 font-bold">₹{carbonTax}/ton</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Renewable Energy Subsidy:</span>
                    <span className="text-amber-800 font-bold">{renewableSubsidy}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Peak Hour Penalty Multiplier:</span>
                    <span className="text-rose-700 font-bold">{peakHourPenalty.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">EV Night Discount:</span>
                    <span className="text-emerald-700 font-bold">{evOffPeakDiscount}%</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Net Estimated State Fiscal Impact:</span>
                    <span className="text-slate-900 font-bold text-sm">
                      {simulationResults.netFiscalShiftCr >= 0 ? '+' : ''}₹{simulationResults.netFiscalShiftCr} Crores / yr
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed font-sans text-xs">
                  This executive proposal will be submitted to the Principal Secretary (Energy) and Director (KPTCL). It recommends dynamic peak tariffing to maintain an operational reserve buffer greater than 5.5 GW.
                </p>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setShowCabinetModal(false)}
                    className="px-4 py-2 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setCabinetSubmitted(true)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Authorize & Transmit Memo
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
