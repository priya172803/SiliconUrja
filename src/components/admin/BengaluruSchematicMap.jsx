import React, { useState, useRef } from 'react';
import { 
  Zap, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Factory, 
  SunMedium, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';

// Exact SVG canvas matching the user's photograph
const W = 820;
const H = 640;
const CX = 350; // Center SLDC x
const CY = 345; // Center SLDC y

// Outer Polygon Points
const P_LEFT_MID = '105,305';   // Dividing line between North and West
const P_NORTH_TOP = '125,170';  // Top-left corner of North
const P_TOP_MID = '390,145';    // Dividing line between North and East
const P_EAST_RIGHT = '720,260';  // Far-right corner of East
const P_RIGHT_MID = '610,480';  // Dividing line between East and South
const P_SOUTH_BOT = '465,575';  // Bottom corner of South
const P_BOT_MID = '245,520';    // Dividing line between South and West
const P_WEST_BOT = '45,465';    // Far bottom-left corner of West

// Sector definitions with exact coordinates, metrics, and domain-rich details
const SECTOR_DATA = {
  north: {
    id: 'north',
    name: 'NORTH ZONE (Peenya)',
    metrics: '2,140 MW [93.0% PEAK]',
    currentMW: 2140,
    capacityMW: 2300,
    utilPct: 93.0,
    status: 'CRITICAL',
    statusColor: '#dc2626',
    statusBg: 'bg-rose-50 text-rose-700 border-rose-200',
    keyAreas: 'Peenya Industrial Estate, Manyata Tech Park, Hebbal, Yelahanka',
    substations: ['Nelamangala 400kV', 'Peenya 220kV', 'Hebbal 220kV'],
    feedersTotal: 342,
    feedersOverloaded: 31,
    carbonLimitT: 145000,
    actualEmissionsT: 162400,
    evLoadMW: 240,
    solarRooftopMW: 185,
    dispatchAction: 'Trigger Industrial Peak Tariff Surcharge & shift 350 MW to battery buffer',
    // Polygon: P_LEFT_MID -> P_NORTH_TOP -> P_TOP_MID -> Center
    points: `${P_LEFT_MID} ${P_NORTH_TOP} ${P_TOP_MID} ${CX},${CY}`,
    fill: 'rgba(239, 68, 68, 0.22)',
    fillHover: 'rgba(239, 68, 68, 0.38)',
    stroke: '#dc2626',
    dotX: 205,
    dotY: 235,
    dotColor: '#dc2626',
    textX: 345,
    textY: 245,
    textColor: '#b91c1c',
  },
  east: {
    id: 'east',
    name: 'EAST ZONE (Whitefield)',
    metrics: '1,980 MW [94.3% PEAK]',
    currentMW: 1980,
    capacityMW: 2100,
    utilPct: 94.3,
    status: 'CRITICAL',
    statusColor: '#e11d48',
    statusBg: 'bg-rose-50 text-rose-700 border-rose-200',
    keyAreas: 'Whitefield IT Corridor, Bellandur ORR, Marathahalli, ITPL',
    substations: ['Hoodi 400kV', 'HAL 220kV', 'Whitefield 220kV'],
    feedersTotal: 418,
    feedersOverloaded: 28,
    carbonLimitT: 110000,
    actualEmissionsT: 116800,
    evLoadMW: 420,
    solarRooftopMW: 310,
    dispatchAction: 'Commercial HVAC setback active across Bellandur tech parks',
    // Polygon: P_TOP_MID -> P_EAST_RIGHT -> P_RIGHT_MID -> Center
    points: `${P_TOP_MID} ${P_EAST_RIGHT} ${P_RIGHT_MID} ${CX},${CY}`,
    fill: 'rgba(254, 205, 211, 0.45)', // Peach/soft pinkish-red
    fillHover: 'rgba(254, 205, 211, 0.65)',
    stroke: '#e11d48',
    dotX: 550,
    dotY: 300,
    dotColor: '#dc2626',
    textX: 585,
    textY: 375,
    textColor: '#9f1239',
  },
  south: {
    id: 'south',
    name: 'SOUTH ZONE (E-City)',
    metrics: '1,890 MW [85.9%]',
    currentMW: 1890,
    capacityMW: 2200,
    utilPct: 85.9,
    status: 'WARNING',
    statusColor: '#d97706',
    statusBg: 'bg-amber-50 text-amber-700 border-amber-200',
    keyAreas: 'Electronic City, Koramangala, Bannerghatta, Jigani Ind. Area',
    substations: ['Somanahalli 400kV', 'E-City 220kV', 'Jigani 220kV'],
    feedersTotal: 380,
    feedersOverloaded: 9,
    carbonLimitT: 135000,
    actualEmissionsT: 129000,
    evLoadMW: 380,
    solarRooftopMW: 260,
    dispatchAction: 'Microgrid battery reserve at Jigani supplying 85 MW balancing',
    // Polygon: Center -> P_RIGHT_MID -> P_SOUTH_BOT -> P_BOT_MID -> Center
    points: `${CX},${CY} ${P_RIGHT_MID} ${P_SOUTH_BOT} ${P_BOT_MID}`,
    fill: 'rgba(254, 240, 138, 0.45)', // Soft yellow/amber
    fillHover: 'rgba(254, 240, 138, 0.70)',
    stroke: '#d97706',
    dotX: 410,
    dotY: 490,
    dotColor: '#ea580c',
    textX: 490,
    textY: 535,
    textColor: '#92400e',
  },
  west: {
    id: 'west',
    name: 'WEST ZONE (Bidadi)',
    metrics: '1,420 MW [69.3% OPT]',
    currentMW: 1420,
    capacityMW: 2050,
    utilPct: 69.3,
    status: 'STABLE',
    statusColor: '#16a34a',
    statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    keyAreas: 'Rajajinagar, Mysore Road Corridor, Kengeri, Bidadi Auto Cluster',
    substations: ['Bastipura 220kV', 'Kengeri 220kV', 'Rajajinagar 220kV'],
    feedersTotal: 275,
    feedersOverloaded: 2,
    carbonLimitT: 98000,
    actualEmissionsT: 84200,
    evLoadMW: 160,
    solarRooftopMW: 190,
    dispatchAction: '+630 MW operational headroom available for inter-zone power wheeling',
    // Polygon: P_LEFT_MID -> Center -> P_BOT_MID -> P_WEST_BOT
    points: `${P_LEFT_MID} ${CX},${CY} ${P_BOT_MID} ${P_WEST_BOT}`,
    fill: 'rgba(187, 247, 208, 0.48)', // Mint green
    fillHover: 'rgba(187, 247, 208, 0.72)',
    stroke: '#16a34a',
    dotX: 160,
    dotY: 420,
    dotColor: '#16a34a',
    textX: 195,
    textY: 450,
    textColor: '#166534',
  },
};

export default function BengaluruSchematicMap() {
  const [activeZone, setActiveZone] = useState(null);
  const [hoverCenter, setHoverCenter] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const currentData = activeZone ? SECTORAR_DETAILS(activeZone) : null;

  function SECTORAR_DETAILS(id) {
    return SECTOR_DATA[id] || null;
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden select-none transition-all ${
        isFullscreen ? 'fixed inset-3 z-50 shadow-2xl flex flex-col' : ''
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-50/70 via-white to-blue-50/70">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black text-slate-900 font-mono tracking-tight uppercase">
                Bengaluru Regional Load Heatmap — Zone-by-Zone Congestion Analysis
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
                SCADA INTERTIE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Hover cursor over any zone on the map to inspect real-time load, substation feeders & carbon status
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status Pills */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono">
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>North: 93.0%</span>
            </span>
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>East: 94.3%</span>
            </span>
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>South: 85.9%</span>
            </span>
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>West: 69.3%</span>
            </span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Drawing Area */}
      <div className={`relative bg-white flex items-center justify-center p-2 ${
        isFullscreen ? 'flex-1' : 'min-h-[520px]'
      }`}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`w-full max-w-4xl transition-all ${
            isFullscreen ? 'h-full max-h-[82vh]' : 'h-[510px]'
          }`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.18" />
            </filter>
            
            <radialGradient id="centerPulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Concentric Dashed Radar Circles Matching User Photo */}
          {/* Inner ring */}
          <circle
            cx={CX}
            cy={CY}
            r="82"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="5,5"
            opacity="0.65"
          />

          {/* Outer Ring Road (ORR) Dashed Ring */}
          <circle
            cx={CX}
            cy={CY}
            r="268"
            fill="none"
            stroke="#64748b"
            strokeWidth="1.8"
            strokeDasharray="7,6"
            opacity="0.75"
          />

          {/* 2. Arc label: "OUTER RING ROAD CORRIDOR (66kV / 220kV INTERTIE)" */}
          <path
            id="orrArcExact"
            d={`M ${CX - 250},${CY - 50} A 268,268 0 0,1 ${CX + 245},${CY - 50}`}
            fill="none"
            stroke="none"
          />
          <text
            fontSize="11.5"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="700"
            fill="#334155"
            letterSpacing="0.8"
          >
            <textPath href="#orrArcExact" startOffset="50%" textAnchor="middle">
              OUTER RING ROAD CORRIDOR (66kV / 220kV INTERTIE)
            </textPath>
          </text>

          {/* 3. The 4 Colored Polygon Sectors (Exact Layout From Photograph) */}
          {Object.values(SECTOR_DATA).map((sec) => {
            const isHovered = activeZone === sec.id;
            return (
              <g 
                key={sec.id}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setActiveZone(sec.id)}
                onMouseLeave={() => setActiveZone(null)}
              >
                <polygon
                  points={sec.points}
                  fill={isHovered ? sec.fillHover : sec.fill}
                  stroke={sec.stroke}
                  strokeWidth={isHovered ? 3.5 : 2.2}
                  filter={isHovered ? 'url(#mapShadow)' : undefined}
                  className="transition-all duration-200"
                />

                {/* Dot marker */}
                <circle
                  cx={sec.dotX}
                  cy={sec.dotY}
                  r={isHovered ? 8.5 : 7}
                  fill={sec.dotColor}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                <circle
                  cx={sec.dotX}
                  cy={sec.dotY}
                  r={isHovered ? 16 : 11}
                  fill={sec.dotColor}
                  opacity={isHovered ? 0.35 : 0.15}
                />

                {/* Zone Labels (Exact layout from user photograph) */}
                <text
                  x={sec.textX}
                  y={sec.textY}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="800"
                  fontSize={isHovered ? '14' : '13'}
                  fill={sec.textColor}
                  textAnchor="middle"
                  className="transition-all select-none pointer-events-none"
                >
                  {sec.name}
                </text>
                <text
                  x={sec.textX}
                  y={sec.textY + 18}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="700"
                  fontSize="11"
                  fill={sec.textColor}
                  textAnchor="middle"
                  opacity="0.9"
                  className="select-none pointer-events-none"
                >
                  {sec.metrics}
                </text>
              </g>
            );
          })}

          {/* 4. Center SLDC Marker (Blue circle with white ring & text above) */}
          <g 
            className="cursor-pointer"
            onMouseEnter={() => setHoverCenter(true)}
            onMouseLeave={() => setHoverCenter(false)}
          >
            {/* Pulse wave */}
            <circle cx={CX} cy={CY} r={hoverCenter ? 28 : 22} fill="url(#centerPulse)" />
            
            <circle
              cx={CX}
              cy={CY}
              r="10"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="3"
              className="transition-transform duration-200"
            />
            <circle cx={CX} cy={CY} r="4.5" fill="#1e3a8a" />

            {/* Exact label from photo: "SLDC ANAND RAO CIRCLE (HQ)" */}
            <text
              x={CX}
              y={CY - 16}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="800"
              fontSize="11.5"
              fill="#1e40af"
              textAnchor="middle"
              className="select-none"
            >
              SLDC ANAND RAO CIRCLE (HQ)
            </text>
          </g>
        </svg>

        {/* 5. DYNAMIC CURSOR HOVER CARD (Floating tooltip with full regional content) */}
        {activeZone && currentData && (
          <div
            className="absolute z-30 pointer-events-none w-80 bg-white/95 backdrop-blur-md border-2 rounded-2xl p-4 shadow-2xl transition-all duration-75 animate-in fade-in zoom-in-95"
            style={{
              borderColor: currentData.statusColor,
              // Smoothly anchor near cursor, with boundary clamping so it never overflows
              left: Math.min(Math.max(mousePos.x + 15, 20), (containerRef.current?.clientWidth || 800) - 340),
              top: Math.min(Math.max(mousePos.y - 120, 20), (containerRef.current?.clientHeight || 600) - 320),
            }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentData.statusColor }} />
                <span className="text-xs font-black font-mono text-slate-900 uppercase">
                  {currentData.name}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${currentData.statusBg}`}>
                {currentData.status} ({currentData.utilPct}%)
              </span>
            </div>

            {/* Load Utilization Bar */}
            <div className="mb-2.5">
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-500 font-medium">Real-Time Draw:</span>
                <span className="font-bold text-slate-900">
                  {currentData.currentMW.toLocaleString()} MW / {currentData.capacityMW.toLocaleString()} MW
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${currentData.utilPct}%`,
                    backgroundColor: currentData.statusColor,
                  }}
                />
              </div>
            </div>

            {/* Grid Detail Matrix */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-2.5">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 uppercase tracking-wider block font-bold">Substations</span>
                <span className="text-slate-800 font-bold block truncate mt-0.5">
                  {currentData.substations[0]}
                </span>
                <span className="text-[9px] text-slate-400">
                  {currentData.substations.length} 400/220kV Hubs
                </span>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 uppercase tracking-wider block font-bold">Feeder Health</span>
                <span className={`font-bold block mt-0.5 ${currentData.feedersOverloaded > 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {currentData.feedersOverloaded} Overloaded
                </span>
                <span className="text-[9px] text-slate-400">
                  of {currentData.feedersTotal} Total Feeders
                </span>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 uppercase tracking-wider block font-bold">Rooftop Solar</span>
                <span className="text-emerald-700 font-bold block mt-0.5">
                  +{currentData.solarRooftopMW} MW Export
                </span>
                <span className="text-[9px] text-slate-400">
                  Captive Generation
                </span>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 uppercase tracking-wider block font-bold">EV Load Corridor</span>
                <span className="text-blue-700 font-bold block mt-0.5">
                  {currentData.evLoadMW} MW Charging
                </span>
                <span className="text-[9px] text-slate-400">
                  Peak Window Active
                </span>
              </div>
            </div>

            {/* Coverage Areas */}
            <div className="text-[10px] font-mono text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100 mb-2">
              <span className="font-bold text-blue-900 block mb-0.5">Coverage Corridors:</span>
              <span className="line-clamp-2 leading-relaxed">{currentData.keyAreas}</span>
            </div>

            {/* Active SLDC SCADA Directive */}
            <div className="text-[10px] font-mono p-2 rounded-lg bg-slate-900 text-white flex items-start space-x-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-tight">{currentData.dispatchAction}</span>
            </div>
          </div>
        )}

        {/* 6. SLDC CENTER HOVER CARD */}
        {hoverCenter && (
          <div
            className="absolute z-30 pointer-events-none w-72 bg-white/95 backdrop-blur-md border-2 border-blue-600 rounded-2xl p-4 shadow-2xl transition-all duration-75 animate-in fade-in zoom-in-95"
            style={{
              left: Math.min(Math.max(mousePos.x + 15, 20), (containerRef.current?.clientWidth || 800) - 300),
              top: Math.min(Math.max(mousePos.y - 100, 20), (containerRef.current?.clientHeight || 600) - 260),
            }}
          >
            <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <span className="text-xs font-black font-mono text-blue-950 uppercase">
                SLDC ANAND RAO CIRCLE (HQ)
              </span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Master SCADA Node:</span>
                <span className="font-bold text-emerald-600">● ONLINE (Synced)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grid Frequency:</span>
                <span className="font-bold text-blue-700">50.02 Hz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Intertie Corridor:</span>
                <span className="font-bold text-slate-800">66kV / 220kV Ring</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Connected Load:</span>
                <span className="font-bold text-slate-900">7,430 MW Urban</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Information Footer */}
      <div className="w-full px-5 py-2.5 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-800">Karnataka Power Transmission Corporation Ltd. (KPTCL)</span>
          <span className="text-slate-300">|</span>
          <span>Intertie Frequency: <strong className="text-blue-700">50.02 Hz</strong></span>
          <span className="text-slate-300">|</span>
          <span>SLDC SCADA Link: <strong className="text-emerald-700">OPTIMAL</strong></span>
        </div>
        <div className="text-[11px] text-blue-700 font-semibold flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5" />
          <span>Move cursor across sectors to view real-time regional content</span>
        </div>
      </div>
    </div>
  );
}
