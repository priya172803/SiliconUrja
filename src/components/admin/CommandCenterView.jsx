import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { HOURLY_GRID_PROFILE, REGIONAL_ZONES } from './mockGridData';
import BengaluruSchematicMap from './BengaluruSchematicMap';
import {
  TrendingUp,
  Cpu,
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const LIGHT_CHART_DEFAULTS = {
  plugins: {
    legend: {
      labels: {
        color: '#334155',
        font: { family: 'JetBrains Mono, monospace', size: 11, weight: '600' },
        boxWidth: 12,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: '#ffffff',
      borderColor: '#93c5fd',
      borderWidth: 1.5,
      titleColor: '#0f172a',
      bodyColor: '#334155',
      titleFont: { family: 'JetBrains Mono, monospace', size: 12, weight: 'bold' },
      bodyFont: { family: 'JetBrains Mono, monospace', size: 11 },
      padding: 12,
      cornerRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  },
};

export default function CommandCenterView({ macroMetrics }) {
  const labels = HOURLY_GRID_PROFILE.map((h) => h.hour);
  const demandData = HOURLY_GRID_PROFILE.map((h) => h.demand);
  const capacityData = HOURLY_GRID_PROFILE.map((h) => h.capacity);
  const renewableData = HOURLY_GRID_PROFILE.map((h) => h.renewable);
  const thermalData = HOURLY_GRID_PROFILE.map((h) => h.baseThermal);

  const peakHourIndex = demandData.indexOf(Math.max(...demandData));

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Grid Capacity (GW)',
        data: capacityData,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.05)',
        borderDash: [6, 3],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Peak Demand (GW)',
        data: demandData,
        borderColor: '#ea580c',
        backgroundColor: 'rgba(234, 88, 12, 0.12)',
        borderWidth: 2.5,
        pointRadius: (ctx) => (ctx.dataIndex === peakHourIndex ? 6 : 0),
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Renewable Gen (GW)',
        data: renewableData,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.08)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Thermal Baseload (GW)',
        data: thermalData,
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.05)',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    ...LIGHT_CHART_DEFAULTS,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono, monospace', size: 10 }, maxRotation: 45 },
      },
      y: {
        min: 100,
        max: 200,
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        ticks: {
          color: '#64748b',
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          callback: (v) => `${v} GW`,
          stepSize: 20,
        },
      },
    },
    plugins: {
      ...LIGHT_CHART_DEFAULTS.plugins,
      tooltip: {
        ...LIGHT_CHART_DEFAULTS.plugins.tooltip,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} GW`,
        },
      },
      legend: {
        ...LIGHT_CHART_DEFAULTS.plugins.legend,
        position: 'bottom',
      },
    },
    interaction: { mode: 'index', intersect: false },
  };

  // Zone donut chart
  const zoneDoughnutData = {
    labels: REGIONAL_ZONES.map((z) => z.name),
    datasets: [{
      data: REGIONAL_ZONES.map((z) => z.currentDemandMW),
      backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#22c55e'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2.5,
      hoverOffset: 8,
    }],
  };

  const doughnutOptions = {
    ...LIGHT_CHART_DEFAULTS,
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      ...LIGHT_CHART_DEFAULTS.plugins,
      legend: {
        ...LIGHT_CHART_DEFAULTS.plugins.legend,
        position: 'bottom',
      },
      tooltip: {
        ...LIGHT_CHART_DEFAULTS.plugins.tooltip,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} MW`,
        },
      },
    },
  };

  const totalZoneDemand = REGIONAL_ZONES.reduce((s, z) => s + z.currentDemandMW, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Regional Schematic Map (Exact Replica of User's Photo) */}
      <BengaluruSchematicMap />

      {/* 2. Charts Row: 24-Hour Peak Demand vs Capacity + Zone Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* 24-Hour Demand vs Capacity Curve */}
        <div className="xl:col-span-2 bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                24-Hour State-Wide Peak Demand vs Capacity
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Karnataka Grid Load Curve (Thermal Baseload + Solar/Wind Peak + Hydro Peakers)
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Evening Peak: 188.0 GW @ 20:00</span>
            </div>
          </div>
          <div className="h-72">
            <Line data={lineChartData} options={lineOptions} />
          </div>
        </div>

        {/* Zone Demand Distribution Donut */}
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
              Zone Load Distribution
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Bengaluru Urban Grid · Real-Time Sectoral Draw
            </p>
          </div>
          <div className="relative flex-1 min-h-[190px] flex items-center justify-center">
            <Doughnut data={zoneDoughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-black font-mono text-slate-900">
                {(totalZoneDemand / 1000).toFixed(1)}k
              </div>
              <div className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
                MW Total
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2 pt-3 border-t border-slate-100">
            {REGIONAL_ZONES.map((z) => (
              <div key={z.id} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: z.color }} />
                  <span className="text-slate-700 font-medium">{z.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">{z.currentDemandMW.toLocaleString()} MW</span>
                  <span className={`font-bold ${
                    z.status === 'CRITICAL' ? 'text-rose-600' : z.status === 'WARNING' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>{z.congestionPct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. SCADA Alert Ticker in Blue/White theme */}
      <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">
              Live SCADA Dispatch Events — Priority Execution Queue
            </h3>
          </div>
          <span className="text-[11px] font-mono text-blue-600 font-semibold">
            SLDC Automated Dispatcher v3.4
          </span>
        </div>
        <div className="space-y-2">
          {[
            { ts: '17:10:14', msg: 'REROUTE: 180 MW shifted Peenya ➜ Nelamangala 400kV bypass (congestion relief)', lvl: 'WARNING' },
            { ts: '16:48:00', msg: 'BESS DISCHARGE: Jigani 50 MW / 200 MWh triggered for South Zone frequency stabilization', lvl: 'INFO' },
            { ts: '16:15:22', msg: 'ENFORCEMENT: ₹14.8L carbon penalty issued — Peenya Heavy Forgings Ltd (1,420 tCO2 excess)', lvl: 'ALERT' },
            { ts: '15:30:10', msg: 'DEMAND RESPONSE: 340 Bellandur commercial accounts — chiller setback 1.5°C signal sent', lvl: 'INFO' },
            { ts: '14:22:45', msg: 'RE SYNC: Pavagada Solar Park +450 MW synchronized — Radiation Peak Window (14:00–15:00)', lvl: 'SUCCESS' },
          ].map((e, i) => (
            <div key={i} className={`flex items-start space-x-3 text-xs font-mono py-2 px-3 rounded-xl border transition ${
              e.lvl === 'WARNING' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
              e.lvl === 'ALERT'   ? 'bg-rose-50/70 border-rose-200 text-rose-900' :
              e.lvl === 'SUCCESS' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' :
                                    'bg-blue-50/60 border-blue-100 text-slate-800'
            }`}>
              <span className="text-slate-400 font-bold shrink-0 mt-0.5">{e.ts}</span>
              <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-60 text-blue-600" />
              <span className="leading-relaxed font-medium">{e.msg}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
