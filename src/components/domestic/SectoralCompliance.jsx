import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  FileWarning, 
  ShieldCheck, 
  Building2, 
  Factory, 
  Home, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  FileText,
  AlertCircle,
  X,
  CheckCircle2,
  ZapOff
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SectoralCompliance({ 
  facilities, 
  sectoralData, 
  onIssueNotice, 
  onCapFacilityPower,
  role 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('variancePct');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFacilityModal, setActiveFacilityModal] = useState(null);
  const [noticeSentToast, setNoticeSentToast] = useState(null);

  const itemsPerPage = 6;

  // Sectoral Bar Chart configuration - Crisp White & Blue
  const barChartData = {
    labels: sectoralData.categories,
    datasets: [
      {
        label: 'Industrial Power Draw (MW)',
        data: sectoralData.industrial,
        backgroundColor: '#2563eb', // Royal Blue
        borderRadius: 4,
      },
      {
        label: 'Commercial & Tech Parks (MW)',
        data: sectoralData.commercial,
        backgroundColor: '#d97706', // Amber
        borderRadius: 4,
      },
      {
        label: 'Residential (MW)',
        data: sectoralData.residential,
        backgroundColor: '#059669', // Emerald
        borderRadius: 4,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#334155',
          font: { family: 'JetBrains Mono', size: 11, weight: 'bold' },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        titleColor: '#1e40af',
        bodyColor: '#1e293b',
        padding: 12,
        bodyFont: { family: 'JetBrains Mono' },
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} MW`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(203, 213, 225, 0.5)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(203, 213, 225, 0.5)' },
        ticks: { 
          color: '#64748b', 
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (value) => `${value} MW`
        }
      }
    }
  };

  // Filtered & Sorted Facilities
  const filteredFacilities = useMemo(() => {
    return facilities
      .filter((fac) => {
        const matchesSearch = 
          fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fac.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fac.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesZone = selectedZoneFilter === 'All' || fac.zone === selectedZoneFilter;
        const matchesStatus = selectedStatusFilter === 'All' || fac.status === selectedStatusFilter;
        return matchesSearch && matchesZone && matchesStatus;
      })
      .sort((a, b) => {
        const factor = sortAsc ? 1 : -1;
        return (a[sortField] - b[sortField]) * factor;
      });
  }, [facilities, searchTerm, selectedZoneFilter, selectedStatusFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage) || 1;
  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleTriggerNotice = (fac) => {
    onIssueNotice(fac.id);
    setNoticeSentToast(`Formal Show-Cause Notice KA-ENV-${fac.id} issued to ${fac.name}.`);
    setActiveFacilityModal(null);
    setTimeout(() => setNoticeSentToast(null), 5000);
  };

  const handleTriggerCap = (fac) => {
    onCapFacilityPower(fac.id);
    setNoticeSentToast(`Grid cap order enforced: ${fac.name} power draw curtailed by 20%.`);
    setActiveFacilityModal(null);
    setTimeout(() => setNoticeSentToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {noticeSentToast && (
        <div className="bg-blue-50 border border-blue-400 text-blue-900 px-4 py-3 rounded-xl shadow-md flex items-center justify-between font-mono text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{noticeSentToast}</span>
          </div>
          <button onClick={() => setNoticeSentToast(null)} className="text-slate-500 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Section: Sectoral Draw Breakdown Bar Chart & Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Bar Chart (8 Cols) - White Card */}
        <div className="lg:col-span-8 bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Factory className="w-4 h-4 text-blue-600" />
                Sectoral Power Draw: Industrial vs Commercial vs Residential
              </h3>
              <p className="text-xs text-slate-500">
                Bengaluru Metropolitan Municipal distribution across daily operational cycles
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-500">
              Total Monitored Demand: <strong className="text-blue-900 font-bold">6,840 MW</strong>
            </div>
          </div>

          <div className="w-full h-[280px]">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Sector Summary Metrics (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-blue-100 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                Regulatory ESG Compliance Overview
              </h4>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded font-bold border border-blue-200">
                Q4 FY26
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Factory className="w-3.5 h-3.5 text-blue-600" />
                    Industrial Sector Compliance
                  </span>
                  <span className="text-amber-800 font-bold font-mono">68.4%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '68.4%' }}></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  12 of 38 heavy industrial units flagged for peak overdraw
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    Commercial Tech Parks
                  </span>
                  <span className="text-emerald-700 font-bold font-mono">89.2%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '89.2%' }}></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Whitefield and Outer Ring Road server hubs compliant
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    Residential & Micro-Solar
                  </span>
                  <span className="text-blue-700 font-bold font-mono">94.7%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '94.7%' }}></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  High solar rooftop adoption offsetting daytime draws
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
            Carbon Cap Regulation: <span className="text-blue-900 font-semibold">Karnataka Clean Energy Act 2024</span>
          </div>
        </div>

      </div>

      {/* Bottom Section: Searchable & Filterable Data Table of Registered Facilities */}
      <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
        
        {/* Table Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
              <FileWarning className="w-4 h-4 text-amber-600" />
              Registered High-Draw Industrial Facilities & Carbon Audit Register
            </h3>
            <p className="text-xs text-slate-500">
              Direct telemetry auditing monthly carbon ceilings against actual stack & grid emissions
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search facility, ID..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono w-48 sm:w-60"
              />
            </div>

            {/* Zone Filter */}
            <select
              value={selectedZoneFilter}
              onChange={(e) => { setSelectedZoneFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="All">All Zones</option>
              <option value="North Zone">North Zone (Peenya)</option>
              <option value="South Zone">South Zone (E-City)</option>
              <option value="East Zone">East Zone (Whitefield)</option>
              <option value="West Zone">West Zone (Bidadi)</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => { setSelectedStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="All">All Statuses</option>
              <option value="Compliant">Compliant</option>
              <option value="Flagged">Flagged for Exceedance</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-blue-100 text-blue-900 bg-blue-50/70 uppercase font-bold">
                <th className="py-3 px-3">Facility Name & ID</th>
                <th className="py-3 px-3">Zone</th>
                <th 
                  onClick={() => handleSort('monthlyCarbonLimit')}
                  className="py-3 px-3 cursor-pointer hover:text-blue-700"
                >
                  <div className="flex items-center gap-1">
                    Monthly Carbon Limit (tCO₂)
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('actualEmissions')}
                  className="py-3 px-3 cursor-pointer hover:text-blue-700"
                >
                  <div className="flex items-center gap-1">
                    Actual Emissions (tCO₂)
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('variancePct')}
                  className="py-3 px-3 cursor-pointer hover:text-blue-700"
                >
                  <div className="flex items-center gap-1">
                    Variance / Status
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Regulatory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedFacilities.length > 0 ? (
                paginatedFacilities.map((fac) => (
                  <tr key={fac.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-sans font-bold text-slate-900">{fac.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{fac.id}</span>
                        <span>•</span>
                        <span className="text-blue-600 font-semibold">{fac.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700 font-medium">{fac.zone}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {fac.monthlyCarbonLimit.toLocaleString()} <span className="text-slate-400 text-[10px]">tCO₂</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${fac.actualEmissions > fac.monthlyCarbonLimit ? 'text-rose-600' : 'text-slate-900'}`}>
                        {fac.actualEmissions.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-[10px]"> tCO₂</span>
                    </td>
                    <td className="py-3 px-3">
                      {fac.status === 'Flagged' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-rose-50 text-rose-700 border border-rose-300 font-bold">
                          <FileWarning className="w-3 h-3" />
                          Flagged (+{fac.variancePct}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          Compliant ({fac.variancePct}%)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveFacilityModal(fac)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-sans font-semibold transition-all ${
                          fac.status === 'Flagged'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {fac.status === 'Flagged' ? '⚠️ Issue Notice' : 'View Audit'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-sans">
                    No registered facilities match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 mt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredFacilities.length)}
            </strong>{' '}
            of <strong className="text-slate-800">{filteredFacilities.length}</strong> facilities
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Facility Action Modal - Clean White Card */}
      {activeFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-blue-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setActiveFacilityModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                <FileWarning className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 font-sans">
                  {activeFacilityModal.name}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  {activeFacilityModal.id} • {activeFacilityModal.zone}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Carbon Limit:</span>
                <span className="text-slate-800 font-bold">{activeFacilityModal.monthlyCarbonLimit} tCO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Actual Recorded Emissions:</span>
                <span className="text-rose-600 font-bold">{activeFacilityModal.actualEmissions} tCO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Variance:</span>
                <span className="text-rose-600 font-bold">+{activeFacilityModal.variancePct}% Exceedance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Connected Grid Power Draw:</span>
                <span className="text-blue-700 font-bold">{activeFacilityModal.powerDrawMW} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registered Environmental Officer:</span>
                <span className="text-slate-700 font-semibold">{activeFacilityModal.contactOfficer}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed font-sans">
              Under Section 14 of the Karnataka Energy Conservation Rules, this facility has exceeded its carbon threshold. Select an administrative enforcement action:
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => handleTriggerNotice(activeFacilityModal)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                Issue Formal Show-Cause Notice
              </button>

              <button
                onClick={() => handleTriggerCap(activeFacilityModal)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-1.5 transition-all"
              >
                <ZapOff className="w-3.5 h-3.5 text-amber-600" />
                Enforce Peak Power Curtailment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
