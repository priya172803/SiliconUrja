import React from 'react';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  Zap, 
  SunMedium, 
  Moon, 
  Leaf
} from 'lucide-react';
import { AI_OFFPEAK_TIPS } from './domesticData';

export default function DomesticUrjaAiCopilot({ 
  onApplyHabit, 
  appliedHabitIds = [], 
  onTriggerStandbyOptimization 
}) {
  const handleApply = (tip) => {
    if (onApplyHabit) {
      onApplyHabit(tip);
    }
    // If it's standby kill tip, also trigger standby optimization
    if (tip.id === 'tip_standby_kill' && onTriggerStandbyOptimization) {
      onTriggerStandbyOptimization(true);
    }
  };

  const getTimeIcon = (tipId) => {
    if (tipId === 'tip_geyser_shift') {
      return <SunMedium className="w-4 h-4 text-amber-500" />;
    }
    return <Moon className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all mt-4 sm:mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>UrjaAI Copilot • Bengaluru Off-Peak Shifts</span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-blue-200 font-semibold">
                Grid Synchronized
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized demand response recommendations tailored to Bengaluru BESCOM tariff slabs.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 text-[11px] text-blue-700 font-bold">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Earn up to +100 Credits today</span>
        </div>
      </div>

      {/* Habit Cards */}
      <div className="space-y-3">
        {AI_OFFPEAK_TIPS.map((tip) => {
          const isApplied = appliedHabitIds.includes(tip.id);

          return (
            <div
              key={tip.id}
              className={`rounded-xl p-3.5 border transition-all ${
                isApplied
                  ? 'bg-blue-50/80 border-blue-300'
                  : 'bg-white hover:bg-blue-50/30 border-slate-200 hover:border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                
                {/* Left: Content */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {getTimeIcon(tip.id)}
                      {tip.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      {tip.badge}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                      +{tip.creditsReward} Credits
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tip.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 flex-wrap font-mono font-medium">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Clock className="w-3 h-3 text-blue-600" />
                      Window: <strong className="text-slate-900">{tip.timeWindow}</strong>
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <IndianRupee className="w-3 h-3 text-emerald-600" />
                      Saves {tip.billSavingsEst}
                    </span>
                  </div>
                </div>

                {/* Right: Apply Button */}
                <div className="sm:self-center shrink-0">
                  <button
                    disabled={isApplied}
                    onClick={() => handleApply(tip)}
                    className={`w-full sm:w-auto px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                      isApplied
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                        <span>Shift Scheduled (+{tip.creditsReward})</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-white stroke-[2]" />
                        <span>{tip.actionLabel}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Dispatcher Sync Note */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Syncs with BESCOM 66/11kV Substation real-time feeder demand.</span>
        </span>
        <span className="text-blue-700 font-mono text-[10px] font-bold">Active SCADA Hook</span>
      </div>

    </div>
  );
}
