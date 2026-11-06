import React, { useState } from 'react';
import { 
  Wind, 
  Flame, 
  AlertTriangle, 
  Lightbulb, 
  Zap, 
  Sparkles, 
  SlidersHorizontal,
  Info
} from 'lucide-react';

export default function DomesticApplianceBreakdown({ 
  appliances, 
  isSmartPlugOptimized, 
  onToggleSmartPlug, 
  totalUnits = 288 
}) {
  const [selectedApplianceId, setSelectedApplianceId] = useState(null);

  // If smart plug is active, adjust standby waste
  const displayAppliances = appliances.map((app) => {
    if (app.id === 'standby_waste') {
      if (isSmartPlugOptimized) {
        return {
          ...app,
          sharePct: 6,
          kwh: Number(((6 / 100) * totalUnits).toFixed(1)),
          costInr: Math.round(((6 / 100) * totalUnits) * 8.5),
          isWarning: false,
          warningLabel: '✓ Smart Plug Scheduled (Optimized)',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        };
      }
      return {
        ...app,
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse',
      };
    }
    return app;
  });

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Wind':
        return <Wind className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Lightbulb':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all mt-4 sm:mt-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Estimated Appliance Energy Breakdown</span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-200 hidden sm:inline font-semibold">
                NILM Disaggregated
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Extracted from BESCOM load curves via SiliconUrja AI. Click an appliance for optimization.
          </p>
        </div>

        {/* Quick Action: Smart Plug Vampire Drain Cutoff */}
        <button
          onClick={onToggleSmartPlug}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
            isSmartPlugOptimized
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
          }`}
          title="Simulate Wi-Fi smart plug vampire drain cutoff"
        >
          <Zap className={`w-3.5 h-3.5 ${isSmartPlugOptimized ? 'text-white fill-white' : 'text-amber-700'}`} />
          <span>{isSmartPlugOptimized ? '✓ Vampire Drain Cutoff Active' : '⚡ Simulate Smart Plug Cutoff'}</span>
        </button>
      </div>

      {/* Stacked Visual Bar Representation */}
      <div className="mb-5 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
        <div className="flex justify-between items-center text-[11px] text-slate-600 font-mono mb-2">
          <span>Monthly Total Disaggregated: <strong className="text-slate-900 font-bold">{totalUnits} kWh</strong></span>
          <span className="text-blue-700 font-bold">100% accounted for</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 flex overflow-hidden p-0.5 gap-0.5">
          {displayAppliances.map((app) => (
            <div
              key={app.id}
              className={`h-full rounded-sm bg-gradient-to-r ${app.color} transition-all duration-500`}
              style={{ width: `${app.sharePct}%` }}
              title={`${app.name}: ${app.sharePct}%`}
            ></div>
          ))}
        </div>
      </div>

      {/* Appliance List Items */}
      <div className="space-y-3">
        {displayAppliances.map((app) => {
          const isSelected = selectedApplianceId === app.id;
          const isStandby = app.id === 'standby_waste';

          return (
            <div
              key={app.id}
              onClick={() => setSelectedApplianceId(isSelected ? null : app.id)}
              className={`rounded-xl p-3.5 transition-all cursor-pointer border ${
                isStandby && !isSmartPlugOptimized
                  ? 'bg-amber-50/70 hover:bg-amber-100/70 border-amber-300 shadow-sm'
                  : isSelected
                  ? 'bg-blue-50/60 border-blue-400 shadow-sm'
                  : 'bg-slate-50/80 hover:bg-blue-50/40 border-slate-200 hover:border-blue-200'
              }`}
            >
              {/* Top Row: Name, Percent, Cost */}
              <div className="flex items-center justify-between gap-3">
                
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isStandby && !isSmartPlugOptimized
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-white text-blue-700 border border-slate-200'
                  }`}>
                    {getIcon(app.iconName)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {app.name}
                      </span>
                      {/* Standby Waste Flagged in Amber */}
                      {isStandby && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 font-bold ${app.badgeColor}`}>
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>{app.warningLabel || '⚠️ Flagged: Standby Waste'}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 font-medium">
                      {app.typicalUsage}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1.5">
                    <span className={`text-base font-black font-mono ${
                      isStandby && !isSmartPlugOptimized ? 'text-amber-800' : 'text-slate-900'
                    }`}>
                      {app.sharePct}%
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ({app.kwh} kWh)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono font-medium">
                    ~₹{app.costInr} / mo
                  </div>
                </div>

              </div>

              {/* Progress Bar */}
              <div className="mt-2.5 w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${app.color} transition-all duration-500`}
                  style={{ width: `${app.sharePct}%` }}
                ></div>
              </div>

              {/* Collapsible Info / Advice when clicked */}
              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-700">
                  <div className="p-2.5 rounded-lg bg-white border border-blue-200 flex items-start gap-2 shadow-sm">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-blue-900 font-bold">UrjaAI Insight:</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{app.tip}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Footnote on NILM Extraction */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Non-intrusive machine learning models trained on 14,000+ Bengaluru homes.</span>
        </span>
        <span className="text-slate-400 font-mono">v2.4 NILM</span>
      </div>

    </div>
  );
}
