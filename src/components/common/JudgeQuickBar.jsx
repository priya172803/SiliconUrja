import React, { useState } from 'react';
import { Sparkles, ChevronUp, ChevronDown, CheckCircle2, UserCheck, Shield, Zap } from 'lucide-react';
import { DEMO_PERSONAS } from '../../data/demoPersonas';

export default function JudgeQuickBar({ 
  currentPersonaId, 
  onSelectPersona 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full transition-all">
      <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Toggle Header */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold bg-slate-800/90 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-cyan-300 uppercase tracking-wider font-extrabold text-[11px]">
              Judge Evaluation Controls
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">
              {isOpen ? 'Collapse' : 'Quick Switch Persona'}
            </span>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            )}
          </div>
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-3 space-y-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 leading-snug">
              Instant-switch active persona & mock dataset for live hackathon evaluation:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = currentPersonaId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPersona(p)}
                    className={`flex items-start gap-1.5 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400/80 text-cyan-100 ring-1 ring-cyan-400/40'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-750 hover:text-white'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">
                          {p.badge || p.roleName}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {p.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
