import React from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2
} from 'lucide-react';

export default function TariffBreakdownModal({ 
  isOpen, 
  onClose, 
  kpis, 
  profile, 
  rebateApplied = 0 
}) {
  if (!isOpen) return null;

  const units = kpis.unitsConsumedKWh || 288;
  const fixedCharges = 260.0; // 4.0 kW * ₹65/kW
  const slab1Units = Math.min(100, units);
  const slab1Rate = 4.75;
  const slab1Cost = slab1Units * slab1Rate;

  const slab2Units = Math.max(0, units - 100);
  const slab2Rate = 7.00;
  const slab2Cost = slab2Units * slab2Rate;

  const fuelCharges = units * 0.50; // FAC
  const taxDuty = Number(((fixedCharges + slab1Cost + slab2Cost + fuelCharges) * 0.082).toFixed(2));
  const finalBill = Math.max(0, kpis.estimatedMonthlyBill - rebateApplied);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-blue-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>BESCOM LT-2a Tariff Calculation</span>
            </h3>
            <p className="text-xs text-slate-500">
              Karnataka Electricity Regulatory Commission (KERC) Tariff Schedule for Bengaluru
            </p>
          </div>
        </div>

        {/* Consumer Mini Strip */}
        <div className="bg-blue-50/70 rounded-xl p-3 border border-blue-100 text-xs font-mono text-slate-600 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span>RR: <strong className="text-blue-700">{profile.rrNumber}</strong></span>
          <span>Load: <strong className="text-slate-900">{profile.sanctionedLoadKW} kW Single Phase</strong></span>
          <span>Billed: <strong className="text-blue-700">{units} kWh</strong></span>
        </div>

        {/* Detailed Itemized Table */}
        <div className="space-y-2 text-xs">
          
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-800 font-bold">Fixed / Demand Charges</span>
              <span className="block text-[11px] text-slate-500 font-mono">4.0 kW @ ₹65.00/kW sanctioned capacity</span>
            </div>
            <span className="font-mono text-slate-900 font-bold">₹{fixedCharges.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-800 font-bold">Slab 1 Energy Charges (0 - 100 Units)</span>
              <span className="block text-[11px] text-slate-500 font-mono">{slab1Units} units @ ₹{slab1Rate.toFixed(2)}/unit</span>
            </div>
            <span className="font-mono text-slate-900 font-bold">₹{slab1Cost.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-800 font-bold">Slab 2 Energy Charges (&gt; 100 Units)</span>
              <span className="block text-[11px] text-slate-500 font-mono">{slab2Units} units @ ₹{slab2Rate.toFixed(2)}/unit</span>
            </div>
            <span className="font-mono text-slate-900 font-bold">₹{slab2Cost.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-800 font-bold">Fuel Adjustment Charges (FAC)</span>
              <span className="block text-[11px] text-slate-500 font-mono">{units} units @ ₹0.50/unit</span>
            </div>
            <span className="font-mono text-slate-900 font-bold">₹{fuelCharges.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-800 font-bold">Electricity Duty / Taxes (KERC)</span>
              <span className="block text-[11px] text-slate-500 font-mono">State tax & clean energy cess</span>
            </div>
            <span className="font-mono text-slate-900 font-bold">₹{taxDuty.toFixed(2)}</span>
          </div>

          {/* Rebate Row if applied */}
          {rebateApplied > 0 && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold">Namma Green Credits Rebate</span>
                  <span className="block text-[11px] text-emerald-700 font-mono">Deducted from BESCOM account</span>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-800">-₹{rebateApplied.toFixed(2)}</span>
            </div>
          )}

          {/* Total Row */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm font-bold">
            <span className="text-slate-900">Net Estimated Monthly Payable:</span>
            <span className="text-2xl font-black font-mono text-blue-700">
              ₹{finalBill.toLocaleString('en-IN')}
            </span>
          </div>

        </div>

        {/* Close button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}
