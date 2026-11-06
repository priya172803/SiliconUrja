import React from 'react';
import { 
  Zap, 
  Sun, 
  Leaf, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Sparkles,
  BarChart3,
  Gauge,
  ShieldCheck,
  Activity
} from 'lucide-react';

/**
 * Reusable Executive SVG Ring Gauge (White & Blue Theme)
 */
function RadialRingGauge({ 
  percentage, 
  size = 64, 
  strokeWidth = 6.5, 
  gradientId, 
  gradientColors, 
  centerContent,
  benchmarkPercent = null
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
        
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Benchmark Marker (if any) */}
        {benchmarkPercent && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f59e0b"
            strokeWidth={strokeWidth + 1.5}
            fill="none"
            strokeDasharray={`2.5 ${circumference - 2.5}`}
            strokeDashoffset={circumference - (benchmarkPercent / 100) * circumference}
          />
        )}

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {centerContent}
      </div>
    </div>
  );
}

/**
 * Semi-Circular Arc Gauge for Demand and Risk (White & Blue Theme)
 */
function SemiArcGauge({
  percentage,
  valueText,
  colorScheme = "blue", // "blue" | "emerald" | "risk"
  isDanger = false
}) {
  const width = 100;
  const height = 54;
  const strokeWidth = 7;
  const radius = 38;
  const cx = 50;
  const cy = 46;

  const arcLength = Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = arcLength - (clampedPct / 100) * arcLength;

  const strokeColor = isDanger 
    ? "#e11d48" 
    : colorScheme === "emerald" 
      ? "#10b981" 
      : colorScheme === "risk"
        ? (clampedPct > 90 ? "#e11d48" : clampedPct > 80 ? "#f59e0b" : "#10b981")
        : "#2563eb";

  return (
    <div className="relative flex flex-col items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Background Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* 100% threshold danger indicator */}
        <line
          x1={cx + radius - 2}
          y1={cy - 4}
          x2={cx + radius + 2}
          y2={cy + 4}
          stroke="#f43f5e"
          strokeWidth="2"
        />

        {/* Progress Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute bottom-0 text-center font-mono leading-none">
        <span className="text-[11px] font-bold text-slate-800">{valueText}</span>
      </div>
    </div>
  );
}

export function KpiMetricsBar({ metrics, isSimulatingSpike, onOpenPreCooling }) {
  const effectiveDemand = isSimulatingSpike ? metrics.activeDemand.current + 120 : metrics.activeDemand.current;
  const contractedLimit = metrics.activeDemand.contractedLimit;
  const utilizationPct = ((effectiveDemand / contractedLimit) * 100).toFixed(1);
  const bufferKVA = Math.max(0, contractedLimit - effectiveDemand);
  const bufferPct = ((bufferKVA / contractedLimit) * 100).toFixed(1);
  
  const isHighRisk = effectiveDemand >= 1950;
  const isModerateRisk = effectiveDemand >= 1900 && effectiveDemand < 1950;
  
  const solarSharePct = isSimulatingSpike ? 31.8 : metrics.solarShare.percentage;
  const solarGenKW = metrics.solarShare.currentGenerationKW;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 mb-6">
      
      {/* ======================================================== */}
      {/* CARD 1: Active kVA Demand vs Contracted Limit */}
      {/* ======================================================== */}
      <div className="relative group bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  Grid Demand (BESCOM HT)
                </span>
                <h3 className="text-sm font-bold text-slate-900">Active Demand vs Contract</h3>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
              isHighRisk 
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {metrics.activeDemand.trend15m}
            </span>
          </div>

          {/* Metric Big Display with SVG Gauge side-by-side */}
          <div className="flex items-center justify-between mt-2 mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-slate-900">
                  {effectiveDemand.toLocaleString()}
                </span>
                <span className="text-slate-500 text-xs sm:text-sm font-semibold font-mono">
                  / {contractedLimit.toLocaleString()} kVA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Contracted Max Demand (CMD Limit)
              </p>
            </div>

            {/* Visual Mini Arc Gauge */}
            <div className="flex-shrink-0 ml-2">
              <SemiArcGauge 
                percentage={parseFloat(utilizationPct)} 
                valueText={`${utilizationPct}%`}
                colorScheme="blue"
                isDanger={parseFloat(utilizationPct) > 95}
              />
            </div>
          </div>

          {/* Progress Bar with Contract Limit marker */}
          <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5 mb-3">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                utilizationPct > 95 
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (effectiveDemand / contractedLimit) * 100)}%` }}
            />
            {/* 2,000 kVA penalty threshold marker */}
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-rose-500" title="CMD 2,000 kVA Penalty Limit" />
          </div>
        </div>

        {/* Footer info: Peak & Remaining Buffer */}
        <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <span>Peak Today:</span>
            <span className="font-bold text-blue-700">{metrics.activeDemand.peakRecordedToday} kVA</span>
            <span className="text-slate-400 text-[10px]">({metrics.activeDemand.peakTime})</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-emerald-700">
            <span>Buffer:</span>
            <span>{bufferKVA} kVA ({bufferPct}%)</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD 2: Rooftop Solar Generation Share */}
      {/* ======================================================== */}
      <div className="relative group bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <Sun className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  850 kWp Rooftop Array
                </span>
                <h3 className="text-sm font-bold text-slate-900">Solar Generation Share</h3>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {metrics.solarShare.activeInverters}
            </span>
          </div>

          {/* Metric Big Display with SVG Radial Ring Gauge */}
          <div className="flex items-center justify-between mt-2 mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-emerald-600">
                  {solarSharePct}%
                </span>
                <span className="text-slate-600 text-xs font-semibold">green contribution</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Real-time: <strong className="font-mono text-slate-800">{solarGenKW} kW</strong> ({metrics.solarShare.totalCapacityKWp} kWp total)
              </p>
            </div>

            {/* Circular Solar Ring Gauge */}
            <div className="flex-shrink-0 ml-2">
              <RadialRingGauge
                percentage={solarSharePct}
                size={56}
                strokeWidth={6}
                gradientId="solarGradWhite"
                gradientColors={["#10b981", "#0284c7"]}
                centerContent={
                  <div className="text-center font-mono">
                    <span className="text-[11px] font-bold text-emerald-700">{solarSharePct}%</span>
                  </div>
                }
              />
            </div>
          </div>

          {/* Segmented green contribution bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 p-0.5 mb-3 flex gap-1">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${solarSharePct}%` }}
            />
            <div 
              className="h-full rounded-full bg-slate-200"
              style={{ width: `${100 - solarSharePct}%` }}
            />
          </div>
        </div>

        {/* Footer: Irradiance & Carbon offset */}
        <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <span>DNI Irradiance:</span>
            <span className="text-emerald-700 font-bold">{metrics.solarShare.irradianceWM2} W/m²</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">-{metrics.solarShare.carbonAvoidedTonnes} tCO₂e</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD 3: ESG Target Progress Gauge (88%) */}
      {/* ======================================================== */}
      <div className="relative group bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  Net Zero Transition
                </span>
                <h3 className="text-sm font-bold text-slate-900">ESG Target Progress Gauge</h3>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              LEED Platinum
            </span>
          </div>

          {/* Metric Big Display with SVG Gauge */}
          <div className="flex items-center justify-between mt-2 mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono text-blue-700">
                  {metrics.esgProgress.overallPercentage}%
                </span>
                <span className="text-slate-600 text-xs font-semibold">of 2026 Target</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Decarbonization: <strong className="text-emerald-700 font-mono">{metrics.esgProgress.scope2DecarbRate}</strong>
              </p>
            </div>

            {/* Circular ESG Radial Gauge with 85% BEE benchmark tick */}
            <div className="flex-shrink-0 ml-2">
              <RadialRingGauge
                percentage={metrics.esgProgress.overallPercentage}
                size={56}
                strokeWidth={6}
                gradientId="esgGradWhite"
                gradientColors={["#2563eb", "#0284c7"]}
                benchmarkPercent={85}
                centerContent={
                  <div className="text-center font-mono">
                    <span className="text-[11px] font-bold text-blue-700">88%</span>
                  </div>
                }
              />
            </div>
          </div>

          {/* Visual Progress Bar with 85% Milestone Marker */}
          <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5 mb-3">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 transition-all duration-700"
              style={{ width: `${metrics.esgProgress.overallPercentage}%` }}
            />
            {/* Target marker at 85% */}
            <div className="absolute left-[85%] top-0 bottom-0 w-0.5 bg-amber-500" title="BEE 5-Star Benchmark (85%)" />
          </div>
        </div>

        {/* Footer: BRSR status & Scope 2 indirect */}
        <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <span>BRSR Core:</span>
            <span className="text-emerald-700 font-bold">Audit Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Scope 2:</span>
            <span className="text-blue-700 font-bold">{metrics.esgProgress.scope2Tonnes} tCO₂e</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD 4: Demand Surcharge Penalty Risk */}
      {/* ======================================================== */}
      <div className={`relative group bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isHighRisk 
          ? 'border-rose-300' 
          : isModerateRisk 
            ? 'border-amber-300' 
            : 'border-slate-200/90 hover:border-emerald-300'
      }`}>
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl border ${
                isHighRisk 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  BESCOM Penalty Protection
                </span>
                <h3 className="text-sm font-bold text-slate-900">Demand Surcharge Risk</h3>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
              isHighRisk 
                ? 'bg-rose-50 text-rose-700 border-rose-300' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {isHighRisk ? 'Critical Risk' : 'Low Risk'}
            </span>
          </div>

          {/* Metric Big Display with Buffer Gauge */}
          <div className="flex items-center justify-between mt-2 mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-black tracking-tight font-mono ${
                  isHighRisk ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {isHighRisk ? 'High' : 'Low'}
                </span>
                <span className="text-slate-600 text-xs font-semibold font-mono">
                  / Buffer {bufferPct}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                Headroom: <strong className="text-slate-800 font-mono">{bufferKVA} kVA</strong> (Safe Zone)
              </p>
            </div>

            {/* Risk Tier Gauge */}
            <div className="flex-shrink-0 ml-2">
              <SemiArcGauge
                percentage={isHighRisk ? 95 : isModerateRisk ? 82 : 25}
                valueText={isHighRisk ? "PENALTY" : "SAFE"}
                colorScheme="risk"
                isDanger={isHighRisk}
              />
            </div>
          </div>

          {/* Buffer Gauge Bar */}
          <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5 mb-3">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                isHighRisk 
                  ? 'bg-rose-500' 
                  : isModerateRisk 
                    ? 'bg-amber-500' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${Math.min(100, (bufferKVA / 300) * 100)}%` }}
            />
          </div>
        </div>

        {/* Footer: AI 2-Hour forecast & Pre-Cooling Action */}
        <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <span>Forecast (2h):</span>
            <span className="text-blue-700 font-bold">
              {isSimulatingSpike ? '1,970 kVA' : `${metrics.penaltyRisk.aiForecastPeakKVA} kVA`}
            </span>
          </div>
          <button 
            onClick={onOpenPreCooling}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
          >
            <span>Pre-Cool Guard</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
