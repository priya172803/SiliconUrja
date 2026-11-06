import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Thermometer, 
  Sun, 
  BatteryCharging,
  Maximize2,
  ChevronRight,
  ShieldAlert,
  Flame,
  Radio
} from 'lucide-react';

export default function BengaluruHeatmap({ zones, selectedZone, onSelectZone, role, onTriggerZoneAction }) {
  const [hoveredZone, setHoveredZone] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'critical', 'warning', 'optimal'

  const activeZoneData = zones.find(z => z.id === (hoveredZone || selectedZone)) || zones[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return {
          stroke: '#dc2626',
          fill: 'rgba(239, 68, 68, 0.20)',
          text: 'text-rose-700',
          bg: 'bg-rose-50 border-rose-300 text-rose-800',
          label: 'Critical Peak (>92%)'
        };
      case 'warning':
        return {
          stroke: '#d97706',
          fill: 'rgba(245, 158, 11, 0.20)',
          text: 'text-amber-800',
          bg: 'bg-amber-50 border-amber-300 text-amber-800',
          label: 'Elevated Load (75-92%)'
        };
      case 'optimal':
      default:
        return {
          stroke: '#059669',
          fill: 'rgba(16, 185, 129, 0.18)',
          text: 'text-emerald-700',
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
          label: 'Optimal Headroom (<75%)'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Visual Heatmap Area (7 Cols) - White & Light Blue Container */}
      <div className="lg:col-span-7 bg-white border border-blue-100 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-blue-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                Bengaluru Regional Grid Heatmap
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 border border-blue-200 font-mono text-blue-800 font-semibold">
                  BESCOM 4-Zone Matrix
                </span>
              </h3>
              <p className="text-xs text-slate-500">Hover or click sector to isolate telemetry & substation nodes</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {['all', 'critical', 'warning', 'optimal'].map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setFilterStatus(statusKey)}
                className={`px-2.5 py-0.5 rounded capitalize text-[11px] font-semibold transition-all ${
                  filterStatus === statusKey
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {statusKey}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive SVG Geographic Layout Representation */}
        <div className="relative w-full aspect-[16/11] flex items-center justify-center p-2 bg-gradient-to-br from-blue-50/60 to-slate-50/80 rounded-xl border border-blue-100/60">
          {/* Subtle Grid Radar Canvas */}
          <div className="absolute inset-0 grid-bg-overlay opacity-50 pointer-events-none rounded-lg" />
          
          <svg viewBox="0 0 600 420" className="w-full h-full filter drop-shadow-md">
            <defs>
              <radialGradient id="radarPulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </radialGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Radar circular rings in subtle blue */}
            <circle cx="300" cy="210" r="180" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="300" cy="210" r="110" fill="none" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="300" cy="210" r="40" fill="url(#radarPulse)" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" />

            {/* Outer Ring Road (ORR) simulated loop */}
            <path
              d="M 180,100 C 320,70 450,110 500,210 C 470,330 330,370 180,330 C 100,270 90,160 180,100 Z"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="opacity-70"
            />
            <text x="320" y="75" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              OUTER RING ROAD CORRIDOR (66kV / 220kV INTERTIE)
            </text>

            {/* ZONE 1: NORTH ZONE (Peenya, Hebbal, Yelahanka) */}
            <g 
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredZone('north')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => onSelectZone('north')}
            >
              <polygon
                points="160,80 320,60 300,190 150,170"
                fill={hoveredZone === 'north' || selectedZone === 'north' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.18)'}
                stroke="#dc2626"
                strokeWidth={selectedZone === 'north' ? 3 : 1.5}
                className="transition-all duration-300"
              />
              <circle cx="210" cy="110" r="12" fill="#ef4444" opacity="0.4" className="animate-ping" />
              <circle cx="210" cy="110" r="5" fill="#dc2626" />
              <text x="225" y="114" fill="#991b1b" fontSize="12" fontWeight="800" fontFamily="sans-serif">
                NORTH ZONE (Peenya)
              </text>
              <text x="225" y="128" fill="#b91c1c" fontSize="10" fontFamily="monospace" fontWeight="bold">
                2,140 MW [93.0% PEAK]
              </text>
            </g>

            {/* ZONE 2: EAST ZONE (Whitefield, Mahadevapura) */}
            <g 
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredZone('east')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => onSelectZone('east')}
            >
              <polygon
                points="320,60 510,130 460,260 300,190"
                fill={hoveredZone === 'east' || selectedZone === 'east' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.18)'}
                stroke="#dc2626"
                strokeWidth={selectedZone === 'east' ? 3 : 1.5}
                className="transition-all duration-300"
              />
              <circle cx="410" cy="150" r="12" fill="#ef4444" opacity="0.4" className="animate-ping" />
              <circle cx="410" cy="150" r="5" fill="#dc2626" />
              <text x="360" y="195" fill="#991b1b" fontSize="12" fontWeight="800" fontFamily="sans-serif">
                EAST ZONE (Whitefield)
              </text>
              <text x="360" y="210" fill="#b91c1c" fontSize="10" fontFamily="monospace" fontWeight="bold">
                1,980 MW [94.3% PEAK]
              </text>
            </g>

            {/* ZONE 3: SOUTH ZONE (Electronic City, Koramangala) */}
            <g 
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredZone('south')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => onSelectZone('south')}
            >
              <polygon
                points="300,190 460,260 380,360 250,340"
                fill={hoveredZone === 'south' || selectedZone === 'south' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.18)'}
                stroke="#d97706"
                strokeWidth={selectedZone === 'south' ? 3 : 1.5}
                className="transition-all duration-300"
              />
              <circle cx="340" cy="270" r="5" fill="#d97706" />
              <text x="320" y="295" fill="#92400e" fontSize="12" fontWeight="800" fontFamily="sans-serif">
                SOUTH ZONE (E-City)
              </text>
              <text x="320" y="310" fill="#b45309" fontSize="10" fontFamily="monospace" fontWeight="bold">
                1,890 MW [85.9%]
              </text>
            </g>

            {/* ZONE 4: WEST ZONE (Rajajinagar, Kengeri, Bidadi) */}
            <g 
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredZone('west')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => onSelectZone('west')}
            >
              <polygon
                points="150,170 300,190 250,340 120,290"
                fill={hoveredZone === 'west' || selectedZone === 'west' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.18)'}
                stroke="#059669"
                strokeWidth={selectedZone === 'west' ? 3 : 1.5}
                className="transition-all duration-300"
              />
              <circle cx="190" cy="230" r="5" fill="#059669" />
              <text x="145" y="250" fill="#065f46" fontSize="12" fontWeight="800" fontFamily="sans-serif">
                WEST ZONE (Bidadi)
              </text>
              <text x="145" y="265" fill="#047857" fontSize="10" fontFamily="monospace" fontWeight="bold">
                1,420 MW [69.3% OPT]
              </text>
            </g>

            {/* Central Node Indicator */}
            <circle cx="300" cy="190" r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
            <text x="300" y="178" fill="#1e40af" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              SLDC ANAND RAO CIRCLE (HQ)
            </text>
          </svg>
        </div>

        {/* Bottom Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs mt-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
              Critical Congestion (&gt;92%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Warning (75% - 92%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Nominal Headroom (&lt;75%)
            </span>
          </div>
          <span className="text-[11px] font-mono text-blue-700 font-bold">
            Real-time SCADA Feeder Latency: 420ms
          </span>
        </div>
      </div>

      {/* Selected Zone Deep-Dive Inspection Telemetry Panel (5 Cols) - Clean White Card */}
      <div className="lg:col-span-5 bg-white border border-blue-100 rounded-xl p-5 flex flex-col justify-between shadow-sm">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-blue-100">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${getStatusColor(activeZoneData.congestionStatus).bg}`}>
                  {activeZoneData.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: BESCOM-{activeZoneData.id.toUpperCase()}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-1">{activeZoneData.alias}</h4>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block font-mono">Thermal Load</span>
              <span className={`text-lg font-bold font-mono ${getStatusColor(activeZoneData.congestionStatus).text}`}>
                {activeZoneData.utilizationPct}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            {activeZoneData.description}
          </p>

          {/* Real-time Substation Metrics */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Peak Draw</span>
                <Zap className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-lg font-bold font-mono text-blue-900">
                {activeZoneData.peakDemandMW.toLocaleString()} <span className="text-xs font-normal text-slate-500">MW</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Cap: {activeZoneData.capacityMW} MW
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Substation Temp</span>
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className={`text-lg font-bold font-mono ${activeZoneData.substationTempC > 68 ? 'text-rose-700' : 'text-slate-800'}`}>
                {activeZoneData.substationTempC}°C
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Thermal Max: 75.0°C
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Rooftop Solar</span>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-lg font-bold font-mono text-amber-800">
                {activeZoneData.solarRooftopMW} <span className="text-xs font-normal text-slate-500">MW</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-mono mt-0.5 font-semibold">
                +18.4% YoY Installed
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>EV Fast-Chargers</span>
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-lg font-bold font-mono text-emerald-800">
                {activeZoneData.evChargersOnline} <span className="text-xs font-normal text-slate-500">Active</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Draw: ~{(activeZoneData.evChargersOnline * 0.05).toFixed(1)} MW
              </div>
            </div>
          </div>

          {/* Substation Nodes List */}
          <div className="mt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2 font-mono">
              Key Transmission Hubs & Substations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeZoneData.majorNodes.map((node, i) => (
                <span key={i} className="text-[11px] font-mono px-2 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200/80 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {node}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Dispatch Action for Role */}
        <div className="pt-4 mt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-600">
              Role Authority: <span className="text-blue-700 font-bold">{role === 'govt_admin' ? 'Govt Policy Executive' : 'Grid Dispatch Officer'}</span>
            </span>
            {activeZoneData.feedersTripped > 0 && (
              <span className="text-[11px] font-mono text-rose-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                {activeZoneData.feedersTripped} Feeders Tripped
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTriggerZoneAction(activeZoneData.id, 'demand_response')}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              Shed Load (DR -40MW)
            </button>

            <button
              onClick={() => onTriggerZoneAction(activeZoneData.id, 'cooling_concession')}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Cooling Advisory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
