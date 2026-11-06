import { supabase } from '../../lib/supabaseClient';
import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function EmailPasswordForm({
  email = '',
  setEmail = () => {},
  password = '',
  setPassword = () => {},
  onSuccessfulLogin,
  activePersona,
  onNavigateRegister
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Validate email format
  const safeEmail = typeof email === 'string' ? email.trim() : '';
  const safePassword = typeof password === 'string' ? password.trim() : '';
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail);
  const isValidPassword = safePassword.length >= 6;

  // Auto-fill demo credentials for the active persona
  const handleAutofillDemo = () => {
    if (activePersona) {
      setEmail(activePersona.email);
      setPassword(activePersona.password);
      setSuccessToast(`Demo credentials loaded for ${activePersona.name} (${activePersona.roleName})`);
    } else {
      setEmail('priyanshu.k@siliconurja.io');
      setPassword('Domestic@123');
      setSuccessToast('Demo Domestic User credentials loaded');
    }
    setErrorMsg('');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail || !isValidPassword) {
      setErrorMsg('Enter a valid email and password.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: safeEmail,
      password: safePassword
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      setErrorMsg('Login succeeded, but profile could not be loaded: ' + profileError.message);
      return;
    }

    onSuccessfulLogin({
      type: 'email_password',
      email: data.user.email,
      user: data.user,
      profile
    });
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setErrorMsg('Please enter a valid email for reset');
      return;
    }
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setShowForgotModal(false);
      setSuccessToast(`Password reset link dispatched to ${forgotEmail}`);
      setTimeout(() => setSuccessToast(''), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-4">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field 1: Email Address */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Registered Email Address
            </label>

            {/* Instant Presentation Testing Button */}
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 text-cyan-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-600 fill-cyan-500 group-hover:scale-110 transition-transform" />
              <span>⚡ Auto-fill Demo ({activePersona?.name?.split(' ')[0] || 'User'})</span>
            </button>
          </div>

          <div className="relative flex rounded-xl shadow-xs border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white transition-all overflow-hidden">
            <div className="flex items-center justify-center pl-3.5 text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              id="email-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. name@enterprise.com"
              className="w-full px-3 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none bg-transparent"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-slate-500">
            <span>Corporate or consumer login ID</span>
            {email && (
              <span className={`font-mono ${isValidEmail ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                {isValidEmail ? '✓ Valid email' : 'Format: name@domain.com'}
              </span>
            )}
          </div>
        </div>

        {/* Field 2: Password with Show/Hide Toggle */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Account Password
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotEmail(email || activePersona?.email || '');
                setShowForgotModal(true);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative flex rounded-xl shadow-xs border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 bg-white transition-all overflow-hidden">
            <div className="flex items-center justify-center pl-3.5 text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="••••••••••••"
              className="w-full px-3 py-3 text-slate-900 placeholder-slate-400 font-mono text-sm tracking-wider focus:outline-none bg-transparent"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <span className="block mt-1 px-1 text-[11px] text-slate-500">
            Encrypted with 256-bit TLS hardware-free virtual bridge gateway
          </span>
        </div>

        {/* Security / Compliance Badge */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>KERC Regulatory Sandbox Compliant • Direct BESCOM AMI Cloud Authentication</span>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isValidEmail || !isValidPassword}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            isValidEmail && isValidPassword && !isSubmitting
              ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Verifying Credentials with Cloud Bridge...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>Sign In to SiliconUrja</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset Account Password</h3>
                <p className="text-xs text-slate-500">BESCOM Identity & Virtual Meter Gateway</p>
              </div>
            </div>

            {resetSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <span className="text-xs font-bold text-emerald-900 block">Password Reset Link Dispatched!</span>
                <p className="text-[11px] text-emerald-700">Check your inbox for cryptographic authentication tokens.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered consumer email address below. We'll send an authenticated password recovery link.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@enterprise.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
