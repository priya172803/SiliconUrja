import React from 'react';
import { 
  FileDown, 
  Printer, 
  X, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Zap,
  Calendar,
  Layers
} from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, metrics, zones }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-blue-200 rounded-2xl max-w-3xl w-full shadow-2xl relative my-8 animate-in fade-in duration-200 text-slate-800">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2">
            <FileDown className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">
              Official State Energy Policy Executive Report
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Document Body */}
        <div className="p-8 space-y-6 bg-white text-xs font-sans">
          
          {/* Document Header */}
          <div className="border-b-2 border-blue-900 pb-5 text-center space-y-1">
            <div className="text-[11px] font-mono tracking-widest uppercase text-blue-900 font-bold">
              GOVERNMENT OF KARNATAKA • ENERGY DEPARTMENT
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
              STATE GRID RELIABILITY & CARBON ABATEMENT AUDIT BRIEFING
            </h1>
            <p className="text-xs text-blue-700 font-mono font-semibold">
              SiliconUrja Platform • Ref: GO-KA-EN-2026-SLDC-1105 • Bengaluru Metropolitan Region
            </p>
            <div className="flex justify-center items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
              <span>Date: 05 November 2026</span>
              <span>•</span>
              <span>Session: Q4 Operational Review</span>
              <span>•</span>
              <span>Classification: OFFICIAL USE ONLY</span>
            </div>
          </div>

          {/* Section 1: Executive Macro Telemetry Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-200 pb-1 mb-2 font-mono flex items-center gap-1.5">
              1. Macro Grid Telemetry & Operational Reserves
            </h2>
            <div className="grid grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Total Grid Capacity</span>
                <span className="text-sm font-bold text-slate-900">{metrics.totalCapacityGW} GW</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Peak Demand Recorded</span>
                <span className="text-sm font-bold text-amber-800">{metrics.peakDemandGW} GW</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Reserve Margin</span>
                <span className="text-sm font-bold text-emerald-700">+{metrics.reserveMarginGW} GW</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Clean Energy Share</span>
                <span className="text-sm font-bold text-blue-700">{metrics.renewableSharePct}%</span>
              </div>
            </div>
          </div>

          {/* Section 2: Regional Substation Congestion Status */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-200 pb-1 mb-2 font-mono">
              2. Bengaluru 4-Zone Substation Congestion Status
            </h2>
            <table className="w-full text-left font-mono text-[11px] border border-slate-200">
              <thead className="bg-blue-50/80 text-blue-900 font-bold">
                <tr>
                  <th className="p-2 border-b border-slate-200">Zone</th>
                  <th className="p-2 border-b border-slate-200">Peak Draw (MW)</th>
                  <th className="p-2 border-b border-slate-200">MVA Utilization</th>
                  <th className="p-2 border-b border-slate-200">Thermal Temp</th>
                  <th className="p-2 border-b border-slate-200">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {zones.map((z) => (
                  <tr key={z.id}>
                    <td className="p-2 font-bold text-slate-900">{z.name} ({z.alias.split('-')[0]})</td>
                    <td className="p-2">{z.peakDemandMW} MW</td>
                    <td className="p-2 font-semibold">{z.utilizationPct}%</td>
                    <td className="p-2">{z.substationTempC}°C</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        z.congestionStatus === 'critical' ? 'text-rose-700 bg-rose-50 border border-rose-300' :
                        z.congestionStatus === 'warning' ? 'text-amber-800 bg-amber-50 border border-amber-300' :
                        'text-emerald-700 bg-emerald-50 border border-emerald-300'
                      }`}>
                        {z.congestionStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Executive Strategic Recommendations */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-200 pb-1 mb-2 font-mono">
              3. Regulatory Directives & Action Plan
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 leading-relaxed font-sans">
              <li>
                <strong>Hoodi-Whitefield Thermal Buffer:</strong> Issue immediate notice to 8 hyperscale data centers in East Zone to activate on-site BESS or curtail auxiliary non-critical chillers during 18:00–21:30 peak window.
              </li>
              <li>
                <strong>Dynamic Carbon Tariff:</strong> Enforce the revised ₹1,800/ton carbon tax multiplier for MSME metallurgical foundries in Peenya exceeding their gazetted monthly limits.
              </li>
              <li>
                <strong>Surya Mitra Rooftop Aggregation:</strong> Scale virtual power plant feeder compensation in South Zone to maintain reactive power balance as EV fast-charger adoption grows by 28% YoY.
              </li>
            </ul>
          </div>

          {/* Signature & Authentication Block */}
          <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-[11px] font-mono">
            <div className="space-y-4">
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-500">
                [Digitally Signed: 2026-11-05 14:30:15 IST]
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Dr. S. K. Murthy, Ph.D.</strong>
                <span className="text-slate-600 block">Director of System Operations & SLDC</span>
                <span className="text-slate-500">KPTCL Anand Rao Circle, Bengaluru</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end pb-1 text-slate-500">
                [Executive Countersign: KA-ENERGY-SEC]
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Rajesh Kumar IAS</strong>
                <span className="text-slate-600 block">Principal Secretary (Energy)</span>
                <span className="text-slate-500">Government of Karnataka, Vidhana Soudha</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-2.5 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>

      </div>
    </div>
  );
}
