import React, { useState } from 'react';
import {
  Building,
  Factory,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  UserPlus,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

import {
  GRID_ZONES,
  CUSTOMER_SEGMENTS,
  METER_TYPES
} from '../../data/demoPersonas';

import { supabase } from '../../lib/supabaseClient';

export default function RegistrationPortal({
  onCompleteRegistration,
  onSwitchToLogin
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedSegment, setSelectedSegment] = useState(
    CUSTOMER_SEGMENTS[0]
  );

  const [gridZone, setGridZone] = useState(GRID_ZONES[0]);
  const [meterType, setMeterType] = useState(METER_TYPES[0]);

  const [connectedLoad, setConnectedLoad] = useState('3.5');
  const [loadUnit, setLoadUnit] = useState('kW');
  const [bescomId, setBescomId] = useState('');

  // Contact and identity
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Agreement checklist
  const [agreedLoad, setAgreedLoad] = useState(true);
  const [agreedBridge, setAgreedBridge] = useState(true);
  const [agreedSupport, setAgreedSupport] = useState(true);

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Demo autofill for judges
  const handleAutofillDemoRegistration = (type = 'commercial') => {
    if (type === 'commercial') {
      setSelectedSegment(CUSTOMER_SEGMENTS[1]);
      setGridZone('Outer Ring Road Tech Corridor');
      setMeterType('HT Tri-vector Time-of-Day (TOD) Meter');
      setConnectedLoad('150');
      setLoadUnit('kW');
      setBescomId('2098471204');
      setFullName('Sunita Rao');
      setEmail('sunita.rao@ecospaceblr.com');
      setPhone('9845011223');

      setToastMsg('Commercial demo profile loaded.');
    } else if (type === 'industrial') {
      setSelectedSegment(CUSTOMER_SEGMENTS[2]);
      setGridZone('Peenya Industrial Zone');
      setMeterType('CT/PT Operated Grid Revenue Meter');
      setConnectedLoad('850');
      setLoadUnit('kVA');
      setBescomId('3187654390');
      setFullName('Ramesh Hegde');
      setEmail('r.hegde@peenyaprecision.in');
      setPhone('9448099887');

      setToastMsg('Industrial demo profile loaded.');
    } else {
      setSelectedSegment(CUSTOMER_SEGMENTS[0]);
      setGridZone('HSR Layout & Silk Board Zone');
      setMeterType('LT Bi-directional Net Meter (Rooftop Solar PV)');
      setConnectedLoad('3.5');
      setLoadUnit('kW');
      setBescomId('1024589211');
      setFullName('Priyanshu K.');
      setEmail('priyanshu.k@siliconurja.io');
      setPhone('9876543210');

      setToastMsg('Domestic demo profile loaded.');
    }

    setTimeout(() => setToastMsg(''), 3500);
  };

  // Step navigation
  const handleNextStep = () => {
    setErrorMsg('');

    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!connectedLoad || parseFloat(connectedLoad) <= 0) {
        setErrorMsg('Please specify a valid connected load.');
        return;
      }

      setCurrentStep(3);
    }
  };

  // Real Supabase registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg('');
    setToastMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!cleanEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }

    if (!agreedLoad || !agreedBridge || !agreedSupport) {
      setErrorMsg('Please accept all agreement checklist items.');
      return;
    }

    setIsSubmitting(true);

    try {
      const accountType = selectedSegment.id;

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,

        options: {
          data: {
            full_name: fullName.trim(),
            account_type: accountType,
            phone: cleanPhone,
            grid_zone: gridZone,
            meter_type: meterType,
            connected_load: `${connectedLoad} ${loadUnit}`,
            bescom_id: bescomId
          }
        }
      });

      if (error) {
        throw error;
      }

      // Email confirmation may be required by Supabase.
      if (!data.session) {
        setToastMsg(
          'Account created successfully! Please check your email to verify your account, then sign in.'
        );

        setIsSubmitting(false);
        return;
      }

      // Load the profile created by the database trigger.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        throw new Error(
          'Account created, but profile could not be loaded: ' +
          profileError.message
        );
      }

      const registrationData = {
        name: fullName.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        segment: selectedSegment.title,
        account_type: accountType,
        zone: gridZone,
        meterType,
        sanctionedLoad: `${connectedLoad} ${loadUnit}`,
        bescomId: bescomId || null,

        roleName:
          accountType === 'domestic'
            ? 'Domestic Consumer'
            : accountType === 'commercial'
            ? 'Facility Manager'
            : 'Plant Operations Head',

        user: data.user,
        profile
      };

      setToastMsg('Registration successful!');

      if (onCompleteRegistration) {
        onCompleteRegistration(registrationData);
      }

    } catch (error) {
      console.error('Registration error:', error);
      setErrorMsg(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl shadow-blue-900/10 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 p-5 sm:p-6 text-white">

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

          <div className="flex items-center gap-2.5">

            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <UserPlus className="w-5 h-5 text-cyan-300" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                New Consumer Registration
              </h2>

              <p className="text-xs text-blue-100">
                Create your SiliconUrja energy profile
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </button>

        </div>

        {/* PROGRESS */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">

          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`py-1.5 px-2 rounded-lg ${
                currentStep === step
                  ? 'bg-white/25 font-bold text-white ring-1 ring-white/40'
                  : 'bg-white/10 text-blue-200'
              }`}
            >
              {step === 1
                ? '1. Category'
                : step === 2
                ? '2. Zone & Meter'
                : '3. Identity'}
            </div>
          ))}

        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-5">

        {/* TOAST */}
        {toastMsg && (
          <div className="flex items-center gap-2 p-3 bg-cyan-50 border border-cyan-200 text-cyan-900 rounded-xl text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ERROR */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            <Info className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* DEMO AUTOFILL */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">

          <span className="text-slate-600 font-semibold text-[11px]">
            Judge Demo Autofill:
          </span>

          <div className="flex items-center gap-1.5">

            <button
              type="button"
              onClick={() => handleAutofillDemoRegistration('domestic')}
              className="px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-semibold text-slate-700"
            >
              Domestic
            </button>

            <button
              type="button"
              onClick={() => handleAutofillDemoRegistration('commercial')}
              className="px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-semibold text-blue-700"
            >
              Commercial
            </button>

            <button
              type="button"
              onClick={() => handleAutofillDemoRegistration('industrial')}
              className="px-2 py-1 rounded bg-white border border-slate-200 text-[11px] font-semibold text-indigo-700"
            >
              Industrial
            </button>

          </div>
        </div>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-4">

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Customer Category
              </label>

              <p className="text-xs text-slate-500 mb-3">
                Choose the account type you want to register.
              </p>
            </div>

            <div className="space-y-2.5">

              {CUSTOMER_SEGMENTS.map((seg) => {

                const isSelected = selectedSegment.id === seg.id;

                const IconComp =
                  seg.id === 'domestic'
                    ? Home
                    : seg.id === 'commercial'
                    ? Building
                    : Factory;

                return (
                  <div
                    key={seg.id}
                    onClick={() => {
                      setSelectedSegment(seg);
                      setConnectedLoad(seg.defaultLoad);
                      setLoadUnit(seg.unit);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div>
                        <span className="font-bold text-sm text-slate-900 block">
                          {seg.title}
                        </span>

                        <span className="text-xs text-slate-500">
                          {seg.subtext}
                        </span>
                      </div>

                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300'
                    }`}>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                    </div>

                  </div>
                );
              })}

            </div>

            <div className="pt-3 flex justify-end">

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                Continue to Grid Zone & Meter
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-4">

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Grid Zone
              </label>

              <select
                value={gridZone}
                onChange={(e) => setGridZone(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm"
              >
                {GRID_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>

              <span className="block mt-1 text-[11px] text-slate-500">
                Select the area associated with your electricity connection.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Meter Type
              </label>

              <select
                value={meterType}
                onChange={(e) => setMeterType(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm"
              >
                {METER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Connected Sanctioned Load
                </label>

                <div className="flex rounded-xl border border-slate-300 overflow-hidden">

                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={connectedLoad}
                    onChange={(e) => setConnectedLoad(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm"
                  />

                  <select
                    value={loadUnit}
                    onChange={(e) => setLoadUnit(e.target.value)}
                    className="bg-slate-100 text-xs font-bold px-3 border-l"
                  >
                    <option value="kW">kW</option>
                    <option value="kVA">kVA</option>
                    <option value="HP">HP</option>
                  </select>

                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  BESCOM Account ID
                </label>

                <input
                  type="text"
                  maxLength={10}
                  value={bescomId}
                  onChange={(e) =>
                    setBescomId(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="10-digit account ID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

            </div>

            <div className="pt-3 flex items-center justify-between gap-3">

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name *
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address *
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>

            </div>

            {/* PHONE */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mobile Number *
              </label>

              <div className="flex rounded-xl border border-slate-300 overflow-hidden">

                <span className="px-3 py-2.5 bg-slate-100 text-xs font-bold border-r">
                  +91
                </span>

                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 text-sm"
                  required
                />

              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Create Password *
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                required
              />

              <p className="text-[11px] text-slate-500 mt-1">
                Use this password to sign in to SiliconUrja.
              </p>
            </div>

            {/* AGREEMENTS */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">

              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Registration Agreement
              </span>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">

                <input
                  type="checkbox"
                  checked={agreedLoad}
                  onChange={(e) => setAgreedLoad(e.target.checked)}
                  className="mt-0.5"
                />

                <span>
                  I confirm that the stated connected load of
                  {' '}
                  <strong>{connectedLoad} {loadUnit}</strong>
                  {' '}
                  is accurate to the best of my knowledge.
                </span>

              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">

                <input
                  type="checkbox"
                  checked={agreedBridge}
                  onChange={(e) => setAgreedBridge(e.target.checked)}
                  className="mt-0.5"
                />

                <span>
                  I agree to use SiliconUrja's energy analysis platform
                  with manually entered consumption data and uploaded
                  electricity bills. I understand this registration
                  does not connect to a live BESCOM meter or data stream.
                </span>

              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">

                <input
                  type="checkbox"
                  checked={agreedSupport}
                  onChange={(e) => setAgreedSupport(e.target.checked)}
                  className="mt-0.5"
                />

                <span>
                  I acknowledge that official electricity supply,
                  billing disputes and outage support remain with
                  the relevant electricity distribution company.
                </span>

              </label>

            </div>

            {/* BUTTONS */}
            <div className="pt-3 flex items-center justify-between gap-3">

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md flex items-center gap-2 disabled:opacity-60"
              >

                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-cyan-300" />
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}

              </button>

            </div>

          </form>
        )}

        {/* LOGIN LINK */}
        <div className="pt-4 border-t border-slate-100 text-center">

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Already registered?
            {' '}
            <span className="underline font-bold">
              Sign In to SiliconUrja
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}