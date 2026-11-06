import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import BengaluruHeatmap from './BengaluruHeatmap';
import { 
  Zap, 
  Activity, 
  AlertTriangle, 
  Flame, 
  BatteryCharging, 
  Layers, 
  Radio, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Cpu, 
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MacroCommandCenter({
  zones,
  selectedZone,
  onSelectZone,
  hourlyCurve,
  role,
  onTriggerZoneAction,
  onEmergencyDispatch
}) {
  const [showRenewableOverlay, setShowRenewableOverlay] = useState(true);
  const [showForecast, setShowForecast] = useState(true);

  // Chart data setup for 24-Hour Peak Demand vs Capacity - Light White & Blue Theme
  const chartData = {
    labels: hourlyCurve.map(d => d.hour),
    datasets: [
      {
        label: 'Grid Capacity Ceiling (GW)',
        data: hourlyCurve.map(d => d.capacity),
        borderColor: '#2563eb', // Royal Blue
        borderDash: [6, 4],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0,
      },
      {
        label: 'Real-Time Actual Demand (GW)',
        data: hourlyCurve.map(d => d.demand),
        borderColor: '#d97706', // Amber-600
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 320);
          gradient.addColorStop(0, 'rgba(217, 119, 6, 0.25)');
          gradient.addColorStop(1, 'rgba(217, 119, 6, 0.02)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#b45309',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35,
      },
      ...(showForecast ? [{
        label: 'AI Day-Ahead Forecast (GW)',
        data: hourlyCurve.map(d => d.forecast),
        borderColor: '#7c3aed', // Purple
        borderDash: [3, 3],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.35,
      }] : []),
      ...(showRenewableOverlay ? [{
        label: 'Solar + Wind Injection (GW)',
        data: hourlyCurve.map(d => (d.solar + d.wind)),
        borderColor: '#059669', // Emerald
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
        tension: 0.4,
      }] : [])
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#334155',
          font: { family: 'JetBrains Mono', size: 11, weight: 'bold' },
          usePointStyle: true,
          boxWidth: 8,
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        titleColor: '#1e40af',
        bodyColor: '#1e293b',
        padding: 12,
        boxPadding: 4,
        bodyFont: { family: 'JetBrains Mono' },
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y} GW`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(203, 213, 225, 0.5)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 } }
      },
      y: {
        min: 120,
        max: 205,
        grid: { color: 'rgba(203, 213, 225, 0.5)' },
        ticks: { 
          color: '#64748b', 
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (value) => `${value} GW`
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Bengaluru Regional Load Heatmap Representation */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 tracking-wide uppercase">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
              Regional Load Heatmap & Substation Telemetry
            </h2>
            <span className="text-xs text-slate-500 font-mono">(BESCOM 4-Zone Spatial Matrix)</span>
          </div>

          <div className="text-xs text-slate-600 font-mono">
            High Congestion Threshold: <span className="text-rose-600 font-bold">&gt;92% MVA Limit</span>
          </div>
        </div>

        <BengaluruHeatmap
          zones={zones}
          selectedZone={selectedZone}
          onSelectZone={onSelectZone}
          role={role}
          onTriggerZoneAction={onTriggerZoneAction}
        />
      </section>

      {/* 2. Grid-wide 24-Hour Peak Demand vs Capacity Curve & Dispatch Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chart Column (8 cols) - Crisp White Container */}
        <div className="lg:col-span-8 bg-white border border-blue-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Grid-Wide 24-Hour Peak Demand vs Capacity Curve
                </h3>
                <p className="text-xs text-slate-500">
                  Critical Shading Window: <span className="text-amber-700 font-bold font-mono">18:00 - 22:00 IST (Peak Thermal Draw)</span>
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRenewableOverlay(!showRenewableOverlay)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                    showRenewableOverlay
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  🍃 Solar+Wind
                </button>
                <button
                  onClick={() => setShowForecast(!showForecast)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                    showForecast
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  ⚡ AI Forecast
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="w-full h-[320px] relative">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs font-mono mt-2">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Today's Recorded Peak</span>
              <span className="text-amber-800 text-sm font-bold">188.0 GW @ 18:00</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Minimum Overnight Valley</span>
              <span className="text-blue-800 text-sm font-bold">139.0 GW @ 04:00</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Renewable Penetration Peak</span>
              <span className="text-emerald-800 text-sm font-bold">70.0 GW @ 12:00 (56 Solar)</span>
            </div>
          </div>
        </div>

        {/* Dispatch Controls & Real-Time Alerts Ticker (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Quick Dispatch Action Widget */}
          <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                  SLDC Fast Dispatch Desk
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Direct emergency interventions authorized for BESCOM dispatchers to protect the 4 GW reserve buffer:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onEmergencyDispatch('hydro_peaker')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Spool Sharavathi Hydro (+500 MW)
                  </span>
                  <span className="text-[10px] font-mono text-blue-800 bg-blue-100 px-2 py-0.5 rounded font-bold">
                    +0.5 GW
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Ramp-up time: 3.5 mins • Linganamakki reservoir head nominal
                </div>
              </button>

              <button
                onClick={() => onEmergencyDispatch('demand_response')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Trigger Industrial DR Tier-1
                  </span>
                  <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-bold">
                    -350 MW
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Notifies 84 heavy units in Peenya & Bidadi to throttle arc furnaces
                </div>
              </button>

              <button
                onClick={() => onEmergencyDispatch('battery_storage')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Discharge Hoodi BESS (+200 MW)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    +0.2 GW
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Grid-scale lithium battery • Current SOC: 88% (420 MWh stored)
                </div>
              </button>
            </div>
          </div>

          {/* Live Alerts Stream */}
          <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                Live SCADA Alerts Feed
              </span>
              <span className="text-[10px] text-slate-400 font-mono">14:30 IST</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-mono">
                <span className="text-slate-500">[14:28]</span> <strong>Hoodi 400kV</strong>: Transformer bank #3 oil temp reached 72°C. Cooling fans activated.
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-mono">
                <span className="text-slate-500">[14:15]</span> <strong>Peenya Industrial</strong>: Feeder #14 trip cleared. 18 MW load restored safely.
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 font-mono">
                <span className="text-slate-500">[13:50]</span> <strong>Pavagada Solar</strong>: Peak afternoon injection reached 2,050 MW nominal sync.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
