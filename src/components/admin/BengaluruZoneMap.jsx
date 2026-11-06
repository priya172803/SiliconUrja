import React, { useEffect, useRef, useState } from 'react';
import { REGIONAL_ZONES } from './mockGridData';
import {
  MapPin,
  Zap,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Maximize2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Approximate GeoJSON polygon coordinates for each Bengaluru zone
// All coordinates are [lat, lng] for Leaflet
// ---------------------------------------------------------------------------
const ZONE_POLYGONS = {
  north: [
    // Bengaluru North: Yelahanka, Peenya, Manyata, Hebbal, Doddaballapur corridor
    [13.1700, 77.4800],
    [13.1700, 77.7200],
    [13.0700, 77.7200],
    [12.9950, 77.6800],
    [12.9900, 77.6200],
    [12.9950, 77.5700],
    [13.0300, 77.5200],
    [13.0600, 77.4800],
    [13.1700, 77.4800],
  ],
  east: [
    // Bengaluru East: Whitefield, Bellandur, Marathahalli, ITPL, HAL
    [12.9950, 77.6800],
    [13.0700, 77.7200],
    [13.1700, 77.7200],
    [13.1700, 77.9000],
    [12.8800, 77.9000],
    [12.8800, 77.7200],
    [12.9200, 77.6800],
    [12.9950, 77.6800],
  ],
  south: [
    // Bengaluru South: Electronic City, Koramangala, Bannerghatta, Jigani
    [12.9200, 77.6800],
    [12.8800, 77.7200],
    [12.8800, 77.4800],
    [12.7800, 77.4800],
    [12.7800, 77.7000],
    [12.8400, 77.7200],
    [12.9200, 77.6800],
  ],
  west: [
    // Bengaluru West: Rajajinagar, Kengeri, Mysore Road, Magadi Road
    [13.0300, 77.5200],
    [12.9950, 77.5700],
    [12.9900, 77.6200],
    [12.9200, 77.6800],
    [12.8400, 77.7200],  // shared boundary with south-east corner
    [12.8800, 77.4800],
    [12.7800, 77.4800],
    [13.0600, 77.4800],
    [13.0300, 77.5200],
  ],
};

const STATUS_STYLES = {
  CRITICAL: { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.28, weight: 2.5, dashArray: '6 3' },
  WARNING:  { color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.22, weight: 2,   dashArray: null },
  STABLE:   { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.18, weight: 1.5, dashArray: null },
};

const STATUS_ICON = { CRITICAL: '🔴', WARNING: '🟡', STABLE: '🟢' };

// ---------------------------------------------------------------------------
// Leaflet map (dynamically imported to avoid SSR issues with Vite)
// ---------------------------------------------------------------------------
export default function BengaluruZoneMap() {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const polygonRefs = useRef({});
  const [selectedZone, setSelectedZone] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamically import leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Wait one tick for CSS then init map
    const timer = setTimeout(() => initMap(), 100);
    return () => {
      clearTimeout(timer);
      link.remove();
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const initMap = async () => {
    if (!mapRef.current || leafletMapRef.current) return;

    const L = (await import('leaflet')).default;

    // Fix default icon path issue with Vite/webpack
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current, {
      center: [12.9716, 77.5946],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    leafletMapRef.current = map;

    // Dark tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Draw zone polygons
    REGIONAL_ZONES.forEach((zone) => {
      const coords = ZONE_POLYGONS[zone.id];
      if (!coords) return;

      const style = STATUS_STYLES[zone.status];
      const utilPct = ((zone.currentDemandMW / zone.capacityMW) * 100).toFixed(1);

      const polygon = L.polygon(coords, {
        color: style.color,
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
        weight: style.weight,
        dashArray: style.dashArray || undefined,
        className: `zone-polygon zone-${zone.id}`,
      }).addTo(map);

      // Popup HTML
      const popupContent = `
        <div style="
          font-family: 'JetBrains Mono', monospace;
          background: #0b1222;
          border: 1px solid ${style.color}60;
          border-radius: 10px;
          padding: 14px;
          min-width: 240px;
          color: #e2e8f0;
          box-shadow: 0 0 20px ${style.color}30;
        ">
          <div style="font-size:11px; color:${style.color}; font-weight:900; letter-spacing:0.1em; margin-bottom:6px; text-transform:uppercase;">
            ${STATUS_ICON[zone.status]} ${zone.status} — ${zone.name}
          </div>
          <div style="font-size:13px; font-weight:800; color:#f1f5f9; margin-bottom:8px; line-height:1.3;">
            ${zone.keyAreas.split(',')[0].trim()}
            <span style="color:#94a3b8;"> & surrounding areas</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
            <div style="background:#1e293b; border-radius:6px; padding:7px; text-align:center;">
              <div style="font-size:17px; font-weight:900; color:${style.color};">${utilPct}%</div>
              <div style="font-size:9px; color:#64748b; text-transform:uppercase; margin-top:2px;">Grid Utilization</div>
            </div>
            <div style="background:#1e293b; border-radius:6px; padding:7px; text-align:center;">
              <div style="font-size:17px; font-weight:900; color:#06b6d4;">${zone.currentDemandMW.toLocaleString()}</div>
              <div style="font-size:9px; color:#64748b; text-transform:uppercase; margin-top:2px;">MW Demand</div>
            </div>
            <div style="background:#1e293b; border-radius:6px; padding:7px; text-align:center;">
              <div style="font-size:14px; font-weight:700; color:#94a3b8;">${zone.capacityMW.toLocaleString()} MW</div>
              <div style="font-size:9px; color:#64748b; text-transform:uppercase; margin-top:2px;">Capacity</div>
            </div>
            <div style="background:#1e293b; border-radius:6px; padding:7px; text-align:center;">
              <div style="font-size:14px; font-weight:700; color:#a78bfa;">${zone.evLoadMW} MW</div>
              <div style="font-size:9px; color:#64748b; text-transform:uppercase; margin-top:2px;">EV Load</div>
            </div>
          </div>
          <div style="background:${style.fillColor}15; border:1px solid ${style.color}30; border-radius:6px; padding:7px; font-size:10px; color:#cbd5e1; line-height:1.5;">
            ⚡ ${zone.recommendation}
          </div>
          <div style="margin-top:8px; font-size:9px; color:#475569; border-top:1px solid #1e293b; padding-top:6px;">
            Feeders: ${zone.feedersTotal} total · ${zone.feedersOverloaded} overloaded &nbsp;|&nbsp; Solar: ${zone.solarRooftopMW} MW
          </div>
        </div>
      `;

      polygon.bindPopup(popupContent, {
        className: 'leaflet-dark-popup',
        maxWidth: 280,
        closeButton: true,
      });

      // Zone centroid label marker (custom div icon)
      const bounds = polygon.getBounds();
      const center = bounds.getCenter();

      const divIcon = L.divIcon({
        html: `
          <div style="
            background: rgba(11,18,34,0.92);
            border: 1.5px solid ${style.color};
            border-radius: 8px;
            padding: 5px 9px;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            white-space: nowrap;
            box-shadow: 0 0 12px ${style.color}50;
            pointer-events: none;
          ">
            <div style="font-size: 10px; font-weight: 900; color: ${style.color}; letter-spacing:0.05em; text-transform:uppercase;">${zone.name.replace('Bengaluru ', '')}</div>
            <div style="font-size: 13px; font-weight: 900; color: #f1f5f9; margin: 1px 0;">${utilPct}%</div>
            <div style="font-size: 9px; color: #64748b;">${(zone.currentDemandMW / 1000).toFixed(1)}k MW</div>
          </div>
        `,
        className: '',
        iconAnchor: [45, 30],
      });

      L.marker(center, { icon: divIcon, interactive: false }).addTo(map);

      // Hover effects
      polygon.on('mouseover', function () {
        this.setStyle({ fillOpacity: style.fillOpacity + 0.15, weight: style.weight + 1 });
      });
      polygon.on('mouseout', function () {
        this.setStyle({ fillOpacity: style.fillOpacity, weight: style.weight });
      });
      polygon.on('click', function () {
        setSelectedZone(zone.id);
      });

      polygonRefs.current[zone.id] = polygon;
    });

    // Central city marker (Vidhana Soudha)
    const cityCenter = L.divIcon({
      html: `
        <div style="
          background: rgba(6,182,212,0.15);
          border: 2px solid #06b6d4;
          border-radius: 50%;
          width: 44px; height: 44px;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          box-shadow: 0 0 18px #06b6d480;
          font-family:'JetBrains Mono',monospace;
        ">
          <div style="font-size:14px;">🏛️</div>
          <div style="font-size:7px; color:#06b6d4; font-weight:700;">SLDC</div>
        </div>
      `,
      className: '',
      iconAnchor: [22, 22],
    });

    L.marker([12.9716, 77.5946], { icon: cityCenter })
      .bindPopup(`
        <div style="font-family:'JetBrains Mono',monospace; background:#0b1222; border:1px solid #06b6d440; border-radius:8px; padding:12px; color:#e2e8f0; min-width:200px;">
          <div style="font-size:11px; color:#06b6d4; font-weight:900; margin-bottom:6px;">🏛️ SLDC BENGALURU NODE 01</div>
          <div style="font-size:10px; color:#94a3b8; line-height:1.6;">
            State Load Dispatch Centre<br/>
            Karnataka Power Transmission Corp Ltd (KPTCL)<br/>
            <span style="color:#10b981; font-weight:700;">● SCADA LIVE · 50.02 Hz</span>
          </div>
        </div>
      `, { className: 'leaflet-dark-popup', maxWidth: 240 })
      .addTo(map);

    // Add substation markers for key nodes
    const substations = [
      { name: 'Nelamangala 400kV', lat: 13.098, lng: 77.397, zone: 'north' },
      { name: 'Hoodi 400kV', lat: 13.009, lng: 77.712, zone: 'east' },
      { name: 'Somanahalli 400kV', lat: 12.892, lng: 77.566, zone: 'south' },
      { name: 'Bastipura 220kV', lat: 12.952, lng: 77.491, zone: 'west' },
    ];

    substations.forEach((sub) => {
      const zone = REGIONAL_ZONES.find((z) => z.id === sub.zone);
      const col = STATUS_STYLES[zone.status].color;
      const ssIcon = L.divIcon({
        html: `<div style="
          width:10px; height:10px; border-radius:50%;
          background:${col}; border:2px solid #fff;
          box-shadow: 0 0 8px ${col};
        "></div>`,
        className: '',
        iconAnchor: [5, 5],
      });
      L.marker([sub.lat, sub.lng], { icon: ssIcon })
        .bindTooltip(`<span style="font-family:monospace; font-size:11px; color:#06b6d4;">${sub.name}</span>`, {
          permanent: false, direction: 'top', className: 'leaflet-dark-tooltip',
        })
        .addTo(map);
    });

    // Inject custom popup / tooltip CSS into shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-dark-popup .leaflet-popup-content-wrapper,
      .leaflet-dark-popup .leaflet-popup-tip {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      .leaflet-dark-popup .leaflet-popup-content {
        margin: 0 !important;
      }
      .leaflet-dark-tooltip {
        background: #0b1222 !important;
        border: 1px solid #06b6d440 !important;
        color: #e2e8f0 !important;
        border-radius: 6px !important;
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 11px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
      }
      .leaflet-dark-tooltip::before {
        border-top-color: #06b6d440 !important;
      }
      .leaflet-container {
        background: #030712 !important;
      }
      .leaflet-control-zoom a {
        background: #0b1222 !important;
        color: #94a3b8 !important;
        border-color: #1e293b !important;
      }
      .leaflet-control-zoom a:hover {
        background: #1e293b !important;
        color: #06b6d4 !important;
      }
      .leaflet-control-attribution {
        background: rgba(11,18,34,0.8) !important;
        color: #475569 !important;
        font-size: 9px !important;
      }
      .leaflet-control-attribution a {
        color: #06b6d4 !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Highlight selected zone from sidebar click
  const handleSidebarZoneClick = async (zoneId) => {
    setSelectedZone(zoneId);
    const L = (await import('leaflet')).default;
    const poly = polygonRefs.current[zoneId];
    const map = leafletMapRef.current;
    if (poly && map) {
      map.fitBounds(poly.getBounds(), { padding: [40, 40], maxZoom: 12 });
      poly.openPopup();
    }
  };

  return (
    <div className={`bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}
      ref={containerRef}
    >
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Bengaluru Regional Load Heatmap
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Zone-by-Zone Congestion Analysis · Live SCADA Overlay · CartoDB Dark Matter</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Legend */}
          <div className="hidden sm:flex items-center space-x-3 text-[10px] font-mono text-slate-400 mr-2">
            {[
              { label: 'Critical', color: '#ef4444' },
              { label: 'Warning', color: '#f59e0b' },
              { label: 'Stable', color: '#10b981' },
            ].map((l) => (
              <div key={l.label} className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm opacity-70" style={{ backgroundColor: l.color }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Leaflet Map */}
        <div className={`flex-1 ${isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[480px]'}`}
          ref={mapRef}
          id="bengaluru-zone-map"
        />

        {/* Zone Sidebar */}
        <div className={`lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto ${isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[480px]'}`}>
          <div className="p-3 border-b border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center space-x-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Zone Status Panel</span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">Click zone to fly to it on map</p>
          </div>
          <div className="divide-y divide-slate-800/60">
            {REGIONAL_ZONES.map((zone) => {
              const utilPct = ((zone.currentDemandMW / zone.capacityMW) * 100).toFixed(1);
              const isSelected = selectedZone === zone.id;
              const color = zone.status === 'CRITICAL' ? '#ef4444' : zone.status === 'WARNING' ? '#f59e0b' : '#10b981';

              return (
                <button
                  key={zone.id}
                  onClick={() => handleSidebarZoneClick(zone.id)}
                  className={`w-full text-left p-3 hover:bg-slate-800/60 transition-all ${isSelected ? 'bg-slate-800/80' : ''}`}
                >
                  {/* Zone name + status */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                      <span className="text-xs font-bold text-slate-200 font-mono">{zone.name.replace('Bengaluru ', '')}</span>
                    </div>
                    <span className="text-[10px] font-bold font-mono" style={{ color }}>
                      {zone.status}
                    </span>
                  </div>

                  {/* Mini utilization bar */}
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-1.5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${utilPct}%`, backgroundColor: color, boxShadow: `0 0 5px ${color}60` }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>{zone.currentDemandMW.toLocaleString()} MW</span>
                    <span style={{ color }} className="font-bold">{utilPct}% load</span>
                  </div>

                  {/* Carbon compliance indicator */}
                  <div className={`mt-2 text-[9px] font-mono px-2 py-1 rounded border ${
                    zone.actualEmissionsT > zone.carbonLimitMonthT
                      ? 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      : 'bg-emerald-950/20 border-emerald-800/30 text-emerald-300'
                  }`}>
                    CO2: {(zone.actualEmissionsT / 1000).toFixed(1)}k / {(zone.carbonLimitMonthT / 1000).toFixed(1)}k t · {zone.complianceRate}
                  </div>

                  {/* Primary substation */}
                  <div className="mt-1.5 text-[9px] font-mono text-slate-500 truncate">
                    📡 {zone.primarySubstations[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map legend footer */}
          <div className="p-3 border-t border-slate-800 text-[9px] font-mono text-slate-500 space-y-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Map Legend</div>
            <div className="flex items-center space-x-1.5"><div className="w-3 h-1 rounded bg-rose-500 opacity-80" /><span>CRITICAL (≥90% load)</span></div>
            <div className="flex items-center space-x-1.5"><div className="w-3 h-1 rounded bg-amber-400 opacity-80" /><span>WARNING (75–90%)</span></div>
            <div className="flex items-center space-x-1.5"><div className="w-3 h-1 rounded bg-emerald-500 opacity-80" /><span>STABLE (&lt;75%)</span></div>
            <div className="flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-cyan-400 opacity-80" /><span>400/220kV Substation</span></div>
            <div className="flex items-center space-x-1.5"><div className="text-sm">🏛️</div><span>SLDC Dispatch Hub</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
