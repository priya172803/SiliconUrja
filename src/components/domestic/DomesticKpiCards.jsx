import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  Leaf, 
  AlertTriangle, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Info, 
  BellRing, 
  CheckCircle2,
  Zap,
  ArrowDownRight
} from 'lucide-react';

export default function DomesticKpiCards({ 
  kpis, 
  onOpenTariffModal, 
  rebateApplied = 0 
}) {
  const [peakAlertSubscribed, setPeakAlertSubscribed] = useState(false);
  const [showPeakNotice, setShowPeakNotice] = useState(false);
  const [now, setNow] = useState(new Date());

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Adjusted bill if user redeemed rebate
  const currentBill = Math.max(0, kpis.estimatedMonthlyBill - rebateApplied);
  const isRebateActive = rebateApplied > 0;

  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const isPeakActive = currentHour >= 18 && currentHour < 22;
  const isBeforePeak = currentHour < 18;

  let peakDynamicStatus = "";
  if (isPeakActive) {
    const hoursLeft = 21 - currentHour;
    const minsLeft = 59 - currentMinutes;
    peakDynamicStatus = `PEAK SURCHARGE ACTIVE • Ends in ${hoursLeft > 0 ? `${hoursLeft}h ` : ''}${minsLeft}m`;
  } else if (isBeforePeak) {
    const hoursUntil = 17 - currentHour;
    const minsUntil = 59 - currentMinutes;
    peakDynamicStatus = `Starts in ${hoursUntil > 0 ? `${hoursUntil}h ` : ''}${minsUntil}m (at 6:00 PM)`;
  } else {
    peakDynamicStatus = "Off-Peak Night Valley active (Saves +₹1.25/kWh)";
  }

  const liveTimeString = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const handleTogglePeakAlert = () => {
    setPeakAlertSubscribed(!peakAlertSubscribed);
    setShowPeakNotice(true);
    setTimeout(() => setShowPeakNotice(false), 3500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      
      {/* ============================================================== */}
      {/* CARD 1: Estimated Monthly Bill */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <IndianRupee className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Estimated Monthly Bill
            </span>
          </div>
          <button
            onClick={onOpenTariffModal}
            className="text-[11px] text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors font-medium cursor-pointer"
            title="Inspect BESCOM LT-2a tariff formula"
          >
            <Info className="w-3 h-3" />
            <span>Tariff Details</span>
          </button>
        </div>

        {/* Bill Amount */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
            ₹{currentBill.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            for Nov 2026 cycle
          </span>
        </div>

        {/* Downward Trend Arrow (Green) */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>14.2% vs last month</span>
          </span>
          <span className="text-xs text-slate-600">
            (Saved <span className="text-emerald-700 font-bold">₹405</span>)
          </span>
        </div>

        {/* Sub-bar: Budget & Units Tracker */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600">
              Consumption: <span className="text-slate-900 font-mono font-bold">{kpis.unitsConsumedKWh} kWh</span>
            </span>
            <span className="text-slate-500">
              Budget: <span className="text-slate-700 font-mono font-medium">{kpis.unitsMonthlyBudget} kWh</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${(kpis.unitsConsumedKWh / kpis.unitsMonthlyBudget) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
            <span className="flex items-center gap-1 text-slate-600">
              <Zap className="w-3 h-3 text-blue-600" />
              LT-2a Slab 2 (₹7.00/u)
            </span>
            {isRebateActive && (
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                -₹{rebateApplied} Rebate Applied
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CARD 2: Carbon Footprint */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Carbon Footprint
            </span>
          </div>

          {/* Green Tier Active Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Green Tier Active</span>
          </span>
        </div>

        {/* Footprint Value */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
            {kpis.carbonFootprintKg}
          </span>
          <span className="text-sm font-bold text-slate-600">
            kg CO₂
          </span>
          <span className="text-xs text-slate-400">
            / monthly cycle
          </span>
        </div>

        {/* Neighborhood Benchmark */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>32.5% cleaner</span>
          </span>
          <span className="text-xs text-slate-600">
            vs HSR Sector 4 average (162 kg)
          </span>
        </div>

        {/* Sub-bar: Clean Grid & Tree Offset Impact */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-100">
              <div className="text-slate-500 text-[11px] font-medium">Trees Equivalent</div>
              <div className="text-emerald-700 font-bold font-mono text-sm mt-0.5">
                🌳 ~5.2 Trees
              </div>
            </div>
            <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-100">
              <div className="text-slate-500 text-[11px] font-medium">Clean BESCOM Mix</div>
              <div className="text-blue-700 font-bold font-mono text-sm mt-0.5">
                ⚡ 44.8% Hydro/Solar
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CARD 3: Peak Hour Warning (Amber alert with Live Time) */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 rounded-2xl p-5 border border-amber-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>Peak Hour Warning</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              </span>
            </div>

            {/* Amber Status Pill */}
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
              BESCOM Surcharge
            </span>
          </div>

          {/* Time Window & Real Time */}
          <div className="mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-700" />
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-950 tracking-tight">
                  {kpis.peakHourWindow}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-800 font-mono block font-semibold uppercase">Live Grid Time</span>
                <span className="text-xs font-bold font-mono text-amber-950">{liveTimeString}</span>
              </div>
            </div>

            {/* Real-time Dynamic Status Indicator */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100/90 border border-amber-300 text-[11px] font-mono font-bold text-amber-900">
              <span className={`w-2 h-2 rounded-full ${isPeakActive ? 'bg-rose-500 animate-ping' : 'bg-amber-600'}`}></span>
              <span>{peakDynamicStatus}</span>
            </div>
          </div>

          {/* Advice Text */}
          <div className="mt-3 p-2.5 rounded-xl bg-white border border-amber-200 text-xs text-slate-700 leading-relaxed shadow-sm">
            <p className="font-semibold text-amber-900 flex items-center gap-1 mb-1">
              <span>⚠️ Actionable Grid Advice:</span>
            </p>
            <p className="text-slate-600 text-[11px]">
              Avoid running heavy appliances (<strong className="text-amber-900">Washing Machine, Geyser, Dishwasher, EV Charger</strong>) between 6 PM and 10 PM. Run them in the morning solar window or post-10 PM valley.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
          <button
            onClick={handleTogglePeakAlert}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              peakAlertSubscribed 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            <BellRing className={`w-3.5 h-3.5 ${peakAlertSubscribed ? 'text-emerald-700' : 'text-amber-700'}`} />
            <span>{peakAlertSubscribed ? '✓ Peak Shift Reminder Set for 5:45 PM' : '🔔 Set 5:45 PM Shift Reminder'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
