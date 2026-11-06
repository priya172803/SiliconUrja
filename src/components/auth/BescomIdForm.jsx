import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  Zap, 
  KeyRound, 
  Phone, 
  CheckCircle, 
  AlertCircle,
  Hash
} from 'lucide-react';

export default function BescomIdForm({
  bescomId,
  setBescomId,
  meterNo,
  setMeterNo,
  onSuccessfulLogin,
  activePersona
}) {
  const [consumerId, setConsumerId] = useState(bescomId || '1024589211');
  const [regPhone, setRegPhone] = useState(activePersona?.phone || '9876543210');
  const [secondaryStep, setSecondaryStep] = useState(false);
  const [securityPin, setSecurityPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    if (bescomId) setConsumerId(bescomId);
    if (activePersona?.phone) setRegPhone(activePersona.phone);
  }, [bescomId, activePersona]);

  // Auto-fill demo credentials
  const handleAutofillBescom = () => {
    if (activePersona) {
      setConsumerId(activePersona.bescomId || '1024589211');
      setRegPhone(activePersona.phone || '9876543210');
      setSuccessToast(`Demo credentials loaded for ${activePersona.roleName} (${activePersona.bescomId})`);
    } else {
      setConsumerId('1024589211');
      setRegPhone('9876543210');
      setSuccessToast('Demo BESCOM 10-char Consumer ID & Mobile loaded');
    }
    setErrorMsg('');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Validation
  const isValidConsumerId = /^[A-Za-z0-9]{10}$/.test((consumerId || '').trim());
  const isValidPhone = (regPhone || '').replace(/\D/g, '').length === 10;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidConsumerId) {
      setErrorMsg('Consumer ID must be exactly 10 alphanumeric characters (e.g. 1024589211 or KA20984712)');
      return;
    }

    if (!isValidPhone) {
      setErrorMsg('Please enter a valid 10-digit registered mobile number');
      return;
    }

    // If secondary step is not yet triggered, open secondary verification
    if (!secondaryStep) {
      setErrorMsg('');
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setSecondaryStep(true);
        setSecurityPin('8921'); // Mock fast pin
        setSuccessToast('BESCOM Meter Telemetry Found! Enter Secondary Security PIN (Demo: 8921)');
      }, 500);
      return;
    }

    // Verify secondary step
    if (securityPin.length < 4) {
      setErrorMsg('Please enter your 4-digit Meter Security PIN (Demo: 8921)');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onSuccessfulLogin({
        type: 'bescom_id',
        bescomId: consumerId.toUpperCase(),
        phone: regPhone,
        meterNo: meterNo || (activePersona ? activePersona.meterNo : 'DOM-HSR-4421'),
        persona: activePersona
      });
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Toast Notification */}
      {successToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!secondaryStep ? (
        <>
          {/* Field 1: 10-Character Alphanumeric Consumer ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                BESCOM Consumer Account ID
              </label>

              <button
                type="button"
                onClick={handleAutofillBescom}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 text-cyan-800 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-600 fill-cyan-500 group-hover:scale-110 transition-transform" />
                <span>⚡ Fill BESCOM Demo</span>
              </button>
            </div>

            <div className="relative flex rounded-xl shadow-xs border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white transition-all overflow-hidden">
              <div className="flex items-center justify-center pl-3.5 text-slate-400">
                <KeyRound className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                id="bescom-id-input"
                value={consumerId}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase().slice(0, 10);
                  setConsumerId(val);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="e.g. 1024589211 or KA20984712"
                className="w-full px-3 py-3 text-slate-900 placeholder-slate-400 font-mono text-sm tracking-wider uppercase focus:outline-none bg-transparent"
                maxLength={10}
                required
              />
              <div className="flex items-center pr-3.5 text-slate-400 text-xs font-mono">
                {consumerId.length}/10
              </div>
            </div>
            <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-slate-500">
              <span>10-character alphanumeric ID on physical BESCOM bill</span>
              <span className={`font-mono text-xs ${isValidConsumerId ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                {isValidConsumerId ? '✓ Valid Format' : 'Must be 10 chars'}
              </span>
            </div>
          </div>

          {/* Field 2: Registered Mobile Number (Secondary Verification Input) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Registered Primary Mobile Number
            </label>
            <div className="relative flex rounded-xl shadow-xs border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white transition-all overflow-hidden">
              <div className="flex items-center gap-1.5 px-3.5 bg-slate-100/80 border-r border-slate-200 text-slate-700 text-sm font-semibold select-none">
                <span className="text-base" role="img" aria-label="India">🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setRegPhone(val);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="98765 43210"
                className="w-full px-3 py-3 text-slate-900 placeholder-slate-400 font-mono text-sm tracking-wider focus:outline-none bg-transparent"
                maxLength={10}
                required
              />
              <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="block mt-1 px-1 text-[11px] text-slate-500">
              Linked to your BESCOM consumer account for two-factor meter access
            </span>
          </div>

          {/* Direct Sandbox Security Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cryptographic handshake with Karnataka State AMR Data Hub</span>
          </div>

          {/* Next / Verify Button */}
          <button
            type="submit"
            disabled={isVerifying || !isValidConsumerId || !isValidPhone}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              isValidConsumerId && isValidPhone && !isVerifying
                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Matching BESCOM Consumer Registry...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-cyan-300" />
                <span>Verify Consumer ID & Proceed</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </>
      ) : (
        /* SECONDARY VERIFICATION STEP: Meter Security PIN */
        <div className="space-y-4 animate-fadeIn">
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Consumer ID & Registered Phone</span>
              <span className="font-semibold text-slate-900 font-mono text-sm">
                {consumerId} • +91 {regPhone}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSecondaryStep(false)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Secondary Verification: Meter Security PIN
              </label>
              <button
                type="button"
                onClick={() => setSecurityPin('8921')}
                className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200"
              >
                Auto-fill (8921)
              </button>
            </div>

            <div className="relative flex rounded-xl shadow-xs border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white transition-all">
              <input
                type="password"
                maxLength={4}
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                placeholder="•••• (Demo: 8921)"
                className="w-full px-3.5 py-3 text-slate-900 placeholder-slate-400 font-mono text-base tracking-widest text-center focus:outline-none bg-transparent"
                required
              />
            </div>
            <span className="block mt-1 px-1 text-[11px] text-slate-500">
              4-digit PIN dispatched to +91 {regPhone} for meter telemetry authentication
            </span>
          </div>

          <button
            type="submit"
            disabled={isVerifying || securityPin.length < 4}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              securityPin.length >= 4 && !isVerifying
                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/25 hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Decrypting BESCOM Virtual Stream...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                <span>Authenticate & Launch SiliconUrja</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
