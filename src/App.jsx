import React, { useState, Suspense, lazy } from 'react';
import LoginGateway from './components/auth/LoginGateway';
import UnifiedNavbar from './components/common/UnifiedNavbar';
import JudgeQuickBar from './components/common/JudgeQuickBar';
import TariffDemonstrationModal from './components/common/TariffDemonstrationModal';
import { DEMO_PERSONAS } from './data/demoPersonas';
import { Sparkles, Zap, Loader2 } from 'lucide-react';

// Lazy-load dashboards for instant initial bundle loading and clean code splitting
const DomesticPortal = lazy(() => import('./components/domestic/DomesticPortal'));
const CommercialPortal = lazy(() => import('./components/commercial/CommercialPortal'));
const IndustrialPortal = lazy(() => import('./components/industrial/IndustrialPortal'));
const AdminPortal = lazy(() => import('./components/admin/AdminPortal'));

export default function App() {
  // Global Session State
  // sessionData: null | { isDemo, type, persona, user, profile, role }
  const [sessionData, setSessionData] = useState(null);

  // Current Active Dashboard View: 'domestic' | 'commercial' | 'industrial' | 'admin'
  const [currentRole, setCurrentRole] = useState('domestic');

  // Progressive Tariff Engine Demonstration Modal
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);

  // Global visual toast notification
  const [toastNotification, setToastNotification] = useState('');

  const triggerToast = (msg) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(''), 4500);
  };

  // When login or instant persona redirect happens
  const handleLogin = (authPayload) => {
    setSessionData(authPayload);
    const initialRole = authPayload.role || authPayload.persona?.roleId || authPayload.persona?.id || 'domestic';
    setCurrentRole(initialRole);
  };

  // Sign out / Exit session
  const handleLogout = () => {
    setSessionData(null);
    triggerToast('Logged out of SiliconUrja session');
  };

  // Switch role from top navbar
  const handleSwitchRole = (newRole) => {
    setCurrentRole(newRole);
    const matchingPersona = DEMO_PERSONAS.find((p) => p.id === newRole || p.roleId === newRole);
    if (matchingPersona && sessionData?.isDemo) {
      setSessionData((prev) => ({
        ...prev,
        persona: matchingPersona,
        role: newRole
      }));
    }
    triggerToast(`Switched active view to ${newRole.toUpperCase()} Dashboard`);
  };

  // Rapid persona switch from Judge Quick Bar
  const handleJudgeSelectPersona = (persona) => {
    const roleId = persona.roleId || persona.id;
    setCurrentRole(roleId);
    setSessionData({
      isDemo: true,
      type: 'demo_persona',
      persona: persona,
      role: roleId
    });
    triggerToast(`Judge evaluation switched to: ${persona.name} (${persona.roleName})`);
  };

  // Render the appropriate full dashboard
  const renderDashboard = () => {
    switch (currentRole) {
      case 'domestic':
        return <DomesticPortal sessionData={sessionData} />;
      case 'commercial':
        return <CommercialPortal sessionData={sessionData} />;
      case 'industrial':
        return <IndustrialPortal sessionData={sessionData} />;
      case 'admin':
      case 'government':
        return <AdminPortal sessionData={sessionData} />;
      default:
        return <DomesticPortal sessionData={sessionData} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-900">
      {/* Floating Animated Toast Notification */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-50 max-w-md p-4 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-cyan-500/40 flex items-start gap-3 animate-fadeIn">
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 mt-0.5">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-bold block text-cyan-300 mb-0.5">SiliconUrja System Event</span>
            <span className="text-slate-200 leading-relaxed">{toastNotification}</span>
          </div>
        </div>
      )}

      {!sessionData ? (
        /* Unified Authentication & Demo Gateway */
        <LoginGateway
          onLogin={handleLogin}
          toastNotification={toastNotification}
          triggerToast={triggerToast}
          onOpenTariffCalculator={() => setIsTariffModalOpen(true)}
        />
      ) : (
        /* Authenticated / Demo Multi-Role Dashboard View */
        <div className="flex-1 flex flex-col">
          {/* Universal Sticky Top Bar */}
          <UnifiedNavbar
            currentRole={currentRole}
            onSwitchRole={handleSwitchRole}
            sessionData={sessionData}
            onLogout={handleLogout}
            onOpenTariffCalculator={() => setIsTariffModalOpen(true)}
          />

          {/* Active Functional Dashboard with Suspense Fallback */}
          <main className="flex-1">
            <Suspense
              fallback={
                <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-600 animate-pulse">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                    Connecting to Smart Grid Gateway...
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Synchronizing real-time telemetry, meter calculations and algorithmic models.
                  </p>
                </div>
              }
            >
              {renderDashboard()}
            </Suspense>
          </main>

          {/* Judge Quick Evaluation Float Bar (Active during demo evaluation) */}
          {sessionData?.isDemo && (
            <JudgeQuickBar
              currentPersonaId={sessionData?.persona?.id}
              onSelectPersona={handleJudgeSelectPersona}
            />
          )}
        </div>
      )}

      {/* Dynamic Progressive Tariff Calculation & Comparison Modal */}
      <TariffDemonstrationModal
        isOpen={isTariffModalOpen}
        onClose={() => setIsTariffModalOpen(false)}
      />
    </div>
  );
}
