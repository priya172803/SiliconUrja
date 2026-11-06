import React from 'react';
import { 
  X, 
  Fan, 
  Thermometer, 
  Zap, 
  Clock, 
  TrendingDown, 
  Sliders, 
  CheckCircle2, 
  Flame, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export function PreCoolingModal({ isOpen, onClose, preCoolingActive, onTogglePreCooling }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                BMS Algorithmic Pre-Cooling & Thermal Inertia Engine
              </h3>
              <p className="text-xs text-slate-500">
                Automated Load-Shifting Sequence for BESCOM Peak Tariff Protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            preCoolingActive 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${preCoolingActive ? 'bg-emerald-500 animate-ping' : 'bg-blue-600'}`} />
              <div>
                <div className="font-bold text-sm text-slate-900">
                  {preCoolingActive ? 'Sequence Active: Pre-Cooling in Progress' : 'Sequence Armed: Ready for 16:15 IST Dispatch'}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Target: Building 2A & 2B slab temperature 21.5°C • Chilled Water Supply: 5.5°C
                </div>
              </div>
            </div>

            <button
              onClick={onTogglePreCooling}
              className={`px-4 py-2 rounded-xl font-bold font-sans transition-all cursor-pointer ${
                preCoolingActive 
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              }`}
            >
              {preCoolingActive ? 'Abort / Revert BMS' : 'Deploy Sequence Now'}
            </button>
          </div>

          {/* Thermodynamics Specification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 font-mono">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">CHW Supply Temp</span>
              <div className="text-lg font-bold text-blue-700 mt-1">
                5.5°C <span className="text-xs text-slate-400 font-normal">(Base 6.5°C)</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                Sub-cooling water by 1.0°C to charge concrete slab inertia
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Thermal Energy Stored</span>
              <div className="text-lg font-bold text-emerald-700 mt-1">
                740 Ton-Hours
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                Equivalent to 2.6 MWh of cooling stored in structural mass
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Peak Demand Slashed</span>
              <div className="text-lg font-bold text-amber-700 mt-1">
                280 kVA Shaved
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 font-sans">
                Chillers ramp down to 45% during peak window (18:00 - 22:00)
              </p>
            </div>
          </div>

          {/* Timeline Process */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5 font-mono">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Automated Sequence Execution Schedule</span>
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold whitespace-nowrap">
                  16:15 - 17:45 IST
                </span>
                <div>
                  <div className="font-bold text-slate-900 font-sans">Pre-Cooling Phase (Solar Surplus Absorption)</div>
                  <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                    Ramp Chiller CH-02 to 92% load using free onsite rooftop solar (34% green power). Drop space temperature from 23.5°C to 21.5°C.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold whitespace-nowrap">
                  18:00 - 22:00 IST
                </span>
                <div>
                  <div className="font-bold text-slate-900 font-sans">Peak Shaving & Tariff Avoidance Phase</div>
                  <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                    BESCOM +₹1.50/unit peak surcharge in effect. Chillers throttle back to 45% load. Pre-stored thermal inertia drifts back to comfortable 23.8°C with zero occupant discomfort.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold whitespace-nowrap">
                  22:00 IST onwards
                </span>
                <div>
                  <div className="font-bold text-slate-900 font-sans">Off-Peak Normalization</div>
                  <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                    Transition to night setback mode under BESCOM off-peak tariff rebate (-₹1.00/unit).
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-[11px] text-slate-500 font-mono">
            Algorithm: BACnet/IP BACnet MSTP BMS Bridge v4.9.1
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
