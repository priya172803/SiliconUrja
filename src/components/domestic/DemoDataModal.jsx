import React from 'react';
import { DEMO_SCENARIOS } from './mockData';
import { 
  Sparkles, 
  X, 
  Sun, 
  Flame, 
  CloudRain, 
  CloudSun, 
  Check, 
  Zap, 
  Activity 
} from 'lucide-react';

export default function DemoDataModal({ isOpen, onClose, currentScenarioKey, onSelectScenario }) {
  if (!isOpen) return null;

  const scenariosList = [
    {
      key: 'nominal',
      data: DEMO_SCENARIOS.nominal,
      icon: Activity,
      color: 'text-blue-700 border-blue-300 bg-blue-50',
      badge: 'Current Default'
    },
    {
      key: 'summer_heatwave',
      data: DEMO_SCENARIOS.summer_heatwave,
      icon: Flame,
      color: 'text-rose-700 border-rose-300 bg-rose-50',
      badge: 'Critical Peak Stress (+1.2 GW)'
    },
    {
      key: 'monsoon_surplus',
      data: DEMO_SCENARIOS.monsoon_surplus,
      icon: CloudRain,
      color: 'text-emerald-700 border-emerald-300 bg-emerald-50',
      badge: 'Green Surplus (62.4% RE)'
    },
    {
      key: 'solar_curtailment',
      data: DEMO_SCENARIOS.solar_curtailment,
      icon: CloudSun,
      color: 'text-amber-700 border-amber-300 bg-amber-50',
      badge: 'Intermittency Alert'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-blue-200 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
                Simulated Grid Stress Scenarios
              </h3>
              <p className="text-xs text-slate-500">
                Instantly swap operational grid conditions to test policy and dispatch responsiveness
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="space-y-3">
          {scenariosList.map((item) => {
            const Icon = item.icon;
            const isSelected = currentScenarioKey === item.key;

            return (
              <div
                key={item.key}
                onClick={() => {
                  onSelectScenario(item.key);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500/20'
                    : 'bg-slate-50/60 border-slate-200 hover:border-blue-300 hover:bg-blue-50/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.data.name}</h4>
                      {isSelected && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.data.description}
                    </p>
                  </div>
                </div>

                {/* Key Metrics Pill */}
                <div className="flex items-center gap-3 sm:text-right font-mono text-xs border-t sm:border-0 border-slate-200 pt-2 sm:pt-0">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Peak / Res</span>
                    <span className="text-slate-900 font-bold">
                      {item.data.metrics.peakDemandGW} / +{item.data.metrics.reserveMarginGW} GW
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">RE Share</span>
                    <span className="text-emerald-700 font-bold">
                      {item.data.metrics.renewableSharePct}%
                    </span>
                  </div>
                  <div className="p-1 rounded-full bg-slate-200 text-blue-600">
                    <Check className={`w-4 h-4 ${isSelected ? 'opacity-100 font-bold' : 'opacity-20'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Telemetry Source: KPTCL Real-time Dispatch SCADA</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
