import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import MacroMetricsBanner from './MacroMetricsBanner';
import CommandCenterView from './CommandCenterView';
import SectoralComplianceView from './SectoralComplianceView';
import PolicySandboxView from './PolicySandboxView';
import AuditCampaignsView from './AuditCampaignsView';
import { INITIAL_MACRO_METRICS, DEMO_PRESETS, REGISTERED_FACILITIES, REGIONAL_ZONES } from './mockGridData';
import { exportPolicyPdfReport } from './exportPdf';

const DEFAULT_POLICY_PARAMS = { carbonTax: 1200, reSubsidy: 20, peakPenalty: 1.5 };

function computeSimResult({ carbonTax, reSubsidy, peakPenalty }) {
  const BASELINE = { carbonTax: 1200, reSubsidy: 20, peakPenalty: 1.5 };
  const stabilityBase = 82;
  const stabilityGainFromRE = (reSubsidy - BASELINE.reSubsidy) * 0.18;
  const stabilityLossFromPenalty = (peakPenalty - BASELINE.peakPenalty) > 0
    ? (peakPenalty - BASELINE.peakPenalty) * -0.9
    : (BASELINE.peakPenalty - peakPenalty) * 0.5;
  const stabilityGainFromTax = (carbonTax - BASELINE.carbonTax) * 0.0015;
  const stabilityIndex = Math.min(99, Math.max(50, stabilityBase + stabilityGainFromRE + stabilityLossFromPenalty + stabilityGainFromTax));
  const emissionBase = 8.0;
  const emissionFromTax = (carbonTax / BASELINE.carbonTax - 1) * 6.5;
  const emissionFromRE = (reSubsidy / BASELINE.reSubsidy - 1) * 4.8;
  const emissionFromPenalty = (peakPenalty - BASELINE.peakPenalty) * 1.8;
  const emissionReductionPct = Math.min(45, Math.max(0, emissionBase + emissionFromTax + emissionFromRE + emissionFromPenalty));
  const revenueFromTax = (carbonTax / 1000) * 420;
  const revenueCostFromSubsidy = reSubsidy * 28;
  const revenueFromPenalty = (peakPenalty - 1) * 185;
  const revenueShiftCr = Math.max(0, Math.round(revenueFromTax - revenueCostFromSubsidy + revenueFromPenalty));
  const peakShavedMW = Math.round((peakPenalty - 1) * 320 + (reSubsidy / 100) * 480 + (carbonTax / 1000) * 150);
  return {
    stabilityIndex: stabilityIndex.toFixed(1),
    emissionReductionPct: emissionReductionPct.toFixed(1),
    revenueShiftCr: revenueShiftCr.toLocaleString(),
    peakShavedMW,
  };
}

export default function AdminPortal({ sessionData }) {
  const [activeTab, setActiveTab] = useState('command-center');
  const [macroMetrics, setMacroMetrics] = useState(INITIAL_MACRO_METRICS);
  const [userRole, setUserRole] = useState('Govt Admin');
  const [policyParams, setPolicyParams] = useState(DEFAULT_POLICY_PARAMS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [alertBanner, setAlertBanner] = useState(null);

  // Load Demo Preset
  const handleLoadPreset = useCallback((presetKey) => {
    const preset = DEMO_PRESETS[presetKey];
    if (!preset) return;
    setMacroMetrics((prev) => ({
      ...prev,
      totalCapacityGW: preset.totalCapacityGW,
      peakDemandGW: preset.peakDemandGW,
      reserveMarginGW: preset.reserveMarginGW,
      reserveMarginPct: parseFloat(((preset.reserveMarginGW / preset.totalCapacityGW) * 100).toFixed(1)),
      renewableSharePct: preset.renewableSharePct,
      gridFrequencyHz: preset.gridFrequencyHz,
    }));

    if (preset.alertLevel === 'CRITICAL') {
      setAlertBanner({
        level: 'CRITICAL',
        msg: `🚨 CRITICAL DEFICIT EVENT: ${preset.name} — ${preset.description}`,
      });
    } else if (preset.alertLevel === 'WARNING') {
      setAlertBanner({
        level: 'WARNING',
        msg: `⚠️ HIGH DEMAND SCENARIO: ${preset.name} — ${preset.description}`,
      });
    } else {
      setAlertBanner({
        level: 'NORMAL',
        msg: `✅ OPTIMAL SCENARIO: ${preset.name} — ${preset.description}`,
      });
    }
    setTimeout(() => setAlertBanner(null), 7000);
  }, []);

  // Export PDF
  const handleExportPdf = useCallback(() => {
    const simResult = computeSimResult(policyParams);
    exportPolicyPdfReport({
      macroMetrics,
      zones: REGIONAL_ZONES,
      facilities: REGISTERED_FACILITIES,
      policyParams,
      simulatedResults: simResult,
      userRole,
    });
  }, [macroMetrics, policyParams, userRole]);

  // SCADA sync telemetry flicker
  const handleTriggerSync = useCallback(() => {
    setIsSyncing(true);
    setMacroMetrics((prev) => ({
      ...prev,
      gridFrequencyHz: parseFloat((50.0 + (Math.random() * 0.08 - 0.04)).toFixed(2)),
      lastTelemetrySync: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST (Synced)',
    }));
    setTimeout(() => setIsSyncing(false), 1200);
  }, []);

  // Auto-refresh telemetry every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setMacroMetrics((prev) => ({
        ...prev,
        gridFrequencyHz: parseFloat((50.0 + (Math.random() * 0.06 - 0.03)).toFixed(2)),
        lastTelemetrySync: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST (Live SCADA)',
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Alert Banner */}
      {alertBanner && (
        <div className={`fixed top-0 left-0 right-0 z-50 text-center py-2.5 text-sm font-mono font-bold tracking-wide shadow-md animate-in fade-in slide-in-from-top-2 duration-300 ${
          alertBanner.level === 'CRITICAL'
            ? 'bg-rose-600 text-white'
            : alertBanner.level === 'WARNING'
            ? 'bg-amber-500 text-slate-900'
            : 'bg-emerald-600 text-white'
        }`}>
          {alertBanner.msg}
          <button
            onClick={() => setAlertBanner(null)}
            className="ml-4 opacity-80 hover:opacity-100 text-xs underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        macroMetrics={macroMetrics}
        onLoadPreset={handleLoadPreset}
        onExportPdf={handleExportPdf}
        userRole={userRole}
        setUserRole={setUserRole}
        isSimulating={isSyncing}
        onTriggerSync={handleTriggerSync}
      />

      {/* Macro Metrics Banner */}
      <MacroMetricsBanner macroMetrics={macroMetrics} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Role Context Notification Bar */}
        <div className={`mb-5 flex items-center justify-between p-3.5 rounded-2xl border text-xs font-mono shadow-sm ${
          userRole === 'Govt Admin'
            ? 'bg-blue-50/80 border-blue-200 text-blue-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${userRole === 'Govt Admin' ? 'bg-blue-600' : 'bg-amber-600'}`} />
            <span>
              Active Regulatory Persona: <strong>{userRole}</strong>
              {userRole === 'Govt Admin'
                ? ' — Karnataka State Energy Policy Directorate (Full Tariff, Quota & Statutory Enforcement)'
                : ' — SLDC Utility Dispatch Officer (Grid Telemetry, Peaker Dispatch & Feeder Balancing)'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
            SiliconUrja Grid Code 2026 Ratified
          </span>
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'command-center'      && <CommandCenterView macroMetrics={macroMetrics} />}
          {activeTab === 'sectoral-compliance' && <SectoralComplianceView />}
          {activeTab === 'policy-sandbox'      && <PolicySandboxView policyParams={policyParams} setPolicyParams={setPolicyParams} />}
          {activeTab === 'audit-campaigns'     && <AuditCampaignsView />}
        </div>
      </main>

      {/* Government Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 px-6 text-center text-xs font-mono text-slate-500 space-y-1 shadow-sm">
        <div className="font-semibold text-slate-700">
          <span className="text-blue-700 font-black">SiliconUrja</span>
          {' '}State Energy Policy Command Center · Government of Karnataka / Energy Department
        </div>
        <div className="text-[11px] text-slate-400">
          Operated in coordination with BESCOM, KPTCL State Load Despatch Centre & Karnataka Renewable Energy Development Ltd (KREDL)
        </div>
        <div className="flex items-center justify-center space-x-4 pt-1 text-[11px]">
          <span>Build: v2.1.0-blue</span>
          <span>·</span>
          <span>SLDC Bengaluru SCADA Live Feed</span>
          <span>·</span>
          <span className="font-bold text-emerald-600">
            ● Grid Synchronized (50.02 Hz)
          </span>
        </div>
      </footer>
    </div>
  );
}
