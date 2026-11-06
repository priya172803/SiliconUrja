import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Award, 
  Leaf, 
  MapPin, 
  User, 
  ShieldCheck, 
  Sparkles,
  Info,
  ChevronRight,
  Clock,
  Calendar
} from 'lucide-react';

export default function DomesticHeader({ 
  profile, 
  greenCredits, 
  onOpenCreditsModal 
}) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update real-time clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format real date and time for Bengaluru (IST)
  const formattedDate = currentDateTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedFullDate = currentDateTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      {/* Topmost Official Bar - Bengaluru BESCOM Substation Feed + Real-Time Clock */}
      <div className="bg-blue-950 border-b border-blue-900 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono text-blue-200 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-cyan-300 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>ಸಿಲಿಕಾನ್ ಊರ್ಜಾ • SILICONURJA</span>
          </span>
          <span className="text-blue-700 hidden sm:inline">|</span>
          <span className="text-blue-100 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            BESCOM Substation: <span className="text-white font-medium">{profile.substation}</span>
          </span>
          <span className="text-blue-700 hidden md:inline">|</span>
          <span className="text-blue-200 hidden md:inline">
            RR No: <span className="text-cyan-300 font-mono font-medium">{profile.rrNumber}</span>
          </span>
          <span className="text-blue-700 hidden lg:inline">|</span>
          <span className="text-blue-200 hidden lg:inline">
            Load: <span className="text-white font-medium">{profile.sanctionedLoadKW} kW</span> ({profile.tariffCategory})
          </span>
        </div>

        {/* Live Real-Time & Date Top Widget */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-cyan-200 bg-blue-900/90 px-2.5 py-0.5 rounded border border-blue-700 font-mono text-[11px]">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-white font-bold bg-blue-900/90 px-2.5 py-0.5 rounded border border-blue-700 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{formattedTime} IST</span>
          </div>

          <span className="bg-blue-900/90 text-cyan-200 border border-blue-700 px-2 py-0.5 rounded text-[11px] font-sans hidden sm:flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            KERC Verified
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Left: Brand & Consumer Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
                <Leaf className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-blue-700">SiliconUrja</span>
                  <span className="text-slate-300 font-light">|</span>
                  <span className="text-blue-600 font-semibold text-base sm:text-lg">Domestic Portal</span>
                </h1>
                <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full tracking-wider hidden sm:inline-block">
                  Bengaluru
                </span>
              </div>

              {/* Consumer Info */}
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-[10px] text-blue-700 font-bold">
                    A
                  </div>
                  <span>{profile.name}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600 inline" />
                  {profile.locality}
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-blue-700 text-[11px] font-medium hidden sm:inline bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {profile.rankInNeighborhood}
                </span>
              </div>
            </div>
          </div>

          {/* Center-Right: Real-Time Calendar & Clock Card */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-blue-100 rounded-xl px-3.5 py-2 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  <span>{formattedFullDate}</span>
                </div>
                <div className="text-sm font-bold font-mono text-slate-900 flex items-center gap-1.5">
                  <span>{formattedTime}</span>
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-mono font-semibold">IST</span>
                </div>
              </div>
            </div>

            {/* Right: Namma Green Credits Balance Widget */}
            <button
              onClick={onOpenCreditsModal}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/70 hover:from-blue-100/80 hover:to-indigo-50/90 border border-blue-200 hover:border-blue-400 rounded-xl px-4 py-2.5 transition-all shadow-sm hover:shadow-md text-left cursor-pointer"
              title="Click to view Namma Green Credits rewards & history"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                  <Leaf className="w-3 h-3 text-emerald-600 inline" />
                  <span>Namma Green Credits</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                    {greenCredits.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-blue-600">pts</span>
                </div>
              </div>

              <div className="ml-1 pl-2 border-l border-blue-200 flex items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
