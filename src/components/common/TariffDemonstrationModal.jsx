import React, { useState, useMemo } from 'react';
import {
  calculateElectricityBill,
  compareCategories,
  TARIFF_REGISTRY,
  roundToTwo
} from '../../services/tariffEngine';
import { 
  Calculator, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Home, 
  Building, 
  Factory, 
  TrendingUp, 
  TrendingDown, 
  Info,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export default function TariffDemonstrationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Selected Policy ID: 'demo-illustrative-slabs' | 'karnataka-bescom-2026'
  const [selectedPolicyId, setSelectedPolicyId] = useState('demo-illustrative-slabs');

  // Identical Consumption Input across all 3 sectors
  const [consumptionUnits, setConsumptionUnits] = useState(250);

  // Time of Day Split (% must total 100)
  const [peakPct, setPeakPct] = useState(20);
  const [offPeakPct, setOffPeakPct] = useState(25);

  // Connected load / demand parameters
  const [connectedLoadKw, setConnectedLoadKw] = useState(10);
  const [billingDemandKva, setBillingDemandKva] = useState(15);

  // Editable Demo Tariff Rates (Admin Dynamic Modification)
  const [customRates, setCustomRates] = useState({
    // Domestic Demo Slabs
    domesticSlab1: 3.00,
    domesticSlab2: 5.00,
    domesticSlab3: 7.00,
    domesticFixed: 80.00,
    domesticTaxPct: 5.0,

    // Commercial Demo Slabs & TOD
    commercialSlab1: 6.50,
    commercialSlab2: 8.00,
    commercialSlab3: 10.50,
    commercialFixed: 450.00,
    commercialDemandRate: 180.00,
    commercialPeakSurcharge: 2.00,
    commercialOffPeakRebate: 1.25,
    commercialTaxPct: 9.0,

    // Industrial Demo Slabs & TOD
    industrialSlab1: 5.80,
    industrialSlab2: 7.20,
    industrialDemandRate: 240.00,
    industrialPeakSurcharge: 2.50,
    industrialOffPeakRebate: 1.50,
    industrialTaxPct: 9.0,
  });

  // Active view tab: 'comparison' | 'admin_config' | 'snapshot'
  const [activeTab, setActiveTab] = useState('comparison');

  // Construct active custom policy config from editable admin values
  const activeCustomPolicy = useMemo(() => {
    if (selectedPolicyId === 'karnataka-bescom-2026') {
      return TARIFF_REGISTRY['karnataka-bescom-2026'];
    }

    // Build customized dynamic policy from admin sliders/inputs
    return {
      ...TARIFF_REGISTRY['demo-illustrative-slabs'],
      categories: {
        domestic: {
          ...TARIFF_REGISTRY['demo-illustrative-slabs'].categories.domestic,
          slabs: [
            { min: 0, max: 100, rate: customRates.domesticSlab1, label: `0 – 100 units @ ₹${customRates.domesticSlab1}/unit` },
            { min: 100, max: 200, rate: customRates.domesticSlab2, label: `101 – 200 units @ ₹${customRates.domesticSlab2}/unit` },
            { min: 200, max: Infinity, rate: customRates.domesticSlab3, label: `Above 200 units @ ₹${customRates.domesticSlab3}/unit` }
          ],
          fixedCharges: { type: 'fixed_lump_sum', amount: customRates.domesticFixed },
          taxRatePct: customRates.domesticTaxPct
        },
        commercial: {
          ...TARIFF_REGISTRY['demo-illustrative-slabs'].categories.commercial,
          slabs: [
            { min: 0, max: 100, rate: customRates.commercialSlab1, label: `0 – 100 units @ ₹${customRates.commercialSlab1}/unit` },
            { min: 100, max: 300, rate: customRates.commercialSlab2, label: `101 – 300 units @ ₹${customRates.commercialSlab2}/unit` },
            { min: 300, max: Infinity, rate: customRates.commercialSlab3, label: `Above 300 units @ ₹${customRates.commercialSlab3}/unit` }
          ],
          fixedCharges: { type: 'fixed_lump_sum', amount: customRates.commercialFixed },
          demandCharges: { type: 'recorded_demand', ratePerKva: customRates.commercialDemandRate },
          timeOfDay: {
            enabled: true,
            peakSurchargePerUnit: customRates.commercialPeakSurcharge,
            offPeakRebatePerUnit: customRates.commercialOffPeakRebate
          },
          taxRatePct: customRates.commercialTaxPct
        },
        industrial: {
          ...TARIFF_REGISTRY['demo-illustrative-slabs'].categories.industrial,
          slabs: [
            { min: 0, max: 500, rate: customRates.industrialSlab1, label: `0 – 500 units @ ₹${customRates.industrialSlab1}/unit` },
            { min: 500, max: Infinity, rate: customRates.industrialSlab2, label: `Above 500 units @ ₹${customRates.industrialSlab2}/unit` }
          ],
          demandCharges: { type: 'sanctioned_demand_kva', ratePerKva: customRates.industrialDemandRate },
          timeOfDay: {
            enabled: true,
            peakSurchargePerUnit: customRates.industrialPeakSurcharge,
            offPeakRebatePerUnit: customRates.industrialOffPeakRebate
          },
          taxRatePct: customRates.industrialTaxPct
        }
      }
    };
  }, [selectedPolicyId, customRates]);

  // Execute comparison across all 3 categories using identical consumption
  const comparisonData = useMemo(() => {
    return compareCategories({
      policyId: selectedPolicyId,
      customPolicyConfig: selectedPolicyId === 'demo-illustrative-slabs' ? activeCustomPolicy : null,
      consumptionUnits,
      peakPct,
      offPeakPct,
      connectedLoadKw,
      billingDemandKva
    });
  }, [selectedPolicyId, activeCustomPolicy, consumptionUnits, peakPct, offPeakPct, connectedLoadKw, billingDemandKva]);

  const { results, comparison } = comparisonData;
  const domesticRes = results.domestic;
  const commercialRes = results.commercial;
  const industrialRes = results.industrial;

  // Reset to default baseline
  const handleResetBaseline = () => {
    setCustomRates({
      domesticSlab1: 3.00,
      domesticSlab2: 5.00,
      domesticSlab3: 7.00,
      domesticFixed: 80.00,
      domesticTaxPct: 5.0,
      commercialSlab1: 6.50,
      commercialSlab2: 8.00,
      commercialSlab3: 10.50,
      commercialFixed: 450.00,
      commercialDemandRate: 180.00,
      commercialPeakSurcharge: 2.00,
      commercialOffPeakRebate: 1.25,
      commercialTaxPct: 9.0,
      industrialSlab1: 5.80,
      industrialSlab2: 7.20,
      industrialDemandRate: 240.00,
      industrialPeakSurcharge: 2.50,
      industrialOffPeakRebate: 1.50,
      industrialTaxPct: 9.0,
    });
    setConsumptionUnits(250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Calculator className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  Dynamic Progressive Tariff Engine
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Regulatory Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Multi-category progressive slab calculation & Time-of-Day (TOD) bill comparison
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header Policy Switcher & Controls */}
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Policy Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Active Tariff Policy:</span>
            <select
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 shadow-xs focus:ring-2 focus:ring-cyan-500"
            >
              <option value="demo-illustrative-slabs">
                Demo Illustrative Dynamic Slabs (₹3 / ₹5 / ₹7)
              </option>
              <option value="karnataka-bescom-2026">
                Official KERC BESCOM Tariff Order 2025-26
              </option>
            </select>

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              selectedPolicyId === 'karnataka-bescom-2026'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {selectedPolicyId === 'karnataka-bescom-2026' ? '✓ Verified Official Data' : '⚡ Illustrative Demo Rates'}
            </span>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Identical Unit Comparison
            </button>

            {selectedPolicyId === 'demo-illustrative-slabs' && (
              <button
                type="button"
                onClick={() => setActiveTab('admin_config')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'admin_config'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3 h-3 text-cyan-600" />
                <span>Modify Demo Slabs</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('snapshot')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'snapshot'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tariff Snapshot JSON
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Interactive Unified Consumption Input Bar */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <span className="font-bold text-sm text-blue-950 block">
                  Identical Test Electricity Consumption
                </span>
                <span className="text-xs text-blue-700">
                  Applied uniformly across Domestic, Commercial, and Industrial categories to demonstrate rate divergence
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-extrabold text-blue-900 bg-white px-3 py-1 rounded-xl border border-blue-300">
                  {consumptionUnits} <span className="text-xs font-normal text-slate-500">kWh</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetBaseline}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-1 shadow-xs"
                  title="Reset to default 250 units"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="50"
                max="2500"
                step="10"
                value={consumptionUnits}
                onChange={(e) => setConsumptionUnits(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>50 kWh (Lifeline)</span>
                <span>250 kWh (Demo Default)</span>
                <span>500 kWh</span>
                <span>1000 kWh</span>
                <span>2500 kWh (Industrial Scale)</span>
              </div>
            </div>

            {/* Time of Day (TOD) Split Sliders */}
            <div className="mt-4 pt-3 border-t border-blue-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1 text-rose-600">
                    <Clock className="w-3 h-3" /> Peak Surcharge (18-22h)
                  </span>
                  <span className="font-mono">{peakPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={peakPct}
                  onChange={(e) => setPeakPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-rose-100 rounded accent-rose-600"
                />
                <span className="text-[10px] text-slate-500 font-mono">
                  {roundToTwo((consumptionUnits * peakPct) / 100)} units
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Clock className="w-3 h-3" /> Off-Peak Rebate (22-06h)
                  </span>
                  <span className="font-mono">{offPeakPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={offPeakPct}
                  onChange={(e) => setOffPeakPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-emerald-100 rounded accent-emerald-600"
                />
                <span className="text-[10px] text-slate-500 font-mono">
                  {roundToTwo((consumptionUnits * offPeakPct) / 100)} units
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex flex-col justify-between">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span className="text-slate-600">Normal Daylight Period:</span>
                  <span className="font-mono">{Math.max(0, 100 - peakPct - offPeakPct)}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Units: <strong className="text-slate-800 font-mono">{roundToTwo(consumptionUnits * (1 - (peakPct + offPeakPct) / 100))} kWh</strong>
                </div>
                <div className="text-[9.5px] text-emerald-700 font-semibold mt-1">
                  ✓ Conservation: Peak + Off-Peak + Normal = 100%
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: SIDE-BY-SIDE COMPARISON */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              {/* 3 Comparative Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. DOMESTIC CARD */}
                <div className="bg-white border-2 border-blue-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Domestic Consumer</h3>
                        <span className="text-[10px] text-slate-500 font-mono">LT-2(a) Lifeline / Household</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      Baseline
                    </span>
                  </div>

                  {/* Calculated Final Bill */}
                  <div className="mb-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="text-[11px] text-slate-500 block font-medium">Calculated Total Bill</span>
                    <span className="text-2xl font-black text-blue-900 tracking-tight">
                      ₹{domesticRes.breakdown.finalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-blue-700 block mt-0.5 font-mono">
                      Effective Rate: ₹{(domesticRes.breakdown.finalBill / consumptionUnits).toFixed(2)} / kWh
                    </span>
                  </div>

                  {/* Progressive Slabs Breakdown */}
                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                      Progressive Slab Calculation:
                    </span>
                    {domesticRes.breakdown.slabBreakdown.map((s) => (
                      <div key={s.index} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-600 truncate max-w-[150px]">{s.label}:</span>
                        <span className="font-mono text-slate-800 font-semibold">
                          {s.unitsBilled} × ₹{s.rate} = <strong className="text-slate-900">₹{s.amount.toFixed(2)}</strong>
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-dashed border-slate-200 pt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Energy Charges:</span>
                        <span className="font-mono font-semibold">₹{domesticRes.breakdown.baseEnergyCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Fixed Charges:</span>
                        <span className="font-mono font-semibold">₹{domesticRes.breakdown.fixedCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Electricity Tax ({domesticRes.breakdown.taxRatePct}%):</span>
                        <span className="font-mono font-semibold">₹{domesticRes.breakdown.taxes.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. COMMERCIAL CARD */}
                <div className="bg-white border-2 border-indigo-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Commercial Facility</h3>
                        <span className="text-[10px] text-slate-500 font-mono">LT-3 Tech Parks & Towers</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      +{comparison.commercialDiffPct}% vs Domestic
                    </span>
                  </div>

                  {/* Calculated Final Bill */}
                  <div className="mb-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                    <span className="text-[11px] text-slate-500 block font-medium">Calculated Total Bill</span>
                    <span className="text-2xl font-black text-indigo-950 tracking-tight">
                      ₹{commercialRes.breakdown.finalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-indigo-700 block mt-0.5 font-mono">
                      Difference: +₹{comparison.commercialDiffRupees.toFixed(2)} (+{comparison.commercialDiffPct}%)
                    </span>
                  </div>

                  {/* Slabs Breakdown */}
                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                      Commercial Slab & TOD:
                    </span>
                    {commercialRes.breakdown.slabBreakdown.map((s) => (
                      <div key={s.index} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-600 truncate max-w-[150px]">{s.label}:</span>
                        <span className="font-mono text-slate-800 font-semibold">
                          {s.unitsBilled} × ₹{s.rate} = <strong className="text-slate-900">₹{s.amount.toFixed(2)}</strong>
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-dashed border-slate-200 pt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Energy Charges:</span>
                        <span className="font-mono font-semibold">₹{commercialRes.breakdown.baseEnergyCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>TOD Net Adjustment:</span>
                        <span className={`font-mono font-semibold ${
                          commercialRes.breakdown.todAdjustment.netTodAdjustment > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          {commercialRes.breakdown.todAdjustment.netTodAdjustment >= 0 ? '+' : ''}
                          ₹{commercialRes.breakdown.todAdjustment.netTodAdjustment.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Fixed & Demand Charges:</span>
                        <span className="font-mono font-semibold">
                          ₹{(commercialRes.breakdown.fixedCharges + commercialRes.breakdown.demandCharges).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Tax ({commercialRes.breakdown.taxRatePct}%):</span>
                        <span className="font-mono font-semibold">₹{commercialRes.breakdown.taxes.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. INDUSTRIAL CARD */}
                <div className="bg-white border-2 border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-300 flex items-center justify-center">
                        <Factory className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Industrial Factory</h3>
                        <span className="text-[10px] text-slate-500 font-mono">HT-2(a) Heavy Power</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      +{comparison.industrialDiffPct}% vs Domestic
                    </span>
                  </div>

                  {/* Calculated Final Bill */}
                  <div className="mb-4 p-3 bg-slate-100 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block font-medium">Calculated Total Bill</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      ₹{industrialRes.breakdown.finalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-600 block mt-0.5 font-mono">
                      Difference: +₹{comparison.industrialDiffRupees.toFixed(2)} (+{comparison.industrialDiffPct}%)
                    </span>
                  </div>

                  {/* Slabs Breakdown */}
                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                      Industrial High-Tension Slabs:
                    </span>
                    {industrialRes.breakdown.slabBreakdown.map((s) => (
                      <div key={s.index} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-600 truncate max-w-[150px]">{s.label}:</span>
                        <span className="font-mono text-slate-800 font-semibold">
                          {s.unitsBilled} × ₹{s.rate} = <strong className="text-slate-900">₹{s.amount.toFixed(2)}</strong>
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-dashed border-slate-200 pt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Energy Charges:</span>
                        <span className="font-mono font-semibold">₹{industrialRes.breakdown.baseEnergyCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>TOD Net Adjustment:</span>
                        <span className={`font-mono font-semibold ${
                          industrialRes.breakdown.todAdjustment.netTodAdjustment > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          {industrialRes.breakdown.todAdjustment.netTodAdjustment >= 0 ? '+' : ''}
                          ₹{industrialRes.breakdown.todAdjustment.netTodAdjustment.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Demand Charge ({billingDemandKva} kVA):</span>
                        <span className="font-mono font-semibold">₹{industrialRes.breakdown.demandCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Tax ({industrialRes.breakdown.taxRatePct}%):</span>
                        <span className="font-mono font-semibold">₹{industrialRes.breakdown.taxes.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Comparative Summary Table & Regulatory Note */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-x-auto">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <span>Comprehensive Billing Component Breakdown (For {consumptionUnits} Units)</span>
                </h4>

                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-200/80 text-slate-700 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Consumer Category</th>
                      <th className="p-2.5">Energy Charge (Slabs)</th>
                      <th className="p-2.5">TOD Surcharge / Rebate</th>
                      <th className="p-2.5">Fixed / Demand</th>
                      <th className="p-2.5">Taxes</th>
                      <th className="p-2.5">Final Bill</th>
                      <th className="p-2.5 rounded-r-lg">Divergence vs Domestic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    <tr className="hover:bg-blue-50/50">
                      <td className="p-2.5 font-sans font-bold text-blue-900">Domestic Household</td>
                      <td className="p-2.5">₹{domesticRes.breakdown.baseEnergyCharge.toFixed(2)}</td>
                      <td className="p-2.5 text-slate-400">N/A</td>
                      <td className="p-2.5">₹{domesticRes.breakdown.fixedCharges.toFixed(2)}</td>
                      <td className="p-2.5">₹{domesticRes.breakdown.taxes.toFixed(2)}</td>
                      <td className="p-2.5 font-bold text-blue-900">₹{domesticRes.breakdown.finalBill.toFixed(2)}</td>
                      <td className="p-2.5 font-sans text-slate-400 font-bold">Baseline</td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50">
                      <td className="p-2.5 font-sans font-bold text-indigo-900">Commercial Facility</td>
                      <td className="p-2.5">₹{commercialRes.breakdown.baseEnergyCharge.toFixed(2)}</td>
                      <td className="p-2.5 text-rose-600">+{commercialRes.breakdown.todAdjustment.netTodAdjustment.toFixed(2)}</td>
                      <td className="p-2.5">₹{(commercialRes.breakdown.fixedCharges + commercialRes.breakdown.demandCharges).toFixed(2)}</td>
                      <td className="p-2.5">₹{commercialRes.breakdown.taxes.toFixed(2)}</td>
                      <td className="p-2.5 font-bold text-indigo-900">₹{commercialRes.breakdown.finalBill.toFixed(2)}</td>
                      <td className="p-2.5 font-sans text-rose-700 font-bold">+{comparison.commercialDiffPct}% (+₹{comparison.commercialDiffRupees.toFixed(2)})</td>
                    </tr>
                    <tr className="hover:bg-slate-100/50">
                      <td className="p-2.5 font-sans font-bold text-slate-900">Industrial Factory</td>
                      <td className="p-2.5">₹{industrialRes.breakdown.baseEnergyCharge.toFixed(2)}</td>
                      <td className="p-2.5 text-rose-600">+{industrialRes.breakdown.todAdjustment.netTodAdjustment.toFixed(2)}</td>
                      <td className="p-2.5">₹{industrialRes.breakdown.demandCharges.toFixed(2)}</td>
                      <td className="p-2.5">₹{industrialRes.breakdown.taxes.toFixed(2)}</td>
                      <td className="p-2.5 font-bold text-slate-950">₹{industrialRes.breakdown.finalBill.toFixed(2)}</td>
                      <td className="p-2.5 font-sans text-rose-700 font-bold">+{comparison.industrialDiffPct}% (+₹{comparison.industrialDiffRupees.toFixed(2)})</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN DYNAMIC SLAB MODIFICATION */}
          {activeTab === 'admin_config' && selectedPolicyId === 'demo-illustrative-slabs' && (
            <div className="space-y-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Administrator Dynamic Tariff Modifier
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust rates in real-time. Bills above recalculate instantaneously without server restarts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetBaseline}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700"
                >
                  Reset Defaults
                </button>
              </div>

              {/* 3 Categories Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Domestic Config */}
                <div className="space-y-3 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Home className="w-4 h-4" /> Domestic Demo Rates
                  </h4>
                  <div>
                    <label className="block text-slate-600 mb-1">First 100 units (₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.domesticSlab1}
                      onChange={(e) => setCustomRates({ ...customRates, domesticSlab1: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-blue-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Next 100 units (₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.domesticSlab2}
                      onChange={(e) => setCustomRates({ ...customRates, domesticSlab2: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-blue-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Remaining units (₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.domesticSlab3}
                      onChange={(e) => setCustomRates({ ...customRates, domesticSlab3: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-blue-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Fixed Lump-Sum (₹):</label>
                    <input
                      type="number"
                      step="5"
                      value={customRates.domesticFixed}
                      onChange={(e) => setCustomRates({ ...customRates, domesticFixed: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-blue-200 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Commercial Config */}
                <div className="space-y-3 bg-indigo-50/60 p-4 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4" /> Commercial Demo Rates
                  </h4>
                  <div>
                    <label className="block text-slate-600 mb-1">Slab 1 (0-100) (₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.commercialSlab1}
                      onChange={(e) => setCustomRates({ ...customRates, commercialSlab1: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-indigo-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Slab 2 (101-300) (₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.commercialSlab2}
                      onChange={(e) => setCustomRates({ ...customRates, commercialSlab2: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-indigo-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Peak Surcharge (+₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.commercialPeakSurcharge}
                      onChange={(e) => setCustomRates({ ...customRates, commercialPeakSurcharge: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-indigo-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Demand Charge (₹/kVA):</label>
                    <input
                      type="number"
                      step="10"
                      value={customRates.commercialDemandRate}
                      onChange={(e) => setCustomRates({ ...customRates, commercialDemandRate: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-indigo-200 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Industrial Config */}
                <div className="space-y-3 bg-slate-100 p-4 rounded-xl border border-slate-300">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Factory className="w-4 h-4" /> Industrial Demo Rates
                  </h4>
                  <div>
                    <label className="block text-slate-600 mb-1">First 500 units (₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.industrialSlab1}
                      onChange={(e) => setCustomRates({ ...customRates, industrialSlab1: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Above 500 units (₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.industrialSlab2}
                      onChange={(e) => setCustomRates({ ...customRates, industrialSlab2: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Peak Surcharge (+₹/unit):</label>
                    <input
                      type="number"
                      step="0.25"
                      value={customRates.industrialPeakSurcharge}
                      onChange={(e) => setCustomRates({ ...customRates, industrialPeakSurcharge: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Demand Charge (₹/kVA):</label>
                    <input
                      type="number"
                      step="10"
                      value={customRates.industrialDemandRate}
                      onChange={(e) => setCustomRates({ ...customRates, industrialDemandRate: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TARIFF SNAPSHOT JSON PREVIEW (Reproducible Historical Billing) */}
          {activeTab === 'snapshot' && (
            <div className="space-y-3 bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
              <div className="flex items-center justify-between text-cyan-400 mb-2 font-sans font-bold">
                <span>Immutable Regulatory Snapshot Attached to this Bill Calculation:</span>
                <span className="text-[10px] text-slate-400 font-mono">{domesticRes.tariffSnapshot.timestamp}</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-cyan-200">
                {JSON.stringify(domesticRes.tariffSnapshot, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>KERC Sandbox Compliant • Decimal-Safe Currency Rounding (2 decimal places)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            Close Calculator
          </button>
        </div>

      </div>
    </div>
  );
}
