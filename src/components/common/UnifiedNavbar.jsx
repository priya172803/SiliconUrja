import React from 'react';
import { 
  Zap, 
  Home, 
  Building, 
  Factory, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  UserCheck, 
  Globe,
  Calculator
} from 'lucide-react';
import { DEMO_PERSONAS } from '../../data/demoPersonas';

export default function UnifiedNavbar({ 
  currentRole, 
  onSwitchRole, 
  sessionData, 
  onLogout,
  onOpenTariffCalculator
}) {
  const isDemoMode = sessionData?.isDemo !== false && sessionData?.type !== 'supabase_auth';

  // Determine user display name and metadata
  const displayName = sessionData?.user?.email 
    || sessionData?.profile?.full_name 
    || sessionData?.persona?.name 
    || 'Authorized User';

  const displaySubtitle = sessionData?.profile?.account_type 
    ? `${sessionData.profile.account_type.toUpperCase()} • BESCOM ID: ${sessionData.profile.bescom_id || 'Active'}`
    : sessionData?.persona?.roleName 
    ? `${sessionData.persona.roleName} • ${sessionData.persona.sanctionedLoad || sessionData.persona.badgeId || 'BESCOM'}`
    : 'Authenticated Session';

  const roleNavItems = [
    { id: 'domestic', label: 'Domestic', icon: Home, badge: 'LT-2a' },
    { id: 'commercial', label: 'Commercial', icon: Building, badge: 'LT-3 TOD' },
    { id: 'industrial', label: 'Industrial', icon: Factory, badge: 'HT-2a' },
    { id: 'admin', label: 'Govt Admin', icon: ShieldCheck, badge: 'SLDC Grid' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top electric energy strip */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Platform Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-300/40">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                  SiliconUrja
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Unified Grid
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Bengaluru Virtual Smart Meter Bridge
              </div>
            </div>
          </div>

          {/* Quick Role Switcher (Especially powerful for Hackathon Judges) */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-800/80 border border-slate-700/70">
            {roleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSwitchRole(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title={`Switch to ${item.label} Dashboard`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-black/20 text-cyan-100' : 'bg-slate-900/60 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Mode Badge, Tariff Calculator & User Identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Dynamic Tariff Calculator Modal Trigger */}
            <button
              type="button"
              onClick={onOpenTariffCalculator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer shadow-xs"
              title="Open Progressive Slab & Category Tariff Engine"
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Tariff Calculator</span>
            </button>

            {/* Mode Indicator Badge */}
            <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
              isDemoMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}>
              {isDemoMode ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>DEMO MODE (Judges)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LIVE USER MODE</span>
                </>
              )}
            </div>

            {/* Active User Pill */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">
                {displayName}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono truncate max-w-[150px]">
                {displaySubtitle}
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-all cursor-pointer"
              title="Return to Login & Switch Persona"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Session</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar for Dashboard Switch */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/80 gap-1 overflow-x-auto">
          {roleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRole === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSwitchRole(item.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
