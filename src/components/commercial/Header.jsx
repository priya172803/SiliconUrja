import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  FileDown, 
  Zap, 
  Activity, 
  Clock, 
  ChevronDown, 
  Sparkles,
  ShieldCheck,
  Radio,
  Flame,
  RotateCcw
} from 'lucide-react';
import { FACILITY_INFO, OTHER_FACILITIES } from './energyData';

export function Header({ 
  selectedFacility, 
  onSelectFacility, 
  onOpenEsgReport, 
  isSimulatingSpike, 
  onToggleSpike,
  isLiveUpdating,
  onToggleLiveUpdating,
  lastUpdated
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as Bengaluru IST (Asia/Kolkata)
      const options = { 
        timeZone: 'Asia/Kolkata', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false,
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      };
      setCurrentTime(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-blue-100 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Left Brand & Facility Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 shadow-sm text-blue-600">
              <Zap className="w-6 h-6 text-blue-600 animate-pulse-subtle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                  SiliconUrja
                </h1>
                <span className="text-slate-300 font-light text-xl">|</span>
                <span className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                  Commercial Energy Portal
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE TELEMETRY
                </span>
              </div>

              {/* Facility Location Selector */}
              <div className="relative mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:text-blue-600 transition-colors py-0.5 px-1.5 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-200"
                  >
                    <span>{selectedFacility.name}</span>
                    <ChevronDown className="w-3 h-3 text-blue-600" />
                  </button>
                </div>

                <span className="text-slate-300">•</span>
                <span className="text-slate-600 hidden md:inline">Outer Ring Road, Bellandur, Bengaluru</span>
                <span className="text-slate-300 hidden md:inline">•</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-mono font-semibold border border-blue-200/80">
                  BESCOM HT-2B
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-emerald-700 font-mono text-[11px] font-semibold hidden sm:inline">
                  PF 0.992 lag
                </span>

                {/* Facility Selector Dropdown */}
                {dropdownOpen && (
                  <div className="absolute left-0 top-7 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5 border-b border-slate-100 mb-1">
                      Bengaluru Commercial Tech Parks
                    </div>
                    {OTHER_FACILITIES.map((facility) => (
                      <button
                        key={facility.id}
                        onClick={() => {
                          onSelectFacility(facility);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex flex-col gap-0.5 cursor-pointer ${
                          selectedFacility.id === facility.id 
                            ? 'bg-blue-50 border border-blue-200 text-blue-900 font-medium' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-slate-900 flex items-center justify-between">
                          <span>{facility.name}</span>
                          <span className="text-[10px] text-blue-600 font-mono font-bold">{facility.solar} Solar</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{facility.location}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{facility.kva}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Header Controls & ESG Report Export */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-end lg:self-center">
            
            {/* Live Clock & Substation Health Badge */}
            <div className="hidden sm:flex flex-col items-end px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentTime || '16:00:00 IST'}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>66kV Substation Online (50.02 Hz)</span>
              </div>
            </div>

            {/* Simulated Peak Load Toggle */}
            <button
              onClick={onToggleSpike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                isSimulatingSpike 
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Test Peak Shaving & Demand Response Simulation"
            >
              <Flame className={`w-3.5 h-3.5 ${isSimulatingSpike ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Peak Test:</span>
              <span>{isSimulatingSpike ? 'Surge Active (+180 kVA)' : 'Normal Load'}</span>
            </button>

            {/* Live Stream Ticker Toggle */}
            <button
              onClick={onToggleLiveUpdating}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
                isLiveUpdating 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
              title={isLiveUpdating ? "Pause Live Meter Stream" : "Resume Live Meter Stream"}
            >
              <Activity className={`w-3.5 h-3.5 ${isLiveUpdating ? 'text-blue-600 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '4s' }} />
              <span className="hidden xl:inline font-semibold">{isLiveUpdating ? 'Streaming' : 'Paused'}</span>
            </button>

            {/* PRIMARY USER ACTION: Export ESG Compliance Report (PDF) */}
            <button
              onClick={onOpenEsgReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 active:scale-[0.98] transition-all shadow-md shadow-blue-500/25 border border-blue-500/40 group cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-white transition-transform group-hover:-translate-y-0.5" />
              <span className="tracking-tight whitespace-nowrap">📥 Export ESG Compliance Report (PDF)</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
