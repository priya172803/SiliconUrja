import React, { useState } from 'react';
import { CONSERVATION_CAMPAIGNS, GREEN_CREDIT_LEDGER, MUNICIPAL_REBATE_ACCOUNTS, SCADA_DISPATCH_LOGS } from './mockGridData';
import {
  Megaphone,
  Coins,
  Building2,
  Scroll,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Leaf,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Users,
  IndianRupee,
  FileText,
  Activity,
} from 'lucide-react';

const StatusPill = ({ status }) => {
  const configs = {
    'ACTIVE': { cls: 'bg-emerald-50 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500' },
    'SCALING': { cls: 'bg-blue-50 text-blue-700 border-blue-300', dot: 'bg-blue-500' },
    'COMPLETED': { cls: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400' },
    'PAUSED': { cls: 'bg-amber-50 text-amber-700 border-amber-300', dot: 'bg-amber-500' },
  };
  const cfg = configs[status] || configs['ACTIVE'];
  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold font-mono ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      <span>{status}</span>
    </span>
  );
};

const ProgressBar = ({ pct, color }) => (
  <div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-1">
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
    />
  </div>
);

export default function AuditCampaignsView() {
  const [expandedCampaign, setExpandedCampaign] = useState(null);
  const [logCount, setLogCount] = useState(5);

  const totalCO2Saved = CONSERVATION_CAMPAIGNS.reduce((a, c) => a + c.co2SavedMT, 0);
  const totalBudgetNum = 420.5 + 890.0 + 310.2 + 185.0;
  const totalAchievedMW = CONSERVATION_CAMPAIGNS.reduce((a, c) => a + c.achievedReductionMW, 0);
  const totalTargetMW = CONSERVATION_CAMPAIGNS.reduce((a, c) => a + c.targetReductionMW, 0);

  return (
    <div className="space-y-6">

      {/* Top KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total CO2 Saved (Quarter)', val: `${(totalCO2Saved / 1000).toFixed(1)}k MT`, sub: 'All conservation drives', color: '#16a34a', icon: Leaf },
          { label: 'Demand Reduction Achieved', val: `${totalAchievedMW} MW`, sub: `of ${totalTargetMW} MW target`, color: '#2563eb', icon: Zap },
          { label: 'Campaign Budget Disbursed', val: `₹${totalBudgetNum.toFixed(1)} L`, sub: 'FY 2026-27 Q3 rebate pool', color: '#d97706', icon: IndianRupee },
          { label: 'Citizen Green Credits Today', val: `1,23,000`, sub: '≈ ₹6.15 Lakhs awarded', color: '#7c3aed', icon: Coins },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold leading-tight">{s.label}</span>
                <Icon className="w-4 h-4 shrink-0" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1">{s.val}</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Public Conservation Drives */}
      <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center space-x-2 bg-slate-50/70">
          <Megaphone className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wide">
            Public Conservation Drives & Demand-Response Campaigns
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {CONSERVATION_CAMPAIGNS.map((camp) => (
            <div key={camp.id} className="p-4 hover:bg-slate-50/60 transition">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-sm font-bold text-slate-900">{camp.name}</span>
                    <StatusPill status={camp.status} />
                    <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 bg-slate-100 rounded border border-slate-200 font-bold">
                      {camp.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500 mt-1">
                    <span className="flex items-center space-x-1"><Building2 className="w-3 h-3" /><span>{camp.zoneScope}</span></span>
                    <span>·</span>
                    <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>Since {camp.startDate}</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono text-slate-500">CO2 Saved</div>
                  <div className="text-base font-black font-mono text-emerald-700">{camp.co2SavedMT.toLocaleString()} MT</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600 font-medium">Load Shaving Progress</span>
                  <span className="font-bold text-blue-700">{camp.achievedReductionMW} / {camp.targetReductionMW} MW ({camp.progressPct}%)</span>
                </div>
                <ProgressBar pct={camp.progressPct} color={camp.progressPct >= 80 ? '#16a34a' : camp.progressPct >= 60 ? '#2563eb' : '#d97706'} />
              </div>

              {/* Expandable Details */}
              <button
                onClick={() => setExpandedCampaign(expandedCampaign === camp.id ? null : camp.id)}
                className="mt-3 flex items-center space-x-1 text-[11px] font-mono text-blue-600 hover:text-blue-800 font-bold transition"
              >
                {expandedCampaign === camp.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                <span>{expandedCampaign === camp.id ? 'Collapse' : 'View Campaign Structure'}</span>
              </button>
              {expandedCampaign === camp.id && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Participants</div>
                    <div className="text-slate-800 font-bold flex items-start space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{camp.activeParticipants}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Incentive Model</div>
                    <div className="text-slate-800 font-bold flex items-start space-x-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>{camp.incentiveModel}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Budget Spent</div>
                    <div className="text-blue-700 font-black text-base">{camp.budgetSpentLakhs}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Green Credits & Municipal Rebate Funds Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Citizen Green Credit Ledger */}
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center space-x-2 bg-slate-50/70">
            <Coins className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wide">
              Citizen Green Credit Payout Ledger
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {GREEN_CREDIT_LEDGER.map((tx) => (
              <div key={tx.txId} className="p-3.5 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{tx.recipient}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center space-x-2">
                      <span className="text-blue-700 font-bold">{tx.txId}</span>
                      <span>·</span>
                      <span>{tx.time}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black font-mono text-amber-700">{tx.creditsAwarded.toLocaleString()} pts</div>
                    <div className="text-[10px] font-mono text-slate-500 font-bold">{tx.inrEquivalent}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-1.5 text-[11px] font-mono text-slate-600 mt-1">
                  <ArrowRight className="w-3 h-3 mt-0.5 text-emerald-600 shrink-0" />
                  <span>{tx.reason}</span>
                </div>
                <div className="mt-1.5">
                  <span className="inline-block text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {tx.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Municipal Energy Rebate Accounts */}
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center space-x-2 bg-slate-50/70">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wide">
              Municipal Energy Rebate Fund Expenditures
            </h3>
          </div>
          <div className="divide-y divide-slate-100 p-4 space-y-4">
            {MUNICIPAL_REBATE_ACCOUNTS.map((acc, idx) => {
              const utilPct = (acc.disbursedCr / acc.allocatedCr) * 100;
              const isNear = utilPct > 80;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{acc.accountName}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{acc.beneficiaries} · {acc.fy}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-black font-mono text-blue-800">₹{acc.disbursedCr} Cr</div>
                      <div className="text-[10px] font-mono text-slate-500">of ₹{acc.allocatedCr} Cr</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-slate-500">Utilization Rate</span>
                      <span className={`font-bold ${isNear ? 'text-amber-700' : 'text-emerald-700'}`}>{utilPct.toFixed(1)}%</span>
                    </div>
                    <ProgressBar pct={utilPct} color={isNear ? '#d97706' : '#16a34a'} />
                    <div className={`mt-1 text-[10px] font-mono font-medium ${isNear ? 'text-amber-700' : 'text-slate-500'}`}>
                      {acc.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SCADA Dispatch Log */}
      <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Scroll className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wide">
              SCADA Dispatch & Regulatory Action Audit Log
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-600 px-2.5 py-0.5 bg-slate-100 rounded-full border border-slate-200 font-bold">
            Immutable Audit Trail
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {SCADA_DISPATCH_LOGS.slice(0, logCount).map((log) => (
            <div key={log.id} className="p-4 flex items-start space-x-4 hover:bg-slate-50/60 transition">
              <div className="shrink-0 mt-0.5">
                {log.severity === 'ALERT'   && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                {log.severity === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                {log.severity === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {log.severity === 'INFO'    && <Activity className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                  <span className="text-xs font-black text-slate-900 font-mono">{log.action}</span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{log.id}</span>
                  <span className="text-[10px] font-mono text-blue-700 font-bold">{log.timestamp}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 leading-relaxed">{log.detail}</div>
                <div className="mt-1 text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>Dispatched by: {log.actor}</span>
                </div>
              </div>
              <div className={`shrink-0 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                log.severity === 'ALERT'   ? 'bg-rose-50 text-rose-700 border-rose-200' :
                log.severity === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                log.severity === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                             'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {log.severity}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
