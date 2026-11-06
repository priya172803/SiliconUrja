import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Building2, 
  Zap, 
  FileText,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { FACILITY_INFO, KPI_METRICS, TENANT_ALLOCATION } from './energyData';

export function EsgReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-xs">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto modal-print-container">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                ESG Compliance & Decarbonization Report Preview
              </h3>
              <p className="text-xs text-slate-500">
                SEBI BRSR Core • GRI 302 Standards • LEED v4.1 Platinum Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto text-slate-800">
          
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black tracking-tight text-blue-900">SiliconUrja</span>
                <span className="text-slate-300 text-xl font-light">|</span>
                <span className="text-sm font-bold tracking-wider uppercase text-blue-600">ESG Assurance Portal</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Commercial Facility Energy & Carbon Compliance Statement
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Asset: <strong className="text-slate-900">{FACILITY_INFO.name}</strong> • Outer Ring Road, Bellandur, Bengaluru
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-slate-600 space-y-0.5">
              <div>Audit Cycle: <span className="text-slate-900 font-bold">FY 2026 Q3 YTD</span></div>
              <div>Report Date: <span className="text-blue-700 font-bold">05 Nov 2026</span></div>
              <div>Report ID: <span className="text-slate-700">SU-BLR-ECO-2026-8871</span></div>
              <div className="text-emerald-700 font-bold">Status: SEBI BRSR Audit Ready</div>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Green Building</span>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>LEED Platinum (92 Pts)</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">BEE Star Rating</span>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>5-Star Commercial Hub</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Energy Performance</span>
              <div className="text-sm font-bold text-blue-700 font-mono mt-1">
                112 kWh / m² / yr
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Net Zero Target</span>
              <div className="text-sm font-bold text-emerald-700 font-mono mt-1">
                88% Milestone Progress
              </div>
            </div>
          </div>

          {/* Section 1: Greenhouse Gas Accounting (GHG Protocol Scope 1 & 2) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>1. GHG Protocol Carbon Accounting (Scope 1 & Scope 2)</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead className="bg-slate-50 text-slate-600 text-left border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Emission Scope</th>
                    <th className="py-2.5 px-3">Source Description</th>
                    <th className="py-2.5 px-3 text-right">Energy Consumption</th>
                    <th className="py-2.5 px-3 text-right">CO₂e Factor</th>
                    <th className="py-2.5 px-3 text-right">Total (Tonnes CO₂e)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-amber-700">Scope 1 Direct</td>
                    <td className="py-2.5 px-3 text-slate-700 font-sans">Emergency Standby Diesel Gensets (BESCOM Outage Buffer)</td>
                    <td className="py-2.5 px-3 text-right">6,840 Liters HSD</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">2.68 kg/L</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">18.20</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">Scope 2 Indirect (Grid)</td>
                    <td className="py-2.5 px-3 text-slate-700 font-sans">BESCOM 66kV Grid Import (Southern Regional Grid CEA factor)</td>
                    <td className="py-2.5 px-3 text-right">342,000 kWh</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">0.71 kg/kWh</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">242.40</td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="py-2.5 px-3 font-semibold text-emerald-700">Renewable Offset</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-sans">850 kWp Rooftop Solar PV Generation (Zero Carbon)</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-bold">176,200 kWh</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">-0.71 kg/kWh</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">-125.10</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan="4" className="py-2.5 px-3 text-slate-800 font-sans">
                      Net Facility Carbon Emissions (YTD)
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-mono text-sm">
                      135.50 tCO₂e
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Rooftop Solar & Renewable Energy Performance */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>2. Onsite Solar & Open Access Clean Energy Wheeling</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Rooftop Solar Array Capacity</span>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">850 kWp Monocrystalline</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">34% instantaneous load share</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Karnataka Open Access Wheeling</span>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">Pavagada Solar PPA</div>
                <div className="text-[11px] text-blue-700 font-medium mt-0.5">42% wheeled clean electricity</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Total Clean Energy Contribution</span>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">76.0% Total Green Power</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Audit verified via REMC portal</div>
              </div>
            </div>
          </div>

          {/* Section 3: Executive Sign-off and Certification */}
          <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Cryptographically signed & verified under ISO 50001:2018 Energy Management Standards.</span>
            </div>
            <div className="font-mono text-right text-[11px]">
              <div>Principal Energy Auditor: <span className="text-slate-900 font-bold">Dr. A. Rao, CEM / CEA</span></div>
              <div className="text-slate-400">Bureau of Energy Efficiency Reg #BEE-EA-4412</div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 no-print">
          <div className="text-xs text-slate-500">
            Export compliant with SEBI BRSR Core Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
