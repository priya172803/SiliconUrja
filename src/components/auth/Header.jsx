import React from 'react';
import { Zap, Activity, ShieldCheck, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full pt-6 pb-4 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Top Telemetry & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-3.5 mb-6 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/80 shadow-xs text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-medium text-slate-700">BESCOM Southern Grid Live</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-blue-600 font-semibold">50.02 Hz</span>
          <span className="hidden sm:inline text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px] font-medium">Grid Stable</span>
        </div>

        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            SiliconUrja Grid
          </span>
          <span className="text-slate-300 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            BESCOM Sandbox Approved
          </span>
        </div>
      </div>

      {/* Main Brand Centered Header */}
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase shadow-xs">
          <Zap className="w-3.5 h-3.5 text-cyan-500 fill-cyan-400 animate-pulse" />
          <span>Next-Gen Smart Energy Ingress</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          {/* High Voltage Pulse Icon */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 flex items-center justify-center shadow-md border border-cyan-400/40">
              <Zap className="w-7 h-7 text-cyan-300 fill-cyan-400" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Silicon<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Urja</span>
          </h1>
        </div>

        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
          Hardware-Free Smart Energy Platform for Bengaluru
        </p>
      </div>
    </header>
  );
}
