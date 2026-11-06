import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Zap, Building, Factory, Home, ShieldCheck } from 'lucide-react';
import { DEMO_PERSONAS } from '../../data/demoPersonas';

const PERSONA_ICONS = {
  domestic: Home,
  commercial: Building,
  industrial: Factory,
  admin: ShieldCheck,
};

export default function PersonaSwitcher({ activePersona, onSelectPersona, onDirectLaunch }) {
  return (
    <div className="w-full bg-slate-50/95 border-b border-slate-200/90 p-4 sm:p-5 rounded-t-3xl">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Hackathon Evaluation Sandbox</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
          Instant Role Redirection
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3 font-medium">
        Select a hackathon persona pill to instant-autofill credentials & test role redirection:
      </p>

      {/* 4 Distinct Persona Pill Buttons: Domestic, Commercial, Industrial, Admin */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DEMO_PERSONAS.map((persona) => {
          const isSelected = activePersona?.id === persona.id;
          const IconComponent = PERSONA_ICONS[persona.id] || Zap;

          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelectPersona(persona)}
              className={`relative text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-white border-blue-600 text-blue-900 shadow-md ring-2 ring-blue-500/20 translate-y-[-1px]'
                  : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold tracking-tight text-[11.5px] truncate">
                  {persona.badge || persona.roleName}
                </span>
                {isSelected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                ) : (
                  <IconComponent className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                )}
              </div>
              
              <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-normal">
                <span className="truncate max-w-[85px] text-slate-700 font-medium">
                  {persona.name.split(' ')[0]}
                </span>
                <span className="font-mono font-semibold text-blue-700 text-[9.5px] bg-blue-50 px-1 py-0.2 rounded border border-blue-100">
                  {persona.sanctionedLoad || persona.badgeId || 'Grid'}
                </span>
              </div>

              {isSelected && (
                <div className="absolute -bottom-px left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Persona Fast-Track Banner */}
      {activePersona && (
        <div className="mt-3.5 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600">Active Persona:</span>
            <span className="font-bold text-slate-900">{activePersona.name}</span>
            <span className="hidden sm:inline text-slate-400">({activePersona.roleName} • {activePersona.segment || activePersona.jurisdiction})</span>
          </div>

          <button
            type="button"
            onClick={() => onDirectLaunch(activePersona)}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-800 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100/80 px-2.5 py-1 rounded-lg border border-cyan-300 transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
          >
            <span>Instant Launch Dashboard</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
