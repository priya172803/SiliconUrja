import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  SunMedium, 
  AlertOctagon, 
  Gauge, 
  Radio,
  Clock
} from 'lucide-react';
import LiveClock from './LiveClock';

export default function MacroMetricsBanner({ macroMetrics }) {
  const isDeficit = macroMetrics.reserveMarginGW < 0;
  const isTight = macroMetrics.reserveMarginGW <= 5 && !isDeficit;

  return (
    <div className="bg-white border-b border-blue-100 px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          
          {/* 1. Real-Time Peak Demand (Matches User Photo) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-blue-50/50 to-white border border-blue-200/80 hover:border-blue-400 transition shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600">
                Real-Time Peak Demand
              </span>
              <TrendingUp className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                {macroMetrics.peakDemandGW.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-blue-600 font-mono">GW</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Current All-Karnataka Draw</span>
              <span className="text-blue-700 font-bold">
                {((macroMetrics.peakDemandGW / macroMetrics.totalCapacityGW) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* 2. Reserve Margin (Matches User Photo +4.0 GW Buffer Headroom: 2.1%) */}
          <div className={`p-3.5 rounded-xl border transition shadow-sm relative overflow-hidden group ${
            isDeficit 
              ? 'border-rose-400 bg-rose-50/60' 
              : isTight 
                ? 'border-amber-300 bg-amber-50/40' 
                : 'border-emerald-300 bg-emerald-50/40'
          }`}>
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-700">
                Reserve Margin
              </span>
              {isDeficit ? (
                <AlertOctagon className="w-4 h-4 text-rose-600 animate-bounce" />
              ) : (
                <ShieldCheck className={`w-4 h-4 ${isTight ? 'text-amber-600' : 'text-emerald-600'}`} />
              )}
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                isDeficit 
                  ? 'text-rose-600' 
                  : isTight 
                    ? 'text-amber-700' 
                    : 'text-emerald-700'
              }`}>
                {macroMetrics.reserveMarginGW >= 0 ? `+${macroMetrics.reserveMarginGW.toFixed(1)}` : macroMetrics.reserveMarginGW.toFixed(1)}
              </span>
              <span className="text-xs font-bold font-mono text-slate-600">GW</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Buffer Headroom:</span>
              <span className={`font-bold ${isDeficit ? 'text-rose-600' : isTight ? 'text-amber-700' : 'text-emerald-700'}`}>
                {isDeficit ? 'DEFICIT ALERT' : `${macroMetrics.reserveMarginPct}%`}
              </span>
            </div>
          </div>

          {/* 3. Total Grid Capacity */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-blue-50/50 to-white border border-blue-200/80 hover:border-blue-400 transition shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600">
                Total Grid Capacity
              </span>
              <Zap className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                {macroMetrics.totalCapacityGW}
              </span>
              <span className="text-xs font-bold text-blue-600 font-mono">GW</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Installed State Base</span>
              <span className="text-blue-700 font-bold">100% Online</span>
            </div>
          </div>

          {/* 4. Renewable Share */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-emerald-50/50 to-white border border-emerald-200/80 hover:border-emerald-400 transition shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600">
                Renewable Share
              </span>
              <SunMedium className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tracking-tight">
                {macroMetrics.renewableSharePct}
              </span>
              <span className="text-xs font-bold text-emerald-600 font-mono">%</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Solar / Wind / Hydro</span>
              <span className="text-emerald-700 font-bold">88.3 GW Clean</span>
            </div>
          </div>

          {/* 5. Grid Frequency (SCADA Telemetry) */}
          <div className="p-3.5 rounded-xl bg-white border border-blue-200/80 hover:border-blue-400 transition shadow-sm relative overflow-hidden group hidden lg:block">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600">
                Grid Frequency
              </span>
              <Gauge className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                Math.abs(macroMetrics.gridFrequencyHz - 50.0) > 0.1 ? 'text-amber-600' : 'text-blue-700'
              }`}>
                {macroMetrics.gridFrequencyHz.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-blue-600 font-mono">Hz</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>SLDC Tolerance</span>
              <span className="text-emerald-600 font-bold">±0.05 Hz Band</span>
            </div>
          </div>

          {/* 6. Live Time & Date Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-blue-50 to-white border border-blue-300 transition shadow-sm relative overflow-hidden group hidden lg:block">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-blue-800">
                Live SCADA Time
              </span>
              <Clock className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '60s' }} />
            </div>
            <div className="mt-0.5">
              <LiveClock compact={false} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
