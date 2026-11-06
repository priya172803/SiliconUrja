import React, { useState, useEffect, useRef } from 'react';
import { 
  KeyRound, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Building2,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const OfficialLogin = ({ 
  activePersona, 
  onLoginSuccess, 
  onSwitchToRegister,
  showToast 
}) => {
  // Login Sub-tab: 'badge' or 'phone_otp'
  const [loginMethod, setLoginMethod] = useState('badge');

  // Badge Login Form State
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP State
  const [phone, setPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otpInputs = useRef([]);

  // Sync with activePersona if selected
  useEffect(() => {
    if (activePersona) {
      setBadgeId(activePersona.badgeId);
      setPassword(activePersona.password);
      setPhone(activePersona.phone);
    }
  }, [activePersona]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Phone validation
  const isPhoneValid = /^[6-9]\d{9}$/.test(phone);

  const handleSendOtp = () => {
    if (!isPhoneValid) {
      showToast({
        type: 'warning',
        title: 'Invalid Mobile Number',
        message: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
      });
      return;
    }
    setIsOtpSent(true);
    setCountdown(30);
    showToast({
      type: 'energy',
      title: 'SLDC OTP Dispatched',
      message: `One-Time Password sent to +91 ${phone}. Valid for 5 minutes.`
    });
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    showToast({
      type: 'info',
      title: 'New OTP Dispatched',
      message: 'A fresh 6-digit PIN has been generated via National SMS Gateway.'
    });
  };

  const handleAutofillDemoOtp = () => {
    const demoCode = ['1', '2', '3', '4', '5', '6'];
    setOtp(demoCode);
    showToast({
      type: 'persona',
      title: '⚡ Demo OTP Applied',
      message: 'Evaluation PIN 123456 autofilled successfully.'
    });
    // Focus last input
    if (otpInputs.current[5]) {
      otpInputs.current[5].focus();
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Pasting full 6-digit OTP
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length > 0) {
        const newOtp = [...otp];
        digits.forEach((d, i) => {
          if (index + i < 6) newOtp[index + i] = d;
        });
        setOtp(newOtp);
        const nextFocus = Math.min(index + digits.length, 5);
        if (otpInputs.current[nextFocus]) otpInputs.current[nextFocus].focus();
      }
      return;
    }

    const cleanChar = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);

    // Auto-advance
    if (cleanChar && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleBadgeLogin = (e) => {
    e.preventDefault();
    if (!badgeId.trim()) {
      showToast({
        type: 'warning',
        title: 'Badge ID Required',
        message: 'Please enter your Karnataka State SLDC/KPTCL Employee Badge ID.'
      });
      return;
    }
    if (!password) {
      showToast({
        type: 'warning',
        title: 'Password Required',
        message: 'Please enter your secure officer portal password.'
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        authType: 'badge',
        badgeId,
        persona: activePersona || {
          name: badgeId.startsWith('KA') ? 'Govt Policy Executive' : 'KPTCL Grid Specialist',
          role: badgeId.startsWith('KA') ? 'Govt Admin / Policy Maker' : 'Utility Operations Officer',
          badgeId: badgeId.toUpperCase(),
          jurisdiction: 'KPTCL - SLDC Bengaluru',
        }
      });
    }, 900);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      showToast({
        type: 'warning',
        title: 'Incomplete PIN',
        message: 'Please enter the complete 6-digit verification code.'
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        authType: 'otp',
        phone: `+91 ${phone}`,
        persona: activePersona || {
          name: 'Authorized Field Officer',
          role: 'Utility Operations Officer',
          badgeId: 'KPTCL-OTP-VERIFIED',
          jurisdiction: 'Peenya Industrial Zone',
        }
      });
    }, 900);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Sub-tab Toggle: Badge vs Phone OTP */}
      <div className="relative p-1 bg-slate-100 rounded-xl flex items-center border border-slate-200">
        <button
          type="button"
          onClick={() => setLoginMethod('badge')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            loginMethod === 'badge'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-blue-700" />
          <span>Employee / Badge ID</span>
        </button>

        <button
          type="button"
          onClick={() => setLoginMethod('phone_otp')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            loginMethod === 'phone_otp'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-cyan-600" />
          <span>Phone & Secure OTP</span>
        </button>
      </div>

      {/* METHOD 1: Badge ID & Password */}
      {loginMethod === 'badge' && (
        <form onSubmit={handleBadgeLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Official Employee / Badge ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4 text-blue-700" />
              </div>
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value.toUpperCase())}
                placeholder="e.g. KA-SLDC-ADM-001 or KPTCL-EE-4092"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono tracking-wider font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-slate-500 flex items-center gap-1 font-mono">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Issued by Energy Department / KPTCL
              </span>
              <button
                type="button"
                onClick={() => onSwitchToRegister && onSwitchToRegister(badgeId)}
                className="text-blue-700 hover:text-blue-900 font-semibold hover:underline flex items-center gap-1"
              >
                <span>New officer? Register badge</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-medium text-blue-700 hover:text-blue-900 hover:underline"
              >
                {showPassword ? 'Hide Key' : 'Reveal Key'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Quick info note */}
          <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Direct intranet routing to KPTCL SCADA Gateway & National Grid Cyber Defense Protocol (CERT-In compliant).
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative overflow-hidden py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 hover:from-blue-800 hover:to-blue-700 active:scale-[0.99] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Authenticating with SLDC Grid Nodes...</span>
              </>
            ) : (
              <>
                <span>Access Command Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
              </>
            )}
          </button>
        </form>
      )}

      {/* METHOD 2: Phone & Secure OTP */}
      {loginMethod === 'phone_otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Registered Officer Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-700 select-none shadow-sm">
                🇮🇳 +91
              </div>
              <div className="relative flex-1">
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9845012345"
                  className="w-full pl-3.5 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono tracking-wider font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isOtpSent ? 'Resend' : 'Send OTP'}</span>
              </button>
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className={`font-medium ${phone.length === 10 ? 'text-emerald-600 font-semibold flex items-center gap-1' : 'text-slate-500'}`}>
                {phone.length === 10 ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Valid 10-digit mobile number
                  </>
                ) : (
                  `10-digit Indian telecom standard (${phone.length}/10 digits)`
                )}
              </span>
            </div>
          </div>

          {/* OTP State Section */}
          {isOtpSent && (
            <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3.5 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    Enter 6-Digit Secure PIN
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Sent to +91 {phone}
                  </p>
                </div>

                {/* Instant Demo OTP Action Button */}
                <button
                  type="button"
                  onClick={handleAutofillDemoOtp}
                  className="inline-flex items-center gap-1 text-[11px] font-bold py-1 px-2.5 rounded-lg bg-amber-100/90 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-all shadow-xs active:scale-95"
                >
                  <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                  <span>⚡ Auto-fill Demo OTP (123456)</span>
                </button>
              </div>

              {/* 6-Digit PIN Grid */}
              <div className="flex justify-between gap-1.5 sm:gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-mono font-bold text-blue-950 bg-white border-2 border-slate-300 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all shadow-xs"
                  />
                ))}
              </div>

              {/* Countdown & Resend */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-blue-100">
                <span className="text-slate-600 text-[11px]">
                  Didn't receive code?
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className={`text-[11px] font-bold flex items-center gap-1 ${
                    countdown > 0
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-blue-700 hover:text-blue-900 hover:underline'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${countdown > 0 ? '' : 'text-cyan-600'}`} />
                  <span>
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP via SMS'}
                  </span>
                </button>
              </div>

              {/* Submit OTP */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-900 to-cyan-800 hover:from-blue-800 hover:to-cyan-700 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Verifying OTP with State Telecom Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Secure Login</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
                  </>
                )}
              </button>
            </div>
          )}

          {!isOtpSent && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <p className="text-xs text-slate-600">
                Click <span className="font-semibold text-blue-900">"Send OTP"</span> to dispatch a 2-factor verification PIN to the registered SIM.
              </p>
            </div>
          )}
        </form>
      )}

      {/* New Officer Accreditation Banner & Suggestion */}
      <div className="pt-4 border-t border-slate-200/90 animate-fade-in">
        <div className="p-3.5 bg-gradient-to-br from-blue-50/90 via-slate-50 to-cyan-50/40 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-900 border border-blue-200/80 shrink-0 mt-0.5">
              <UserPlus className="w-4 h-4 text-blue-800" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  New Officer or First-Time Access?
                </span>
                <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100/80 border border-cyan-200 px-1.5 py-0.2 rounded-full">
                  Registration Required
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                If you do not have an active SCADA credential or were recently assigned to KPTCL / SLDC Bengaluru, initiate official onboarding.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSwitchToRegister && onSwitchToRegister(badgeId)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs whitespace-nowrap shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0 group"
          >
            <span>Register as New Officer</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
