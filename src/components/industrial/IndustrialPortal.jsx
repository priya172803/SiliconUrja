import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldCheck,
  AlertTriangle,
  Gauge,
  Factory,
  Clock,
  Flame,
  Wrench,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Activity,
  Sliders,
  FileCheck2,
  CalendarClock,
  Sparkles,
  RefreshCw,
  MapPin,
  Cpu,
  Radio,
  Info,
  BarChart3,
  Power
} from 'lucide-react';

const INITIAL_EQUIPMENT = [
  {
    id: 'eaf-1',
    name: 'Electric Arc Furnace #1',
    code: 'EAF-01 • Melt Shop Bay A',
    drawMW: 4.2,
    optimizedDrawMW: 0.6,
    status: 'normal',
    statusLabel: 'Online • Optimal Melt',
    statusEmoji: '🟢',
    pf: 0.98,
    temp: '1,640°C',
    loadFactor: 88,
    harmonicTHD: '3.1%',
    shiftWindow: '14:00 – 22:00 IST (Overlaps Peak)',
    optimizedWindow: '22:00 – 06:00 IST (Off-Peak Night Shift)',
    canDefer: true,
    note: 'Primary 65-ton ultra-high-power (UHP) arc furnace. High peak tariff exposure during 18:00–22:00 tap cycle.'
  },
  {
    id: 'hrm-1',
    name: 'Heavy Rolling Mill',
    code: 'HRM-04 • Hot Strip Line #2',
    drawMW: 2.8,
    optimizedDrawMW: 1.4,
    status: 'normal',
    statusLabel: 'Online • Steady Pass',
    statusEmoji: '🟢',
    pf: 0.99,
    temp: '920°C',
    loadFactor: 76,
    harmonicTHD: '2.4%',
    shiftWindow: '10:00 – 20:30 IST (Overlaps Peak)',
    optimizedWindow: '22:30 – 05:30 IST (Off-Peak Night Shift)',
    canDefer: true,
    note: 'Tandem roughing & finishing stands. Batch slab reheating can be shifted to post-22:00 BESCOM rebate window.'
  },
  {
    id: 'comp-1',
    name: 'Compressor',
    subtitle: 'HP Rotary Screw Air Station #2',
    code: 'CMP-02 • Utility Block C',
    drawMW: 1.1,
    optimizedDrawMW: 0.95,
    status: 'warning',
    statusLabel: 'Flagged for Maintenance',
    statusEmoji: '⚠️',
    pf: 0.94,
    temp: '108°C (High)',
    loadFactor: 96,
    harmonicTHD: '5.8%',
    shiftWindow: '24x7 Continuous Base Utility',
    optimizedWindow: '24x7 Continuous (Bypass Standby Active)',
    canDefer: false,
    warningDetail: 'Stage-2 bearing vibration at 4.8 mm/s RMS & manifold pressure drop (+14% parasitic kW draw).',
    note: 'Scheduled bearing assembly swap & intercooler purge recommended before 18:00 peak tariff window.'
  }
];

const TOD_SLOTS = [
  {
    id: 'morning-normal',
    window: '06:00 – 10:00',
    label: 'Morning Normal',
    type: 'normal',
    rate: '₹7.40 / kWh',
    surcharge: 'Base Tariff',
    baselineMW: 6.4,
    optimizedMW: 6.2
  },
  {
    id: 'morning-peak',
    window: '10:00 – 14:00',
    label: 'Day Operations',
    type: 'normal',
    rate: '₹7.40 / kWh',
    surcharge: 'Base Tariff',
    baselineMW: 7.5,
    optimizedMW: 7.1
  },
  {
    id: 'afternoon-normal',
    window: '14:00 – 18:00',
    label: 'Pre-Peak Ramp',
    type: 'normal',
    rate: '₹7.40 / kWh',
    surcharge: 'Base Tariff',
    baselineMW: 7.9,
    optimizedMW: 6.8
  },
  {
    id: 'evening-peak',
    window: '6 PM - 10 PM',
    subWindow: '18:00 – 22:00 HRS',
    label: 'Peak Penalty Window',
    type: 'peak',
    rate: '₹8.90 / kWh',
    surcharge: '+₹1.50/kWh (+20% Penalty)',
    baselineMW: 8.1,
    optimizedMW: 3.1
  },
  {
    id: 'night-offpeak',
    window: '22:00 – 06:00',
    label: 'Off-Peak Night Rebate',
    type: 'offpeak',
    rate: '₹6.40 / kWh',
    surcharge: '-₹1.00/kWh Rebate',
    baselineMW: 4.2,
    optimizedMW: 7.8
  }
];

export default function IndustrialPortal({ sessionData }) {
  const [shiftApplied, setShiftApplied] = useState(false);
  const [isApplyingShift, setIsApplyingShift] = useState(false);
  const [compressorServiced, setCompressorServiced] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('comp-1');
  const [liveJitter, setLiveJitter] = useState(0);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveJitter((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const handleApplyDynamicShift = () => {
    setIsApplyingShift(true);
    setTimeout(() => {
      setShiftApplied((prev) => !prev);
      setIsApplyingShift(false);
    }, 450);
  };

  const powerFactor = shiftApplied ? '0.99' : '0.98';
  const carbonUsed = shiftApplied ? 398 : 412;
  const carbonLimit = 520;
  const carbonPercent = shiftApplied ? 76 : 78;
  const peakDemandMW = '8.1';
  const activeEveningPeakMW = shiftApplied ? '3.1 MW' : '8.1 MW';

  const selectedMachine =
    INITIAL_EQUIPMENT.find((item) => item.id === selectedEquipmentId) || INITIAL_EQUIPMENT[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-industrial-grid flex flex-col justify-between">
      {/* Top Industrial Utility Telemetry Ribbon (Deep Royal Blue Bar) */}
      <div className="bg-blue-950 text-blue-100 border-b border-blue-900 px-4 sm:px-6 lg:px-8 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-sky-300 font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-sky-400" />
              BESCOM 66kV HT-2(a) FEEDER #14
            </span>
            <span className="hidden sm:inline text-blue-700">|</span>
            <span className="inline-flex items-center gap-1 text-blue-100">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              Peenya Industrial Area, Phase-II, Bengaluru (560058)
            </span>
            <span className="hidden md:inline text-blue-700">|</span>
            <span className="hidden md:inline text-blue-200">
              GRID FREQ: <strong className="text-emerald-300">{liveJitter ? '50.02 Hz' : '49.99 Hz'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-blue-200">
              VOLTAGE: <strong className="text-white">66.4 kV</strong>
            </span>
            <span className="text-blue-700">|</span>
            <span className="text-blue-100">
              KERC TARIFF: <strong className="text-sky-300">HT-2(a) INDUSTRIAL ToD</strong>
            </span>
            <span className="hidden sm:inline text-blue-700">|</span>
            <span className="inline-flex items-center gap-1.5 text-sky-200 font-semibold">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{formattedDate}</span>
              <span className="text-white font-bold">{formattedTime} IST</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* 1. HEADER & LIVE STATUS */}
        <header className="bg-white border border-blue-200/90 rounded-xl p-5 sm:p-6 shadow-md shadow-blue-950/5 relative overflow-hidden">
          {/* Top Blue Accent Bar */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-700 via-sky-500 to-blue-700" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
                  <Factory className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                      KSPCB &amp; BESCOM SCADA LINKED
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      PLANT ID: BLR-PNY-04
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                    SiliconUrja <span className="text-blue-600 font-light">|</span>{' '}
                    <span className="text-blue-950">Industrial Compliance Portal</span>
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 pl-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50/80 border border-blue-200 text-sm font-bold text-blue-900">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Peenya Steel Works Plant #4</span>
                </div>
                <span className="text-xs text-slate-600 font-mono">
                  Contract Demand: <strong className="text-slate-900">10.0 MVA</strong> • Shift Supervisor:{' '}
                  <strong className="text-slate-900">R. Deshpande (Chief Eng)</strong>
                </span>
              </div>
            </div>

            {/* Right Side: Pulsing Live Load Status Badge & Shift Mode Indicator */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start lg:self-center">
              {/* Pulsing Live Load Status Badge ("Heavy Load Active") */}
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 text-white border border-blue-500 shadow-lg shadow-blue-600/20"
                role="status"
                aria-live="polite"
              >
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-200 opacity-85"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white shadow-[0_0_10px_#ffffff]"></span>
                </span>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-blue-100 leading-none">
                    LIVE SUBSTATION TELEMETRY
                  </div>
                  <div className="text-sm sm:text-base font-extrabold tracking-wide text-white uppercase mt-0.5 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-sky-200 shrink-0" />
                    <span>Heavy Load Active</span>
                  </div>
                </div>
              </div>

              {/* Active Schedule Mode & Real-Time Clock Pill */}
              <div className="flex items-center gap-2.5">
                <div className="px-3.5 py-2.5 rounded-xl bg-blue-50/90 border border-blue-200 text-right font-mono">
                  <div className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                    {formattedTime} <span className="text-[10px] font-bold text-blue-600">IST</span>
                  </div>
                </div>

                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-blue-200 text-right font-mono">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    DISPATCH MODE
                  </div>
                  <div className={`text-xs font-bold mt-0.5 ${shiftApplied ? 'text-emerald-700' : 'text-blue-700'}`}>
                    {shiftApplied ? 'NIGHT-SHIFT OPTIMIZED' : 'STANDARD DAY PEAK'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 2. COMPLIANCE & OPERATIONS KPI ROW */}
        <section aria-label="Compliance and Operations Key Performance Indicators">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-blue-900 font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Compliance &amp; Operations Telemetry — Real-Time KPI Matrix
            </h2>
            <span className="text-xs font-mono text-slate-600">
              Polling Interval: <strong className="text-blue-700">1.0s SCADA Sync</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* KPI 1: Power Factor (PF) Meter */}
            <div className="bg-white border border-blue-100 hover:border-blue-400 transition-all rounded-xl p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Power Factor (PF) Meter
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                      {powerFactor} <span className="text-xl text-blue-600">PF</span>
                    </span>
                    <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                      Lagging
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                  <Gauge className="w-5 h-5" />
                </div>
              </div>

              {/* Segmented Industrial PF Bar */}
              <div className="my-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">BESCOM Min: 0.90</span>
                  <span className="text-blue-700 font-semibold">APFC Bank: +1.45 MVAR</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 transition-all duration-500"
                    style={{ width: shiftApplied ? '99%' : '98%' }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ₹0 Penalty Fine from Utility
                </span>
                <span className="font-mono text-[11px] text-slate-500">Zero Surcharge</span>
              </div>
            </div>

            {/* KPI 2: Monthly Carbon Cap Usage */}
            <div className="bg-white border border-blue-100 hover:border-blue-400 transition-all rounded-xl p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Monthly Carbon Cap Usage
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-700 tracking-tight">
                      {carbonPercent}%
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-700">
                      ({carbonUsed} / {carbonLimit} tCO2)
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                  <Flame className="w-5 h-5" />
                </div>
              </div>

              {/* Visual Tracker showing 78% of state-allocated emissions limit used */}
              <div className="my-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">State-Allocated Limit</span>
                  <span className="text-blue-700 font-semibold">
                    {carbonLimit - carbonUsed} tCO2 Remaining
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${carbonPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold">
                  KSPCB Scope 1+2 Quota
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  {shiftApplied ? '-14 tCO2 Saved' : 'Alert @ 85%'}
                </span>
              </div>
            </div>

            {/* KPI 3: Peak Demand Draw (8.1 MW) with active ToD tariff indicator */}
            <div className="bg-white border border-blue-100 hover:border-blue-400 transition-all rounded-xl p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Peak Demand Draw
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                      {peakDemandMW} <span className="text-xl text-blue-600">MW</span>
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      / 10.0 MW Cap
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              {/* Active Time-of-Day (ToD) Tariff Indicator */}
              <div className="my-3 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      ACTIVE ToD TARIFF INDICATOR
                    </div>
                    <div className="text-xs font-bold text-blue-900 font-mono">
                      {shiftApplied
                        ? 'Night Off-Peak Rebate Queued'
                        : 'Peak Zone Alert (18:00–22:00)'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-blue-600 text-white shadow-sm">
                  {shiftApplied ? '₹6.40/kWh' : '₹8.90/kWh'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  6–10 PM Projected Draw:
                </span>
                <span className={`font-mono font-bold ${shiftApplied ? 'text-emerald-700' : 'text-blue-700'}`}>
                  {activeEveningPeakMW} {shiftApplied && '(-5.0 MW Shifted)'}
                </span>
              </div>
            </div>

            {/* KPI 4: State Audit Compliance Status ("Passed / Compliant") */}
            <div className="bg-white border border-blue-100 hover:border-blue-400 transition-all rounded-xl p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    State Audit Compliance Status
                  </span>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight">
                      Passed / Compliant
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="my-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">CEIG &amp; KSPCB Grid Audit:</span>
                  <span className="text-emerald-700 font-bold">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Harmonic IEEE-519 Limit:</span>
                  <span className="text-slate-900 font-semibold">3.4% (&lt;5.0%)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Cert #KA-PNY-2026-884</span>
                <button
                  type="button"
                  onClick={() => setAuditModalOpen(!auditModalOpen)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold transition-colors"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{auditModalOpen ? 'Hide Dossier' : 'View Audit Log'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Expandable State Audit Compliance Dossier Drawer */}
          {auditModalOpen && (
            <div className="mt-3 bg-blue-50/90 border border-blue-300 rounded-xl p-4 text-xs font-mono text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="text-blue-900 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  KARNATAKA STATE POLLUTION CONTROL BOARD (KSPCB) &amp; BESCOM HT AUDIT LEDGER
                </div>
                <p className="text-slate-600">
                  Plant: Peenya Steel Works Plant #4 • Inspection Status:{' '}
                  <strong className="text-blue-950">Passed / Compliant</strong> • Zero reactive energy penalty since 14 consecutive billing cycles. Continuous Emission Monitoring System (CEMS) telemetry active.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold shrink-0"
              >
                Dismiss Ledger
              </button>
            </div>
          )}
        </section>

        {/* 3. MAIN CONTENT LAYOUT */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (7 Cols): Process Line Equipment Status */}
          <section
            aria-label="Process Line Equipment Status"
            className="lg:col-span-7 bg-white border border-blue-200/80 rounded-xl p-5 sm:p-6 shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Process Line Equipment Status
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-draw furnace, rolling mill, and utility machinery telemetry across Peenya Plant #4
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-mono text-slate-700">
                  Total Line Draw:{' '}
                  <strong className="text-blue-700">
                    {compressorServiced ? '7.95 MW' : '8.1 MW'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Equipment Cards List */}
            <div className="space-y-4">
              {INITIAL_EQUIPMENT.map((unit) => {
                const isWarning = unit.status === 'warning' && !compressorServiced;
                const isSelected = selectedEquipmentId === unit.id;
                const displayMW =
                  unit.id === 'comp-1' && compressorServiced
                    ? unit.optimizedDrawMW
                    : unit.drawMW;

                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedEquipmentId(unit.id)}
                    className={`rounded-xl p-4 sm:p-5 border transition-all cursor-pointer ${
                      isWarning
                        ? 'bg-gradient-to-r from-amber-50/70 via-white to-blue-50/30 border-amber-300 hover:border-amber-400'
                        : 'bg-slate-50/70 border-slate-200 hover:border-blue-300'
                    } ${isSelected ? 'ring-2 ring-blue-500/40 border-blue-400 bg-white' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span>{unit.name}</span>
                            <span className="text-base" aria-hidden="true">
                              {isWarning ? '⚠️' : '🟢'}
                            </span>
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                            {unit.code}
                          </span>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {isWarning ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              ⚠️ Flagged for Maintenance
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {unit.id === 'comp-1' && compressorServiced
                                ? '🟢 Standby Manifold Active • Optimal'
                                : `🟢 ${unit.statusLabel}`}
                            </span>
                          )}

                          {unit.canDefer && (
                            <span
                              className={`text-[11px] font-mono px-2 py-0.5 rounded border font-medium ${
                                shiftApplied
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-blue-50 text-blue-800 border-blue-200'
                              }`}
                            >
                              {shiftApplied
                                ? `Shifted → ${unit.optimizedWindow}`
                                : `Active Window: ${unit.shiftWindow}`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right side numerical MW indicator */}
                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700 tracking-tight">
                          {displayMW} <span className="text-sm font-bold text-slate-500">MW</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {shiftApplied && unit.canDefer ? (
                            <span className="text-emerald-700 font-semibold">
                              6–10 PM Hold: {unit.optimizedDrawMW} MW
                            </span>
                          ) : (
                            <span>PF {unit.pf} • Temp {unit.temp}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Load Proportion Bar & Telemetry Sub-row */}
                    <div className="mt-4 space-y-2">
                      <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWarning
                              ? 'bg-gradient-to-r from-amber-500 to-blue-600'
                              : 'bg-gradient-to-r from-blue-600 to-sky-400'
                          }`}
                          style={{ width: `${(displayMW / 8.1) * 100}%` }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500">
                        <span>
                          Plant Load Share:{' '}
                          <strong className="text-slate-800">{Math.round((displayMW / 8.1) * 100)}%</strong>
                        </span>
                        <span>
                          Harmonic THD: <strong className="text-slate-800">{unit.harmonicTHD}</strong>
                        </span>
                        <span>
                          Duty Cycle: <strong className="text-slate-800">{unit.loadFactor}%</strong>
                        </span>
                      </div>
                    </div>

                    {/* Specific Maintenance Action Banner for Compressor (1.1 MW ⚠️ Flagged for Maintenance) */}
                    {unit.id === 'comp-1' && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-700 flex items-start gap-2">
                          <Wrench className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>
                            {compressorServiced
                              ? 'Auxiliary Rotary Compressor #2B engaged. Parasitic air leak isolated (-0.15 MW saved).'
                              : unit.warningDetail}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompressorServiced((prev) => !prev);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 border transition-all ${
                            compressorServiced
                              ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-sm'
                          }`}
                        >
                          {compressorServiced
                            ? 'Restore Primary Unit'
                            : 'Isolate & Dispatch Crew'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Equipment Diagnostic Footer */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-blue-700 font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  ENGINEER TELEMETRY NOTE — {selectedMachine.name.toUpperCase()}
                </div>
                <p className="text-xs text-slate-700">{selectedMachine.note}</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-white border border-blue-200 text-slate-600 shrink-0">
                Breaker: <strong className="text-emerald-700">VCB-CLOSED</strong>
              </span>
            </div>
          </section>

          {/* RIGHT COLUMN (5 Cols): ToD Shift Scheduler & Penalty Preventer */}
          <section
            aria-label="ToD Shift Scheduler and Penalty Preventer"
            className="lg:col-span-5 bg-white border border-blue-200/80 rounded-xl p-5 sm:p-6 shadow-sm space-y-5 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded font-bold mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  AI Load Dispatch Recommendation Engine
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  ToD Shift Scheduler &amp; Penalty Preventer
                </h2>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 shrink-0">
                <CalendarClock className="w-5 h-5" />
              </div>
            </div>

            {/* Peak Penalty Hours Alert Banner (6 PM - 10 PM) */}
            <div
              className={`rounded-xl p-4 border transition-colors ${
                shiftApplied
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-gradient-to-br from-blue-50 via-sky-50/60 to-white border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 shrink-0 ${shiftApplied ? 'text-emerald-600' : 'text-blue-600'}`} />
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-600 block">
                      BESCOM ToD Peak Penalty Window
                    </span>
                    <span className="text-lg font-extrabold font-mono text-slate-900">
                      6 PM - 10 PM <span className="text-xs font-normal text-blue-700">(18:00 – 22:00 IST)</span>
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                    shiftApplied
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-blue-700 text-white border-blue-800'
                  }`}
                >
                  {shiftApplied ? 'PENALTY MITIGATED' : '+20% TARIFF SURCHARGE'}
                </span>
              </div>

              <p className="text-xs text-slate-700 mt-3 leading-relaxed">
                {shiftApplied ? (
                  <>
                    Dynamic shift schedule active: <strong className="text-emerald-800">Electric Arc Furnace #1</strong> (3.6 MW melt load) and <strong className="text-emerald-800">Heavy Rolling Mill</strong> (1.4 MW batch pass) have been deferred from <strong className="text-slate-900">6 PM - 10 PM</strong> to the <strong className="text-blue-700">22:00 – 06:00 Off-Peak Night Shift</strong>.
                  </>
                ) : (
                  <>
                    Running <strong className="text-blue-800">Electric Arc Furnace #1 (4.2 MW)</strong> &amp; <strong className="text-blue-800">Heavy Rolling Mill (2.8 MW)</strong> at full tap during <strong className="text-slate-900">6 PM - 10 PM</strong> incurs BESCOM peak penalty rates (<strong className="text-blue-700">₹8.90/kWh</strong>). Deferring batch heats to the <strong className="text-blue-700">22:00 – 06:00 night shift</strong> unlocks the ₹1.00/kWh night rebate.
                  </>
                )}
              </p>

              {/* Financial & Carbon Impact Summary Pills */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-200/70 font-mono">
                <div className="bg-white border border-blue-200 rounded-lg p-2.5 shadow-sm">
                  <div className="text-[10px] text-slate-500 uppercase">
                    {shiftApplied ? 'Locked Daily Savings' : 'Avoidable Peak Penalty'}
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-blue-700 mt-0.5">
                    ₹1,84,500 <span className="text-xs font-normal text-slate-500">/ day</span>
                  </div>
                </div>
                <div className="bg-white border border-blue-200 rounded-lg p-2.5 shadow-sm">
                  <div className="text-[10px] text-slate-500 uppercase">
                    6 PM - 10 PM Load Drop
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    8.1 → 3.1 MW
                  </div>
                </div>
              </div>
            </div>

            {/* 24-Hour Time-of-Day (ToD) Tariff & Load Schedule Visualizer */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  24-Hour BESCOM ToD Load Profile
                </span>
                <span className="text-blue-700 font-bold">
                  {shiftApplied ? 'Optimized Night Curve' : 'Current Baseline Curve'}
                </span>
              </div>

              <div className="space-y-2">
                {TOD_SLOTS.map((slot) => {
                  const isPeakSlot = slot.type === 'peak';
                  const isOffPeakSlot = slot.type === 'offpeak';
                  const activeMW = shiftApplied ? slot.optimizedMW : slot.baselineMW;
                  const widthPct = Math.min(100, Math.round((activeMW / 9.0) * 100));

                  return (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                        isPeakSlot
                          ? shiftApplied
                            ? 'bg-emerald-50/40 border-emerald-300'
                            : 'bg-blue-50/90 border-blue-400 shadow-sm'
                          : isOffPeakSlot && shiftApplied
                          ? 'bg-blue-50/60 border-blue-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{slot.window}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isPeakSlot
                                ? 'bg-blue-600 text-white'
                                : isOffPeakSlot
                                ? 'bg-sky-100 text-blue-800 border border-sky-300'
                                : 'bg-slate-200/80 text-slate-700'
                            }`}
                          >
                            {slot.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 mr-2">{slot.rate}</span>
                          <strong
                            className={`text-sm ${
                              isPeakSlot && !shiftApplied
                                ? 'text-blue-800'
                                : isOffPeakSlot && shiftApplied
                                ? 'text-emerald-700'
                                : 'text-slate-900'
                            }`}
                          >
                            {activeMW} MW
                          </strong>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isPeakSlot
                              ? shiftApplied
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-blue-700 to-sky-500'
                              : isOffPeakSlot
                              ? 'bg-sky-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary CTA Button: "Apply Dynamic Shift Schedule" */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleApplyDynamicShift}
                disabled={isApplyingShift}
                className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer ${
                  shiftApplied
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 border border-emerald-700'
                    : 'bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-blue-600/25 border border-blue-700'
                }`}
              >
                {isApplyingShift ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Synchronizing PLC Shift Controllers...</span>
                  </>
                ) : shiftApplied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Dynamic Shift Schedule Active (Click to Revert)</span>
                  </>
                ) : (
                  <>
                    <Power className="w-5 h-5" />
                    <span>Apply Dynamic Shift Schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
                <span>Target: EAF #1 + Heavy Rolling Mill</span>
                <span className="text-blue-700 font-semibold">
                  {shiftApplied ? '✓ Night Shift Queued (22:00 IST)' : 'Ready for PLC Dispatch'}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Industrial Footer */}
      <footer className="border-t border-blue-100 bg-white px-4 sm:px-6 lg:px-8 py-4 mt-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-blue-700">SiliconUrja</strong> Industrial Compliance &amp; SCADA EMS v4.2 • Peenya Steel Works Plant #4, Bengaluru
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>BESCOM HT-2(a) Compliant</span>
            <span>•</span>
            <span>KSPCB CEMS Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
