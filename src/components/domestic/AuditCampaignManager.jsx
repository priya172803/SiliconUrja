import React, { useState } from 'react';
import { 
  CONSERVATION_CAMPAIGNS, 
  WARD_LEADERBOARD, 
  IMMUTABLE_AUDIT_LOGS 
} from './mockData';
import { 
  Megaphone, 
  Award, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Clock, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  PieChart,
  FileCheck,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AuditCampaignManager({ role }) {
  const [auditSearch, setAuditSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(CONSERVATION_CAMPAIGNS[0]);

  const filteredLogs = IMMUTABLE_AUDIT_LOGS.filter(log =>
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.hash.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Section: Public Conservation Campaigns & Rebates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Campaign Cards List (8 Cols) - White Card */}
        <div className="lg:col-span-8 bg-white border border-blue-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  Active Municipal Public Conservation Drives
                </h3>
                <p className="text-xs text-slate-500">
                  Citizen and industrial demand-side management programs authorized across Bengaluru
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                4 Drives Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONSERVATION_CAMPAIGNS.map((cmp) => (
                <div
                  key={cmp.id}
                  onClick={() => setSelectedCampaign(cmp)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedCampaign.id === cmp.id
                      ? 'bg-blue-50/50 border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'bg-slate-50/60 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                      {cmp.id}
                    </span>
                    <span className="text-xs font-mono text-amber-800 font-bold">
                      Shaved: {cmp.peakDeferredMW} MW
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{cmp.name}</h4>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                    {cmp.impactDesc}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Participants:</span>
                      <span className="text-slate-900 font-bold">{cmp.activeCitizens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Budget Disbursed:</span>
                      <span className="text-emerald-700 font-bold">
                        ₹{cmp.budgetSpentCr} Cr / ₹{cmp.budgetAllocatedCr} Cr
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(cmp.budgetSpentCr / cmp.budgetAllocatedCr) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Aggregated Municipal Peak Deferral: <strong className="text-blue-700 font-bold">114.8 MW</strong></span>
            <span>Total Rebate Budget: <strong className="text-slate-900 font-bold">₹120.0 Cr</strong></span>
          </div>
        </div>

        {/* Municipal Rebate Expenditure Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-blue-100 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600" />
                Municipal Rebate Expenditures
              </h4>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">FY2026-27</span>
            </div>

            {/* Total Budget Progress Meter */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-600 font-medium">Total Program Outlay</span>
                <span className="text-slate-900 font-bold">₹78.4 Cr / ₹120.0 Cr</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full" style={{ width: '65.3%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Disbursed: 65.3%</span>
                <span>Unallocated: ₹41.6 Cr</span>
              </div>
            </div>

            {/* Expenditure Itemization */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">MSME Motor Retrofit Subsidies:</span>
                <span className="text-blue-800 font-bold">₹28.4 Cr</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Cool Roof Reflective Grants:</span>
                <span className="text-blue-800 font-bold">₹18.5 Cr</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Surya Mitra Solar Aggregation:</span>
                <span className="text-blue-800 font-bold">₹19.3 Cr</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">EV Night Smart Tariff Credits:</span>
                <span className="text-blue-800 font-bold">₹12.2 Cr</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs">
            <span className="text-[10px] font-mono text-blue-800 uppercase font-bold block mb-1">
              Public Utility Efficiency ROI
            </span>
            <p className="text-slate-700 leading-snug">
              Every ₹1.0 Cr invested has permanently eliminated <strong className="text-blue-900 font-bold">1.46 MW</strong> of peak thermal peaker requirement.
            </p>
          </div>
        </div>

      </div>

      {/* Middle Section: Citizen Green Credit Payouts & Ward Leaderboard */}
      <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Award className="w-4 h-4 text-amber-600" />
              Citizen Green Credit Payouts & Ward Energy Savings Leaderboard
            </h3>
            <p className="text-xs text-slate-500">
              Community conservation incentives redeemed as municipal property tax rebates and BESCOM bill discounts
            </p>
          </div>
          <div className="text-xs font-mono text-slate-600">
            Total Distributed Credits: <strong className="text-amber-800 font-bold">₹4.82 Crores (184,000 Households)</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-blue-100 text-blue-900 bg-blue-50/70 uppercase font-bold">
                <th className="py-2.5 px-3">Rank & Ward</th>
                <th className="py-2.5 px-3">Enrolled Households</th>
                <th className="py-2.5 px-3">Cumulative Energy Saved</th>
                <th className="py-2.5 px-3">Green Credits Disbursed</th>
                <th className="py-2.5 px-3 text-right">Municipal Distinction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WARD_LEADERBOARD.map((ward) => (
                <tr key={ward.rank} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      ward.rank === 1 ? 'bg-amber-400 text-amber-950 font-bold' : 'bg-slate-200 text-slate-700'
                    }`}>
                      #{ward.rank}
                    </span>
                    <span className="text-slate-900 font-bold">{ward.wardName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {ward.households.toLocaleString()} homes
                  </td>
                  <td className="py-3 px-3 text-blue-700 font-bold">
                    {ward.energySavedMWh.toLocaleString()} MWh
                  </td>
                  <td className="py-3 px-3 text-amber-800 font-bold">
                    {ward.creditsDisbursed}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                      {ward.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Immutable Audit Event Log */}
      <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Cryptographic Immutable Regulatory Audit Log
            </h3>
            <p className="text-xs text-slate-500">
              Tamper-evident state registry logging executive policy shifts, grid overrides, and penalty notices
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono w-56"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-blue-700 font-bold">{log.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-900 font-bold">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {log.status}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  {log.details}
                </div>
                <div className="text-[10px] text-slate-500">
                  Actor: <span className="text-slate-700 font-semibold">{log.actor}</span>
                </div>
              </div>

              <div className="text-right text-[11px] flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-0 border-slate-200 pt-2 md:pt-0">
                <span className="text-slate-500 font-medium">{log.timestamp}</span>
                <span className="text-slate-500 text-[10px] font-mono mt-0.5">
                  SHA-256: <code className="text-blue-700 font-bold">{log.hash}</code>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
