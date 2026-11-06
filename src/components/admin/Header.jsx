import React, { useState } from 'react';
import { 
  Zap, 
  FileDown, 
  ShieldAlert, 
  UserCheck, 
  Activity, 
  RefreshCw, 
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react';
import LiveClock from './LiveClock';

export default function Header({
  activeTab,
  setActiveTab,
  macroMetrics,
  onLoadPreset,
  onExportPdf,
  userRole,
  setUserRole,
  isSimulating,
  onTriggerSync,
}) {
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerNotice = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      {/* Top official government bar with live real-time date and clock */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 px-4 sm:px-6 lg:px-8 py-1.5 text-xs font-mono text-blue-100 flex flex-wrap items-center justify-between gap-2 border-b border-blue-800">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 font-bold text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>SLDC BENGALURU SCADA NODE 01</span>
          </span>
          <span className="text-blue-400 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-blue-200">
            GRID FREQ: <strong className="text-emerald-400">{macroMetrics.gridFrequencyHz.toFixed(2)} Hz</strong>
          </span>
          <span className="text-blue-400 hidden md:inline">|</span>
          <span className="hidden md:inline text-blue-300">
            TRANSMISSION LOSS: <strong className="text-cyan-300">{macroMetrics.sldcTransmissionLossPct}%</strong>
          </span>
        </div>

        {/* Live Real-Time Date & Clock in Top Bar */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-blue-800/80 px-3 py-0.5 rounded-full border border-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <LiveClock compact={true} />
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-800 text-cyan-300 text-[10px] font-bold border border-blue-600 hidden lg:inline">
            SEC-BLR-ACTIVE
          </span>
        </div>
      </div>

      {/* Main Command Center Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
              <Zap className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    SiliconUrja
                  </span>
                  <span className="text-slate-300 font-light text-base hidden sm:inline">|</span>
                  <span className="text-slate-800 font-bold text-sm sm:text-base hidden sm:inline">
                    State Policy & Grid Command Center
                  </span>
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                  Govt. of Karnataka
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                <span>BESCOM & KPTCL Energy Regulatory Authority</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-blue-700 font-mono font-semibold">Bengaluru Urban Grid Zone</span>
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Quick Demo Data Loader */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition shadow-sm"
                title="Load sample scenarios into the grid command center"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>⚡ Load Demo Grid Data</span>
              </button>

              {showPresetDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-blue-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[11px] font-mono text-slate-500 px-2 py-1 uppercase tracking-wider font-bold border-b border-slate-100">
                    Select Scenario Preset
                  </div>
                  <button
                    onClick={() => {
                      onLoadPreset('standard');
                      setShowPresetDropdown(false);
                      triggerNotice('Loaded Standard Evening Peak Stress scenario');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 text-xs text-slate-800 hover:text-blue-700 transition mt-1"
                  >
                    <div className="font-bold text-amber-600">🌆 Evening Peak Stress (Baseline)</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">188 GW load, +4 GW reserve, tight headroom</div>
                  </button>
                  <button
                    onClick={() => {
                      onLoadPreset('renewableSurge');
                      setShowPresetDropdown(false);
                      triggerNotice('Loaded High Renewable Influx scenario');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 text-xs text-slate-800 hover:text-blue-700 transition"
                  >
                    <div className="font-bold text-emerald-600">☀️ High Renewable Influx (Solar Peak)</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">62% RE share, +28 GW reserve surplus</div>
                  </button>
                  <button
                    onClick={() => {
                      onLoadPreset('emergencyPeak');
                      setShowPresetDropdown(false);
                      triggerNotice('Loaded Critical Overload Deficit scenario');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 text-xs text-slate-800 hover:text-rose-600 transition"
                  >
                    <div className="font-bold text-rose-600">🚨 Critical Overload Event (Tripping)</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Deficit -400 MW, 49.88 Hz frequency dip</div>
                  </button>
                </div>
              )}
            </div>

            {/* Export Policy PDF Report */}
            <button
              type="button"
              onClick={onExportPdf}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
              title="Generate printable executive briefing PDF with digital seal"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>📥 Export Policy PDF Report</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-[11px] font-mono text-slate-500 px-2 hidden sm:inline font-bold">Role:</span>
              <button
                type="button"
                onClick={() => {
                  setUserRole('Govt Admin');
                  triggerNotice('Switched active persona to Government Policy Administrator');
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                  userRole === 'Govt Admin'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-3 h-3 text-blue-600" />
                <span>Govt Admin</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserRole('Utility Officer');
                  triggerNotice('Switched active persona to Utility Grid Dispatch Officer');
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                  userRole === 'Utility Officer'
                    ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3 h-3 text-amber-600" />
                <span>Utility Officer</span>
              </button>
            </div>

            {/* Telemetry Refresh / Ping */}
            <button
              type="button"
              onClick={onTriggerSync}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs transition"
              title="Force SCADA Bus Sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            </button>

          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="mt-2 text-xs font-mono py-1 px-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md flex items-center space-x-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-4 flex overflow-x-auto space-x-1 border-b border-blue-100 pb-px">
          {[
            { id: 'command-center', label: '1. Macro Command Center View', icon: Activity, badge: 'Live SCADA' },
            { id: 'sectoral-compliance', label: '2. Sectoral Compliance & Audit', icon: ShieldAlert, badge: 'Enforcement' },
            { id: 'policy-sandbox', label: '3. Policy "What-If" Sandbox', icon: Sliders, badge: 'Simulation' },
            { id: 'audit-campaigns', label: '4. Audit Log & Campaign Manager', icon: Sparkles, badge: 'Impact' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
