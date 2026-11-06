import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { REGISTERED_FACILITIES, SECTORAL_DATA } from './mockGridData';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileWarning,
  Zap,
  Factory,
  ExternalLink,
  Info,
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

const PAGE_SIZE = 5;

export default function SectoralComplianceView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [expandedRow, setExpandedRow] = useState(null);

  const zones = ['All', ...new Set(REGISTERED_FACILITIES.map((f) => f.zone))];

  const filtered = useMemo(() => {
    return REGISTERED_FACILITIES.filter((f) => {
      const matchSearch =
        search === '' ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.id.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || f.status === statusFilter;
      const matchZone = zoneFilter === 'All' || f.zone === zoneFilter;
      return matchSearch && matchStatus && matchZone;
    });
  }, [search, statusFilter, zoneFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handlePageChange = (dir) => {
    setPage((p) => Math.max(0, Math.min(totalPages - 1, p + dir)));
  };

  const resetPage = () => setPage(0);

  // Sectoral Bar Chart Data
  const sectorBarData = {
    labels: SECTORAL_DATA.sectors.map((s) => s.name),
    datasets: [
      {
        label: 'Peak Load (MW)',
        data: SECTORAL_DATA.sectors.map((s) => s.peakDrawMW),
        backgroundColor: ['rgba(37, 99, 235, 0.85)', 'rgba(217, 119, 6, 0.85)', 'rgba(22, 163, 74, 0.85)'],
        borderColor: ['#2563eb', '#d97706', '#16a34a'],
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: 'Off-Peak Load (MW)',
        data: SECTORAL_DATA.sectors.map((s) => s.offPeakDrawMW),
        backgroundColor: ['rgba(37, 99, 235, 0.3)', 'rgba(217, 119, 6, 0.3)', 'rgba(22, 163, 74, 0.3)'],
        borderColor: ['#2563eb', '#d97706', '#16a34a'],
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const sectorCarbonData = {
    labels: SECTORAL_DATA.sectors.map((s) => s.name),
    datasets: [
      {
        label: 'Daily Carbon (tCO2)',
        data: SECTORAL_DATA.sectors.map((s) => s.carbonTPerDay),
        backgroundColor: ['rgba(220, 38, 38, 0.8)', 'rgba(217, 119, 6, 0.8)', 'rgba(22, 163, 74, 0.8)'],
        borderColor: ['#dc2626', '#d97706', '#16a34a'],
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    ...LIGHT_CHART_DEFAULTS,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' } },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono, monospace', size: 10 }, callback: (v) => `${(v / 1000).toFixed(1)}k` },
      },
    },
    plugins: {
      ...LIGHT_CHART_DEFAULTS.plugins,
      legend: { ...LIGHT_CHART_DEFAULTS.plugins.legend, position: 'top' },
      tooltip: {
        ...LIGHT_CHART_DEFAULTS.plugins.tooltip,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} MW` },
      },
    },
  };

  const carbonBarOptions = {
    ...barOptions,
    plugins: {
      ...barOptions.plugins,
      tooltip: {
        ...LIGHT_CHART_DEFAULTS.plugins.tooltip,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} tCO2/day` },
      },
    },
    scales: {
      ...barOptions.scales,
      y: {
        ...barOptions.scales.y,
        ticks: { ...barOptions.scales.y.ticks, callback: (v) => `${(v / 1000).toFixed(0)}k t` },
      },
    },
  };

  const flaggedCount = REGISTERED_FACILITIES.filter((f) => f.status === 'Flagged').length;
  const compliantCount = REGISTERED_FACILITIES.length - flaggedCount;

  return (
    <div className="space-y-6">
      {/* Summary KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Registered Facilities', val: REGISTERED_FACILITIES.length, icon: Factory, iconCls: 'text-blue-600', border: 'border-blue-200', bg: 'bg-white' },
          { label: 'Compliant This Month', val: compliantCount, icon: CheckCircle2, iconCls: 'text-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50/30' },
          { label: 'Flagged / Violation Notice', val: flaggedCount, icon: FileWarning, iconCls: 'text-rose-600', border: 'border-rose-200', bg: 'bg-rose-50/30' },
          { label: 'Total Carbon Overage (tCO2)', val: REGISTERED_FACILITIES.filter(f => f.status === 'Flagged').reduce((a, f) => a + f.excessT, 0).toLocaleString(), icon: Zap, iconCls: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-50/30' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`relative ${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm overflow-hidden`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">{s.label}</span>
                <Icon className={`w-4 h-4 ${s.iconCls}`} />
              </div>
              <div className="text-2xl font-black font-mono text-slate-900">{s.val}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider mb-1">
            Sectoral Peak vs Off-Peak Power Draw (MW)
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mb-4">
            Bengaluru Urban Grid — Industrial / Commercial / Residential
          </p>
          <div className="h-56">
            <Bar data={sectorBarData} options={barOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {SECTORAL_DATA.sectors.map((s) => (
              <div key={s.name} className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <div className="text-[11px] font-mono font-bold text-slate-700">{s.name}</div>
                <div className="text-xs font-black font-mono mt-0.5 text-blue-700">{s.percentage}% of grid</div>
                <div className="text-[10px] font-mono text-slate-500">{s.facilityCount.toLocaleString()} units</div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5 leading-tight">Peak: {s.peakWindow}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider mb-1">
            Sectoral Daily Carbon Emissions (tCO2/day)
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mb-4">
            Average emitted per sector · Current statutory month baseline
          </p>
          <div className="h-56">
            <Bar data={sectorCarbonData} options={carbonBarOptions} />
          </div>
          <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 text-xs font-mono text-slate-700">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Total sectoral output: <strong className="text-blue-900 font-bold">{(SECTORAL_DATA.sectors.reduce((a, s) => a + s.carbonTPerDay, 0) / 1000).toFixed(1)}k tCO2/day</strong>. Active carbon surcharge rate: ₹1,200/tCO2 under KSPCB & BESCOM Environmental Code 2026.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Compliance Table */}
      <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wide">
              Registered Facility Compliance Registry
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {filtered.length} of {REGISTERED_FACILITIES.length} facilities · BBMP & KSPCB Industrial Emission Register 2026
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search facility, ID, zone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52 shadow-sm"
              />
            </div>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 shadow-sm"
            >
              {['All', 'Compliant', 'Flagged'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {/* Zone Filter */}
            <select
              value={zoneFilter}
              onChange={(e) => { setZoneFilter(e.target.value); resetPage(); }}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 shadow-sm"
            >
              {zones.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-600">
                {['Facility ID', 'Facility Name', 'Category', 'Zone', 'Carbon Limit (t/mo)', 'Actual Emissions (tCO2)', 'Status', 'Penalty Levied', 'Action'].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No facilities match the current filters.
                  </td>
                </tr>
              ) : paged.map((f) => (
                <React.Fragment key={f.id}>
                  <tr
                    className={`transition cursor-pointer ${
                      f.status === 'Flagged'
                        ? 'bg-rose-50/40 hover:bg-rose-50/70'
                        : 'hover:bg-blue-50/40'
                    } ${expandedRow === f.id ? 'bg-blue-50/60' : ''}`}
                    onClick={() => setExpandedRow(expandedRow === f.id ? null : f.id)}
                  >
                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap font-bold">{f.id}</td>
                    <td className="px-3 py-3 font-bold text-slate-900 whitespace-nowrap">{f.name}</td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{f.category}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {f.zone}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-700 text-right whitespace-nowrap font-medium">{f.monthlyCarbonLimitT.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <span className={`font-black ${f.status === 'Flagged' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {f.actualEmissionsT.toLocaleString()}
                      </span>
                      {f.excessT > 0 && (
                        <span className="ml-1 text-rose-600 text-[10px] font-bold">(+{f.excessT.toLocaleString()})</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        f.status === 'Flagged'
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      }`}>
                        {f.status === 'Flagged'
                          ? <AlertTriangle className="w-3 h-3" />
                          : <CheckCircle2 className="w-3 h-3" />}
                        <span>{f.status}</span>
                      </span>
                    </td>
                    <td className={`px-3 py-3 text-right whitespace-nowrap font-bold ${f.status === 'Flagged' ? 'text-rose-600' : 'text-slate-400'}`}>
                      {f.penaltyLeviedRs}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === f.id ? null : f.id); }}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                          f.status === 'Flagged'
                            ? 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {f.status === 'Flagged' ? (
                          <><FileWarning className="w-3 h-3" /><span>Review Notice</span></>
                        ) : (
                          <><ExternalLink className="w-3 h-3" /><span>View Details</span></>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === f.id && (
                    <tr className="bg-blue-50/50 border-b border-blue-100">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                          {[
                            { label: 'Contact Officer', val: f.contactOfficer },
                            { label: 'Compliance Score', val: `${f.complianceScore} / 100` },
                            { label: 'Last Audit Date', val: f.lastAuditDate },
                            { label: 'Peak Power Draw', val: `${f.powerDrawMW} MW` },
                          ].map((d) => (
                            <div key={d.label}>
                              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{d.label}</div>
                              <div className="text-slate-900 font-bold">{d.val}</div>
                            </div>
                          ))}
                          <div className="col-span-2 md:col-span-4">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Last Audit / Statutory Directives</div>
                            <div className={`px-3 py-2 rounded-lg border leading-relaxed ${
                              f.status === 'Flagged'
                                ? 'bg-rose-50 border-rose-200 text-rose-800'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            }`}>
                              {f.actionHistory}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500 bg-slate-50/40">
          <span>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} records
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-lg text-[11px] font-bold transition ${
                  i === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
