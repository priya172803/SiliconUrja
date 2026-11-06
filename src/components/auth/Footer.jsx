import React from 'react';
import { Phone, Shield, Zap, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full max-w-5xl mx-auto mt-8 pb-10 px-4 text-center">
      {/* Official Utility Emergency Helpline Pill */}
      <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-700">Official Utility Support:</span>
        </div>

        <a
          href="tel:1912"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-rose-600" />
          <span>Emergency BESCOM Helpline: 1912</span>
        </a>

        <span className="hidden sm:inline text-slate-400 text-xs">•</span>
        <span className="text-xs text-slate-500">24x7 Bengaluru Central Grid Dispatch</span>
      </div>

      {/* Branding and Tagline */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs">
            <Zap className="w-3.5 h-3.5 text-cyan-300 fill-cyan-400" />
          </div>
          <span className="text-sm font-extrabold text-slate-900 tracking-tight">
            Silicon<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Urja</span>
          </span>
        </div>

        <p className="text-xs font-medium text-slate-600">
          Hardware-Free Smart Energy Platform for Bengaluru
        </p>

        <p className="text-[11px] text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
          KERC Sandbox Regulated. Authorized data ingress interface for Bangalore Electricity Supply Company Limited (BESCOM) smart metering framework.
        </p>
      </div>
    </footer>
  );
}
