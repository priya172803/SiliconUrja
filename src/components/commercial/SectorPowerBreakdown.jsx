import React, { useState } from 'react';
import { 
  Fan, 
  Server, 
  Lightbulb, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Sliders, 
  Flame, 
  ShieldCheck, 
  Sparkles,
  Info,
  Thermometer,
  Layers,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { SECTOR_BREAKDOWN } from './energyData';

export function SectorPowerBreakdown({ 
  preCoolingActive, 
  onTogglePreCooling,
  onOpenPreCoolingModal
}) {
  const [selectedSectorId, setSelectedSectorId] = useState("hvac");
  const selectedSector = SECTOR_BREAKDOWN.find(s => s.id === selectedSectorId) || SECTOR_BREAKDOWN[0];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 shadow-xs mb-6">
      
      {/* ======================================================== */}
      {/* Section Header */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Facility Power Draw by Sector
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              1,850 kW Real-Time Load
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual breakdown of campus central plant & building electrical systems
          </p>
        </div>

        {/* Sector Quick Switcher Pills */}
        <div className="flex items-center gap-2">
          {SECTOR_BREAKDOWN.map(sector => (
            <button
              key={sector.id}
              onClick={() => setSelectedSectorId(sector.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                selectedSectorId === sector.id 
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sector.color }} />
              <span>{sector.name.split(' ')[0]}</span>
              <span className="font-mono font-bold text-slate-800">{sector.percentage}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* Multi-Bar Visual Proportional Meter (52% / 30% / 18%) */}
      {/* ======================================================== */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono mb-2 text-slate-500">
          <span>Campus Power Draw Split</span>
          <span className="text-slate-700 font-semibold">Total: 1,850 kW (100%)</span>
        </div>
        
        <div className="w-full h-5 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 p-1 flex gap-1.5 shadow-inner">
          {SECTOR_BREAKDOWN.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setSelectedSectorId(sector.id)}
              title={`${sector.name}: ${sector.percentage}% (${sector.powerKW} kW)`}
              className={`h-full rounded-lg transition-all duration-300 relative group cursor-pointer ${
                selectedSectorId === sector.id ? 'ring-2 ring-blue-600 ring-offset-1 ring-offset-white scale-y-105' : 'opacity-85 hover:opacity-100'
              }`}
              style={{ 
                width: `${sector.percentage}%`,
                backgroundColor: sector.color 
              }}
            >
              <span className="sr-only">{sector.name} {sector.percentage}%</span>
            </button>
          ))}
        </div>

        {/* Proportional Cards for the 3 Sectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
          {SECTOR_BREAKDOWN.map((sector) => {
            const Icon = sector.id === 'hvac' ? Fan : sector.id === 'datacenter' ? Server : Lightbulb;
            const isSelected = selectedSectorId === sector.id;
            return (
              <div 
                key={sector.id}
                onClick={() => setSelectedSectorId(sector.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-50/70 border-blue-300 shadow-xs ring-1 ring-blue-300/50' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs" style={{ color: sector.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{sector.name}</div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5 font-medium">{sector.powerKW} kW Real-Time</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono tracking-tight" style={{ color: sector.color }}>
                      {sector.percentage}%
                    </span>
                  </div>
                </div>

                {/* Subsystem summary bullet */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{sector.subsystems.length} Modbus Nodes</span>
                  <span className="text-slate-700 font-semibold">
                    {sector.id === 'hvac' 
                      ? (preCoolingActive ? 'CHW 5.5°C Active' : 'Base CHW 6.5°C') 
                      : sector.id === 'datacenter' 
                        ? 'PUE 1.28 Optimal' 
                        : 'Daylight Harvester On'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* Subsystem BMS Telemetry Drilldown for Selected Sector */}
      {/* ======================================================== */}
      <div className="mb-6 bg-slate-50/80 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedSector.color }} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              {selectedSector.name} Subsystem Breakdown & Modbus Telemetry
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Gateway: 100% Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {selectedSector.subsystems.map((sub, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-lg bg-white border border-slate-200 flex flex-col justify-between hover:border-blue-200 shadow-2xs transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800 line-clamp-1">{sub.name}</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                  {sub.drawKW} kW
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-mono">
                <span className="text-emerald-700 font-medium">{sub.status}</span>
                {sub.cop && (
                  <span className="text-blue-700 font-bold">
                    COP: {preCoolingActive && sub.name.includes('CH-02') ? '6.1 (Pre-Cool)' : sub.cop}
                  </span>
                )}
                {sub.pue && <span className="text-emerald-700 font-bold">PUE: {sub.pue}</span>}
                {sub.flow && <span className="text-slate-600 font-medium">{sub.flow}</span>}
                {sub.luxAvg && <span className="text-amber-700 font-bold">{sub.luxAvg} Lux</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACTIONABLE HVAC PRE-COOLING RECOMMENDATION BOX */}
      {/* ======================================================== */}
      <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        preCoolingActive 
          ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 border-emerald-300 shadow-sm' 
          : 'bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 border-blue-200 shadow-xs'
      }`}>
        <div className="p-5 lg:p-6">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
            
            {/* Recommendation Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-100 text-blue-800 border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  AI Automated Pre-Cooling Recommendation Box
                </span>
                
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  BESCOM Peak Window: 18:00 - 22:00 IST
                </span>

                {preCoolingActive && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    THERMAL CHARGING ACTIVE (21.5°C SETPOINT)
                  </span>
                )}
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-1.5">
                Optimize Thermal Mass Ahead of BESCOM Peak Tariff Surcharge (+₹1.50/kWh)
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                BESCOM HT-2B peak tariff begins at <strong className="text-blue-700 font-bold">18:00 IST</strong> (₹8.30/kWh peak vs ₹5.80/kWh off-peak). 
                Pre-cool Building 2A & 2B thermal mass to <strong className="text-emerald-700 font-bold">21.5°C</strong> between <span className="font-mono text-blue-800 font-semibold">16:15 - 17:45 IST</span> utilizing 
                surplus rooftop solar power (34% green contribution). Chilled water supply temperature is stepped down from 6.5°C to 5.5°C to store 740 ton-hours of cold thermal inertia.
              </p>

              {/* Impact Metrics Badges */}
              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-200/80 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <span className="text-slate-500 font-sans">Peak Demand Shaving:</span>
                  <span className="font-bold text-emerald-700">▼ 280 kVA Shaved</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 text-blue-800">
                  <span className="text-slate-500 font-sans">Estimated Surcharge Saved:</span>
                  <span className="font-bold text-blue-700">₹22,400 / day</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="text-slate-500 font-sans">Solar Utilization:</span>
                  <span className="font-bold text-teal-700">98.2% Direct Use</span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Status */}
            <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 min-w-[250px]">
              <button
                onClick={onTogglePreCooling}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer ${
                  preCoolingActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>
                  {preCoolingActive ? '✓ Deployed (Click to Override)' : '⚡ Apply Automated Setpoint Shift'}
                </span>
              </button>

              <button
                onClick={onOpenPreCoolingModal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Inspect BMS Thermodynamics</span>
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
