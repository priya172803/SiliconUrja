import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  FileDown, 
  Sparkles, 
  UserCheck, 
  Radio, 
  Activity, 
  Clock, 
  Leaf, 
  AlertTriangle,
  Building2,
  Cpu
} from 'lucide-react';

export default function Header({ 
  metrics, 
  role, 
  onToggleRole, 
  onOpenDemoModal, 
  onOpenReportModal,
  onToggleView,
  currentView
}) {
  const getReserveColor = (margin) => {
    if (margin < 2.0) return 'text-rose-700 border-rose-300 bg-rose-50';
    if (margin < 5.0) return 'text-amber-800 border-amber-300 bg-amber-50';
    return 'text-emerald-700 border-emerald-300 bg-emerald-50';
  };

  const getStatusBadge = () => {
    if (metrics.statusLevel === 'critical') {
      return {
        bg: 'bg-rose-50 border-rose-300 text-rose-800',
        dot: 'bg-rose-600 animate-ping',
        text: 'GRID STRESS: CRITICAL'
      };
    }
    if (metrics.statusLevel === 'warning') {
      return {
        bg: 'bg-amber-50 border-amber-300 text-amber-800',
        dot: 'bg-amber-500 animate-pulse',
        text: 'GRID STRESS: TIGHT BUFFER'
      };
    }
    return {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      dot: 'bg-emerald-600',
      text: 'GRID STRESS: NOMINAL'
    };
  };

  const status = getStatusBadge();

  return (
    <header className="border-b border-blue-200/80 bg-white sticky top-0 z-40 shadow-sm backdrop-blur-md">
      {/* Topmost Official Bar - Authoritative Deep Blue */}
      <div className="bg-blue-900 border-b border-blue-950 px-4 py-1.5 flex items-center justify-between text-xs text-blue-100 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-blue-200 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            GOVERNMENT OF KARNATAKA | ENERGY DEPARTMENT
          </span>
          <span className="hidden sm:inline text-blue-400">•</span>
          <span className="hidden md:inline text-blue-200">
            KPTCL - SLDC STATE LOAD DESPATCH CENTRE (ANAND RAO CIRCLE, BENGALURU)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>FREQ: <strong className="text-cyan-300">{metrics.gridFrequencyHz.toFixed(2)} Hz</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span>{metrics.lastSyncTime || 'LIVE SYNC'}</span>
          </div>
        </div>
      </div>

      {/* Main Command Center Header - Clean White & Blue */}
      <div className="max-w-[1720px] mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center shadow-md p-2 relative text-white">
              <Zap className="w-6 h-6 fill-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full animate-ping"></span>
            </div>
            
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-mono flex items-center gap-2">
                  <span className="text-blue-600">Silicon</span>Urja
                  <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-blue-50 border border-blue-200 text-blue-700">
                    v2.4 SLDC-PRO
                  </span>
                </h1>
                
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-semibold ${status.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                  {status.text}
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                State Energy Policy & Municipal Grid Command Center • Bengaluru Metropolitan Region
              </p>
            </div>
          </div>

          {/* Global Quick Actions & Role Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Domestic Portal Toggle */}
            {onToggleView && (
              <button
                onClick={onToggleView}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Switch to Domestic Portal for residential consumers"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Domestic Portal (Alex • HSR)</span>
              </button>
            )}

            {/* Demo Grid Data Button */}
            <button
              onClick={onOpenDemoModal}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 transition-all shadow-sm"
              title="Switch demo scenarios like Summer Peak or Wind Surplus"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>⚡ Load Demo Grid Data</span>
            </button>

            {/* Export Policy PDF Report */}
            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5 transition-all shadow-sm"
              title="Download or Print Official Gazette Policy Brief"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600" />
              <span>📥 Export Policy PDF Report</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => onToggleRole('govt_admin')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  role === 'govt_admin'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Govt Admin
              </button>
              
              <button
                onClick={() => onToggleRole('utility_officer')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  role === 'utility_officer'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Utility Officer
              </button>
            </div>
          </div>
        </div>

        {/* Top Banner with Macro Grid Metrics - White Cards with Blue Accents */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mt-4 pt-3 border-t border-slate-200">
          
          {/* Total Grid Capacity */}
          <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
              <span>Total Grid Capacity</span>
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 mt-1">
              {metrics.totalCapacityGW.toFixed(1)} <span className="text-xs font-normal text-slate-500">GW</span>
            </div>
            <div className="text-[10px] text-blue-600 font-mono mt-0.5 font-medium">
              Available Basers & Peakers
            </div>
          </div>

          {/* Real-Time Peak Demand */}
          <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
              <span>Real-Time Peak Demand</span>
              <Activity className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-black font-mono text-amber-700 mt-1">
              {metrics.peakDemandGW.toFixed(1)} <span className="text-xs font-normal text-slate-500">GW</span>
            </div>
            <div className="text-[10px] text-amber-600 font-mono mt-0.5 font-medium">
              Current All-Karnataka Draw
            </div>
          </div>

          {/* Reserve Margin */}
          <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
              <span>Reserve Margin</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 mt-1 flex items-baseline gap-1.5">
              <span className={`px-2 py-0.5 rounded text-base border font-mono font-bold ${getReserveColor(metrics.reserveMarginGW)}`}>
                +{metrics.reserveMarginGW.toFixed(1)} GW
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Buffer Headroom: {((metrics.reserveMarginGW / metrics.totalCapacityGW) * 100).toFixed(1)}%
            </div>
          </div>

          {/* Renewable Share */}
          <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
              <span>Renewable Share</span>
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-700 mt-1">
              {metrics.renewableSharePct.toFixed(1)}%
            </div>
            <div className="text-[10px] text-emerald-600 font-mono mt-0.5 flex items-center gap-1 font-medium">
              <span>Solar: 28%</span> • <span>Wind: 14%</span> • <span>Hydro: 4%</span>
            </div>
          </div>

          {/* Bengaluru Load (City Draw) */}
          <div className="hidden xl:block bg-white border border-blue-100 rounded-xl p-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
              <span>Bengaluru Metro Load</span>
              <Zap className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-black font-mono text-blue-700 mt-1">
              {metrics.bengaluruLoadMW.toLocaleString()} <span className="text-xs font-normal text-slate-500">MW</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              34.2% of Total State Load
            </div>
          </div>

          {/* Marginal Grid Carbon Intensity */}
          <div className="hidden xl:block bg-white border border-blue-100 rounded-xl p-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
              <span>Carbon Intensity</span>
              <Activity className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-black font-mono text-slate-800 mt-1">
              {metrics.carbonIntensity} <span className="text-xs font-normal text-slate-500">gCO₂/kWh</span>
            </div>
            <div className="text-[10px] text-blue-600 font-mono mt-0.5 font-medium">
              Tariff: ₹{metrics.realTimeMarginalPrice.toFixed(2)}/kWh
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
