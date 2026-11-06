import React, { useState, useEffect, useRef } from 'react';
import { Phone, ArrowRight, ShieldCheck, RefreshCw, Zap, Edit3, CheckCircle } from 'lucide-react';

export default function PhoneOtpForm({
  phone,
  setPhone,
  onSuccessfulLogin,
  activePersona
}) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const inputRefs = useRef([]);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Handle Send OTP
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setErrorMsg('');
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp');
      setTimer(30);
      setIsTimerActive(true);
      setSuccessToast('OTP dispatched via BESCOM SMS Gateway: 123456');
      setTimeout(() => setSuccessToast(''), 4000);
      // Auto-focus first OTP input after transition
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }, 600);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle single character
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMsg('');

    // Advance focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Key Down (Backspace logic)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste event for entire OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      setErrorMsg('');
    }
  };

  // Auto-fill Demo OTP (123456)
  const handleAutofillDemoOtp = () => {
    const demoDigits = ['1', '2', '3', '4', '5', '6'];
    setOtp(demoDigits);
    setErrorMsg('');
    setSuccessToast('Demo OTP (123456) auto-filled!');
    setTimeout(() => setSuccessToast(''), 3000);
    inputRefs.current[5]?.focus();
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    if (timer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setIsTimerActive(true);
    setSuccessToast('Fresh OTP dispatched! Demo code: 123456');
    setTimeout(() => setSuccessToast(''), 3500);
    inputRefs.current[0]?.focus();
  };

  // Handle Verification
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP');
      return;
    }

    if (enteredOtp !== '123456') {
      setErrorMsg('Invalid OTP. For hackathon testing, please use Demo OTP: 123456');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onSuccessfulLogin({
        type: 'phone_otp',
        phone,
        persona: activePersona
      });
    }, 700);
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {successToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {step === 'phone' ? (
        /* STEP 1: Phone Number Input */
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Registered Indian Mobile Number
            </label>
            <div className="relative flex rounded-xl shadow-xs border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white transition-all overflow-hidden">
              {/* Country Code Prefix */}
              <div className="flex items-center gap-1.5 px-3.5 bg-slate-100/80 border-r border-slate-200 text-slate-700 text-sm font-semibold select-none">
                <span className="text-base" role="img" aria-label="India">🇮🇳</span>
                <span>+91</span>
              </div>

              {/* Phone Input */}
              <div className="relative flex-1">
                <input
                  type="tel"
                  id="phone-input"
                  name="phone"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-3 text-slate-900 placeholder-slate-400 font-mono text-sm tracking-wider focus:outline-none bg-transparent"
                  maxLength={10}
                  autoComplete="tel-national"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-1.5 px-1 text-[11px] text-slate-500">
              <span>Standard 10-digit mobile number</span>
              <span className="font-mono text-slate-400">{phone.length}/10 digits</span>
            </div>
          </div>

          {/* Quick Demo Autofill Hint */}
          <div className="flex items-center justify-between bg-blue-50/60 p-2.5 rounded-xl border border-blue-100/80 text-xs">
            <span className="text-slate-600 text-[11px]">
              Need test number? Use active persona or click:
            </span>
            <button
              type="button"
              onClick={() => {
                setPhone('9876543210');
                if (errorMsg) setErrorMsg('');
              }}
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 underline decoration-blue-300 underline-offset-2"
            >
              Fill 9876543210
            </button>
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={isSendingOtp || phone.length < 10}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              phone.length === 10 && !isSendingOtp
                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSendingOtp ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Contacting BESCOM Gateway...</span>
              </>
            ) : (
              <>
                <span>Send OTP to Mobile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* STEP 2: 6-Digit OTP Verification */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Verification code sent to</span>
              <span className="font-semibold text-slate-900 font-mono text-sm">+91 {phone}</span>
            </div>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Enter 6-Digit Verification PIN
              </label>

              {/* Instant Presentation Testing Button */}
              <button
                type="button"
                onClick={handleAutofillDemoOtp}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 text-cyan-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-600 fill-cyan-500 group-hover:scale-110 transition-transform" />
                <span>⚡ Auto-fill Demo OTP (123456)</span>
              </button>
            </div>

            {/* 6 Individual PIN Input Boxes */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2.5" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-xl border transition-all duration-150 focus:outline-none ${
                    digit
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Resend OTP countdown timer (30 seconds) */}
          <div className="flex items-center justify-between py-1 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Resend code in:</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                00:{timer < 10 ? `0${timer}` : timer}
              </span>
            </div>

            <button
              type="button"
              disabled={timer > 0}
              onClick={handleResendOtp}
              className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
                timer === 0
                  ? 'text-blue-600 hover:text-blue-800 underline decoration-blue-400'
                  : 'text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${timer === 0 ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Resend OTP</span>
            </button>
          </div>

          {/* Verify & Access Button */}
          <button
            type="submit"
            disabled={isVerifying || otp.join('').length < 6}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              otp.join('').length === 6 && !isVerifying
                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating with BESCOM Bridge...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                <span>Verify & Launch SiliconUrja</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
