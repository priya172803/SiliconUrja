import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import PersonaSwitcher from './PersonaSwitcher';
import EmailPasswordForm from './EmailPasswordForm';
import BescomIdForm from './BescomIdForm';
import RegistrationPortal from './RegistrationPortal';
import { OfficialLogin } from './OfficialLogin';
import { OfficerRegistration } from './OfficerRegistration';
import { DEMO_PERSONAS } from '../../data/demoPersonas';
import { Mail, KeyRound, UserPlus, Sparkles, ShieldCheck, Building2, UserCheck, ArrowRight } from 'lucide-react';

export default function LoginGateway({ onLogin, toastNotification, triggerToast, onOpenTariffCalculator }) {
  // Mode state: 'consumer_login' | 'consumer_register' | 'official_login' | 'official_register'
  const [portalMode, setPortalMode] = useState('consumer_login');

  // Active Persona State for Demo / Quick Access
  const [activePersona, setActivePersona] = useState(DEMO_PERSONAS[0]);

  // Consumer Auth Tab State: 'email_password' | 'bescom_id'
  const [activeTab, setActiveTab] = useState('email_password');

  // Input states synchronized with persona
  const [email, setEmail] = useState(DEMO_PERSONAS[0].email);
  const [password, setPassword] = useState(DEMO_PERSONAS[0].password);
  const [bescomId, setBescomId] = useState(DEMO_PERSONAS[0].bescomId);
  const [meterNo, setMeterNo] = useState(DEMO_PERSONAS[0].meterNo);

  // When a hackathon judge selects a persona pill
  const handleSelectPersona = (persona) => {
    setActivePersona(persona);
    setEmail(persona.email || '');
    setPassword(persona.password || '');
    setBescomId(persona.bescomId || '');
    setMeterNo(persona.meterNo || '');

    if (persona.id === 'admin') {
      triggerToast(`🏛️ Pre-populated Govt Policy Officer credentials for ${persona.name}`);
    } else {
      triggerToast(`⚡ Pre-populated credentials for ${persona.name} (${persona.roleName} • ${persona.segment})`);
    }
  };

  // Direct instant launch from persona switcher for rapid hackathon judge presentation
  const handleDirectLaunch = (persona) => {
    const target = persona || activePersona;
    triggerToast(`🚀 Instant role redirection launched: ${target.roleName || target.badge}`);
    onLogin({
      isDemo: true,
      type: 'demo_persona',
      persona: target,
      role: target.roleId || target.id
    });
  };

  // When successful login happens via Supabase Email & Password
  const handleSuccessfulEmailLogin = (authData) => {
    // Map account_type from profile to dashboard role
    let role = authData.profile?.account_type || activePersona.id;
    if (role === 'residential') role = 'domestic';

    triggerToast(`🔒 Authenticated successfully via Supabase as ${authData.profile?.full_name || authData.user?.email}`);
    onLogin({
      isDemo: false,
      type: 'supabase_auth',
      user: authData.user,
      profile: authData.profile,
      role: role,
      persona: activePersona
    });
  };

  // When BESCOM ID login succeeds
  const handleSuccessfulBescomLogin = (authData) => {
    triggerToast(`⚡ Verified BESCOM Meter Telemetry for ID ${authData.consumerId}`);
    onLogin({
      isDemo: true,
      type: 'bescom_id',
      consumerId: authData.consumerId,
      phone: authData.phone,
      persona: activePersona,
      role: activePersona.roleId || activePersona.id
    });
  };

  // When official government login succeeds
  const handleSuccessfulOfficialLogin = (officialData) => {
    triggerToast(`🏛️ SLDC Dispatch Clearance Granted for ${officialData?.persona?.name || 'Energy Officer'}`);
    onLogin({
      isDemo: true,
      type: 'official_auth',
      persona: officialData?.persona || DEMO_PERSONAS[3],
      role: 'admin'
    });
  };

  // When new consumer registration completes in Supabase
  const handleCompleteRegistration = (profile) => {
    const roleId = profile.segment?.includes('Commercial')
      ? 'commercial'
      : profile.segment?.includes('Industrial')
      ? 'industrial'
      : 'domestic';

    triggerToast(`🎉 Registration Complete! Meter Bridge Active for ${profile.name}`);
    onLogin({
      isDemo: false,
      type: 'supabase_registered',
      profile: profile,
      role: roleId,
      persona: {
        id: roleId,
        roleId: roleId,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bescomId: profile.bescomId,
        segment: profile.segment,
        zone: profile.zone,
        sanctionedLoad: profile.sanctionedLoad,
        tariff: profile.tariff || 'LT-2(a) Domestic'
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern relative flex flex-col justify-between overflow-x-hidden">
      {/* Background radial energy glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-glow pointer-events-none -z-10"></div>

      {/* Top electric energy strip */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-700"></div>

      {/* Top Header */}
      <Header />

      {/* Main Responsive Form Container */}
      <main className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* Portal Mode Switcher Tabs */}
        <div className="mb-4 bg-slate-200/80 p-1 rounded-2xl flex items-center justify-between text-xs font-bold border border-slate-300/80 shadow-xs">
          <button
            type="button"
            onClick={() => setPortalMode('consumer_login')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              portalMode === 'consumer_login'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Consumer Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setPortalMode('official_login')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              portalMode === 'official_login'
                ? 'bg-slate-900 text-cyan-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>Official / SLDC Admin</span>
          </button>
        </div>

        {/* Dynamic Tariff Simulator Quick Access for Judges */}
        {onOpenTariffCalculator && (
          <div className="mb-3 flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={onOpenTariffCalculator}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-cyan-50 border border-cyan-400/80 text-cyan-900 text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
              <span>Explore Progressive Tariff Engine & Slab Breakdown</span>
            </button>
          </div>
        )}

        {/* Dynamic Card rendering based on portal mode */}
        {portalMode === 'consumer_register' ? (
          /* REGISTRATION / ONBOARDING PORTAL FLOW */
          <RegistrationPortal
            onCompleteRegistration={handleCompleteRegistration}
            onBackToLogin={() => setPortalMode('consumer_login')}
          />
        ) : portalMode === 'official_login' ? (
          /* OFFICIAL / GOVERNMENT OFFICER LOGIN FLOW */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <OfficialLogin
              activePersona={activePersona?.id === 'admin' ? activePersona : DEMO_PERSONAS[3]}
              onLoginSuccess={handleSuccessfulOfficialLogin}
              onSwitchToRegister={() => setPortalMode('official_register')}
              showToast={triggerToast}
            />
          </div>
        ) : portalMode === 'official_register' ? (
          /* OFFICIAL OFFICER REGISTRATION FLOW */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6">
            <OfficerRegistration
              activePersona={activePersona?.id === 'admin' ? activePersona : DEMO_PERSONAS[3]}
              onCompleteRegistration={(officer) => {
                triggerToast(`Registration dossier submitted for ${officer.name}`);
                setPortalMode('official_login');
              }}
              onNavigateLogin={() => setPortalMode('official_login')}
            />
          </div>
        ) : (
          /* CONSUMER LOGIN PORTAL FLOW (Domestic, Commercial, Industrial) */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300">
            {/* Top Hackathon Demo Persona Switcher */}
            <PersonaSwitcher
              activePersona={activePersona}
              onSelectPersona={handleSelectPersona}
              onDirectLaunch={handleDirectLaunch}
            />

            {/* In-Card Sub Header & Mode Toggle */}
            <div className="p-6 sm:p-7 pt-4">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('email_password')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'email_password'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email & Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('bescom_id')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'bescom_id'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>BESCOM ID & OTP</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPortalMode('consumer_register')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Consumer?</span>
                  <span>Register</span>
                </button>
              </div>

              {/* Form Tab Render */}
              {activeTab === 'email_password' ? (
                <EmailPasswordForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  activePersona={activePersona}
                  onSuccessfulLogin={handleSuccessfulEmailLogin}
                  onNavigateRegister={() => setPortalMode('consumer_register')}
                />
              ) : (
                <BescomIdForm
                  bescomId={bescomId}
                  setBescomId={setBescomId}
                  meterNo={meterNo}
                  setMeterNo={setMeterNo}
                  activePersona={activePersona}
                  onSuccessfulLogin={handleSuccessfulBescomLogin}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <Footer />
    </div>
  );
}
