import React, { useState } from 'react';
import { 
  Building, 
  Receipt, 
  Download, 
  ArrowUpRight, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  Cpu, 
  Car, 
  Coffee, 
  Database,
  Coins,
  ShieldCheck,
  FileSpreadsheet,
  Activity,
  Zap,
  TrendingUp,
  LayoutGrid,
  TableProperties
} from 'lucide-react';
import { TENANT_ALLOCATION } from './energyData';

export function TenantAllocationCard({ onExportLedger }) {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedInvoice, setCopiedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filteredTenants = TENANT_ALLOCATION.filter(t => 
    t.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tower.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalHourlyKWh = TENANT_ALLOCATION.reduce((acc, t) => acc + t.cumulativeHourlyKWh, 0);
  const totalSubBillINR = TENANT_ALLOCATION.reduce((acc, t) => acc + t.currentHourlyCostINR, 0);

  const handleGenerateInvoice = (tenant) => {
    setCopiedInvoice(tenant.id);
    setTimeout(() => setCopiedInvoice(null), 2500);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 lg:p-6 shadow-xs mb-6">
      
      {/* ======================================================== */}
      {/* Header & Controls */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Tenant Power Allocation & Sub-Billing
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Class 0.2S Revenue Grade
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time power draw split across office towers & commercial zones • Bengaluru BESCOM ToD Sub-Metered
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-700 font-bold shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tower Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white text-blue-700 font-bold shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Audit Ledger</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Filter tower or tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 w-40 sm:w-52 font-sans"
            />
          </div>

          {/* CSV Export Button */}
          <button
            onClick={onExportLedger}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-blue-50 border border-slate-200 transition-all hover:text-blue-700 cursor-pointer shadow-2xs"
            title="Download CSV Sub-Billing Ledger"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Aggregate Sub-Billing Telemetry Bar */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/90 mb-5">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Total Hourly Draw
          </span>
          <div className="text-lg font-bold font-mono text-blue-700 mt-0.5">
            {totalHourlyKWh.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-normal">kWh</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Total Sub-Bill Run-Rate
          </span>
          <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
            ₹{totalSubBillINR.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-normal">/ hr</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Average Power Factor
          </span>
          <div className="text-lg font-bold font-mono text-teal-700 mt-0.5">
            0.993 <span className="text-xs text-emerald-700 font-semibold font-sans">Lag (+0.5% Rebate)</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Revenue Meter Standard
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-sans">Class 0.2S (Revenue Grade)</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Visual Tower Split Stacked Progress Bar */}
      {/* ======================================================== */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1.5">
          <span>Campus Power Allocation by Tower</span>
          <span className="font-semibold text-slate-700">100% Sub-Metered (1,850 kWh Total)</span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 p-0.5 flex gap-1 shadow-inner">
          {TENANT_ALLOCATION.map((tenant) => (
            <div 
              key={tenant.id}
              className={`h-full rounded-md bg-gradient-to-r ${tenant.color} transition-all duration-300 cursor-pointer hover:opacity-90`}
              style={{ width: `${tenant.percentShare}%` }}
              title={`${tenant.tower}: ${tenant.cumulativeHourlyKWh} kWh (${tenant.percentShare}%)`}
              onClick={() => setSelectedTenant(tenant)}
            />
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: EXECUTIVE TOWER CARDS GRID */}
      {/* ======================================================== */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-2">
          {filteredTenants.map((tenant) => {
            const isSelected = selectedTenant?.id === tenant.id;
            const quotaPercent = ((tenant.activeDrawKW / tenant.contractedQuotaKW) * 100).toFixed(0);

            return (
              <div
                key={tenant.id}
                onClick={() => setSelectedTenant(tenant)}
                className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-blue-50/60 border-blue-500 shadow-sm ring-1 ring-blue-300' 
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                {/* Card Top: Tower Badge & Primary Use */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700">
                      {tenant.tower.split(' ')[0]} {tenant.tower.split(' ')[1]}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      {tenant.percentShare}% share
                    </span>
                  </div>

                  {/* Primary Energy Consumption Figure: e.g. Tower A: 450 kWh */}
                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                        {tenant.cumulativeHourlyKWh}
                      </span>
                      <span className="text-xs font-bold font-mono text-blue-700">kWh</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium mt-0.5 line-clamp-1">
                      {tenant.tenantName}
                    </div>
                  </div>

                  {/* Real-time active kW draw & quota */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Real-Time Draw:</span>
                      <span className="font-bold text-blue-700">{tenant.activeDrawKW} kW</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Sub-Bill / hr:</span>
                      <span className="font-bold text-emerald-700">₹{tenant.currentHourlyCostINR.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Power Factor:</span>
                      <span className="text-teal-700 font-semibold">{tenant.powerFactor}</span>
                    </div>
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Quota: {tenant.contractedQuotaKW} kW max</span>
                      <span className={quotaPercent > 85 ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'}>{quotaPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${quotaPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, quotaPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action: Quick Invoice */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-sans">{tenant.badge}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateInvoice(tenant);
                    }}
                    className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedInvoice === tenant.id ? '✓ Invoiced' : 'Invoice'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: CLASS 0.2S REVENUE GRADE TABLE */}
      {/* ======================================================== */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Office Tower & Commercial Zone</th>
                <th className="py-3 px-4">Tenant Organisation</th>
                <th className="py-3 px-4 text-right">Real-Time Draw</th>
                <th className="py-3 px-4 text-right">Hourly Consumption</th>
                <th className="py-3 px-4 text-right">Quota Utilization</th>
                <th className="py-3 px-4 text-right">Power Factor</th>
                <th className="py-3 px-4 text-right">Sub-Bill Rate</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-mono">
              {filteredTenants.map((tenant) => {
                const quotaPercent = ((tenant.activeDrawKW / tenant.contractedQuotaKW) * 100).toFixed(0);
                const isSelected = selectedTenant?.id === tenant.id;

                return (
                  <tr 
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Tower Name & Badge */}
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${tenant.color}`} />
                        <span>{tenant.tower}</span>
                      </div>
                    </td>

                    {/* Tenant Name */}
                    <td className="py-3.5 px-4 font-sans text-slate-700">
                      <div>
                        <div className="font-semibold text-slate-900">{tenant.tenantName}</div>
                        <div className="text-[10px] text-slate-400">{tenant.primaryUse}</div>
                      </div>
                    </td>

                    {/* Real-time Draw */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-blue-700">{tenant.activeDrawKW} kW</span>
                    </td>

                    {/* Cumulative Hourly kWh */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-black text-slate-900 text-sm">{tenant.cumulativeHourlyKWh} kWh</div>
                      <div className="text-[10px] text-slate-500 font-sans">{tenant.percentShare}% share</div>
                    </td>

                    {/* Quota Utilization */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`text-xs font-bold ${
                          quotaPercent > 85 ? 'text-amber-600' : 'text-emerald-700'
                        }`}>
                          {quotaPercent}%
                        </span>
                        <span className="text-[10px] text-slate-400">({tenant.contractedQuotaKW} kW max)</span>
                      </div>
                      <div className="w-20 ml-auto h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${quotaPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, quotaPercent)}%` }}
                        />
                      </div>
                    </td>

                    {/* Power Factor */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
                        {tenant.powerFactor}
                      </span>
                    </td>

                    {/* Sub-Bill Hourly Run Rate */}
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      ₹{tenant.currentHourlyCostINR.toLocaleString()}
                      <div className="text-[10px] text-slate-400 font-normal">ToD Applied</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleGenerateInvoice(tenant)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-sans font-bold bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 border border-slate-200 transition-colors cursor-pointer"
                        title="Issue automated sub-meter invoice"
                      >
                        {copiedInvoice === tenant.id ? '✓ Invoiced' : 'Invoice'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* Selected Tenant Detailed Modbus Telemetry Drawer */}
      {/* ======================================================== */}
      {selectedTenant && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-r ${selectedTenant.color} text-white font-bold shadow-xs`}>
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{selectedTenant.tenantName}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                  {selectedTenant.badge}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  ONLINE Class 0.2S
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-mono">
                {selectedTenant.tower} • Modbus Meter ID: #MB-BLR-{(selectedTenant.id).toUpperCase()} • Primary Use: {selectedTenant.primaryUse}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 font-sans">PUE:</span>
              <span className="ml-1 font-bold text-emerald-700">{selectedTenant.pueIndex}</span>
            </div>
            <div>
              <span className="text-slate-500 font-sans">Hourly Draw:</span>
              <span className="ml-1 font-bold text-blue-700">{selectedTenant.cumulativeHourlyKWh} kWh</span>
            </div>
            <div>
              <span className="text-slate-500 font-sans">Current Cost:</span>
              <span className="ml-1 font-bold text-emerald-700">₹{selectedTenant.currentHourlyCostINR.toLocaleString()}/hr</span>
            </div>
            <button
              onClick={() => setSelectedTenant(null)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline font-sans ml-2 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
