import React, { useState } from 'react';
import { 
  Radio, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Cpu, 
  Zap, 
  Bell,
  Clock,
  ChevronRight
} from 'lucide-react';
import { BMS_ALERTS } from './energyData';

export function GridStatusBanner() {
  const [alerts, setAlerts] = useState(BMS_ALERTS);

  return (
    <div className="bg-white border border-blue-100 rounded-2xl px-4 py-3 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        
        {/* Left Telemetry Indicators */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-500 font-sans font-medium text-[11px]">Grid Feeder Health:</span>
            <span className="font-bold text-emerald-700">BESCOM 66kV Feeder 4 (Nominal)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="text-slate-400">Freq:</span>
            <span className="text-blue-700 font-bold">50.02 Hz</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="text-slate-400">Bus:</span>
            <span className="text-blue-700 font-bold">11.08 kV</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="text-slate-400">Power Factor:</span>
            <span className="text-emerald-700 font-bold">0.992 lag</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-sans font-semibold border border-emerald-200">
              +0.5% Incentive
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 hidden sm:flex">
            <span className="text-slate-400">THD-V:</span>
            <span className="text-blue-700 font-bold">1.8% (IEEE 519 Pass)</span>
          </div>
        </div>

        {/* Right Active BMS Alert Ticker */}
        <div className="flex items-center gap-2 font-sans">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-900">
            <Bell className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="text-[11px] font-medium line-clamp-1">
              BMS: Rooftop Solar 629 kW steady • Pre-cooling sequence armed for 16:15 IST
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
