import React, { useState } from 'react';
import { Building, Factory, Home, MapPin, Zap, CheckCircle2, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { BENGALURU_ZONES, CONSUMER_SEGMENTS } from '../../data/demoPersonas';

export default function OnboardingModal({ isOpen, onClose, onCompleteOnboarding }) {
  const [segment, setSegment] = useState('Domestic Household');
  const [zone, setZone] = useState('HSR Layout (Sectors 1-7)');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sanctionedLoad, setSanctionedLoad] = useState('3.5');
  const [loadUnit, setLoadUnit] = useState('kW');
  const [bescomId, setBescomId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        onCompleteOnboarding({
          name: fullName || 'Bengaluru Consumer',
          segment,
          zone,
          phone: phone || '9876543210',
          sanctionedLoad: `${sanctionedLoad} ${loadUnit}`,
          bescomId: bescomId || '1029384756',
          roleName: segment.includes('Domestic')
            ? 'Domestic Consumer'
            : segment.includes('Commercial')
            ? 'Facility Manager'
            : 'Plant Operations Head'
        });
      }, 900);
    }, 800);
  };

  const autofillSampleOnboarding = () => {
    setFullName('Ananya Deshmukh');
    setPhone('9844012345');
    setSegment('Commercial Tech Park/Building');
    setZone('Outer Ring Road (Bellandur - Mahadevapura)');
    setSanctionedLoad('120');
    setLoadUnit('kW');
    setBescomId('2048596172');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Zap className="w-5 h-5 text-cyan-300 fill-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">New Consumer Onboarding</h2>
              <p className="text-xs text-blue-100">Setup Bengaluru Hardware-Free Smart Energy Ingress</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Virtual Meter Bridge Activated!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your profile for <span className="font-semibold text-blue-600">{zone}</span> has been provisioned on SiliconUrja without physical hardware sensors. Redirecting to your energy analytics dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
            <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-200/80 text-xs">
              <span className="text-slate-700">Hackathon fast-fill:</span>
              <button
                type="button"
                onClick={autofillSampleOnboarding}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-cyan-600" />
                Fill Sample Commercial Profile
              </button>
            </div>

            {/* Field: Consumer Segment Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Consumer Segment <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={segment}
                  onChange={(e) => {
                    setSegment(e.target.value);
                    if (e.target.value.includes('Industrial')) {
                      setLoadUnit('kVA');
                      setSanctionedLoad('500');
                    } else if (e.target.value.includes('Commercial')) {
                      setLoadUnit('kW');
                      setSanctionedLoad('120');
                    } else {
                      setLoadUnit('kW');
                      setSanctionedLoad('3.5');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none appearance-none"
                  required
                >
                  <option value="Domestic Household">🏡 Domestic Household (Tariff LT-1 / LT-2a)</option>
                  <option value="Commercial Tech Park/Building">🏢 Commercial Tech Park/Building (Tariff LT-3)</option>
                  <option value="Industrial Factory">🏭 Industrial Factory (Tariff HT-1 / HT-2)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Field: Bengaluru Layout / Zone Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Bengaluru Layout / Zone <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none appearance-none"
                  required
                >
                  {BENGALURU_ZONES.map((z) => (
                    <option key={z} value={z}>
                      📍 {z}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Row: Name and Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Consumer / Plant Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Hegde / IT Hub"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (+91)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Row: BESCOM ID and Sanctioned Load */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  BESCOM 10-Digit ID
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={bescomId}
                  onChange={(e) => setBescomId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="1029384756"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sanctioned Load
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="number"
                    step="0.1"
                    value={sanctionedLoad}
                    onChange={(e) => setSanctionedLoad(e.target.value)}
                    placeholder="Load"
                    className="w-full px-3 py-2.5 text-slate-900 text-sm font-mono focus:outline-none"
                    required
                  />
                  <select
                    value={loadUnit}
                    onChange={(e) => setLoadUnit(e.target.value)}
                    className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 border-l border-slate-200 focus:outline-none"
                  >
                    <option value="kW">kW</option>
                    <option value="kVA">kVA</option>
                    <option value="HP">HP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hardware-Free Value Proposition Pill */}
            <div className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-200 text-cyan-900 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Hardware Needed:</strong> SiliconUrja connects directly via Bengaluru BESCOM's AMR/AMI data pipeline and machine learning telemetry models.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Provisioning...' : 'Complete Onboarding & Launch'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
