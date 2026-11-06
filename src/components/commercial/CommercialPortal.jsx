import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { KpiMetricsBar } from './KpiMetricsBar';
import { SectorPowerBreakdown } from './SectorPowerBreakdown';
import { TenantAllocationCard } from './TenantAllocationCard';
import { PowerDemandChart } from './PowerDemandChart';
import { GridStatusBanner } from './GridStatusBanner';
import { EsgReportModal } from './EsgReportModal';
import { PreCoolingModal } from './PreCoolingModal';
import { 
  KPI_METRICS, 
  FACILITY_INFO, 
  OTHER_FACILITIES,
  TENANT_ALLOCATION,
  SECTOR_BREAKDOWN
} from './energyData';
import { 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Download, 
  HelpCircle,
  FileText,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

export default function CommercialPortal({ sessionData }) {
  const [selectedFacility, setSelectedFacility] = useState(() => {
    if (sessionData?.persona && sessionData.persona.id === 'commercial') {
      return {
        ...OTHER_FACILITIES[0],
        name: sessionData.persona.name || OTHER_FACILITIES[0].name,
        address: sessionData.persona.zone || OTHER_FACILITIES[0].address,
        sanctionedLoad: sessionData.persona.sanctionedLoad || OTHER_FACILITIES[0].sanctionedLoad
      };
    }
    if (sessionData?.profile) {
      return {
        ...OTHER_FACILITIES[0],
        name: sessionData.profile.full_name || OTHER_FACILITIES[0].name,
        address: sessionData.profile.grid_zone || OTHER_FACILITIES[0].address,
        sanctionedLoad: sessionData.profile.connected_load || OTHER_FACILITIES[0].sanctionedLoad
      };
    }
    return OTHER_FACILITIES[0];
  });
  const [metrics, setMetrics] = useState(KPI_METRICS);
  const [isSimulatingSpike, setIsSimulatingSpike] = useState(false);
  const [preCoolingActive, setPreCoolingActive] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Modals
  const [isEsgModalOpen, setIsEsgModalOpen] = useState(false);
  const [isPreCoolingModalOpen, setIsPreCoolingModalOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "info") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live telemetry stream simulator: slightly fluctuates power metrics every 3 seconds to represent real smart-meter telemetry
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setMetrics(prev => {
        // Natural small fluctuation ±10 kVA
        const jitter = Math.floor(Math.random() * 9) - 4;
        const currentDemand = Math.min(1980, Math.max(1820, prev.activeDemand.current + jitter));
        
        // Solar fluctuation based on minute irradiance changes
        const solarJitter = Math.floor(Math.random() * 5) - 2;
        const currentSolar = Math.min(650, Math.max(610, prev.solarShare.currentGenerationKW + solarJitter));

        const solarPct = Math.round((currentSolar / currentDemand) * 100);

        return {
          ...prev,
          activeDemand: {
            ...prev.activeDemand,
            current: currentDemand,
            bufferKVA: Math.max(0, prev.activeDemand.contractedLimit - currentDemand),
          },
          solarShare: {
            ...prev.solarShare,
            currentGenerationKW: currentSolar,
            percentage: solarPct,
          }
        };
      });
      setLastUpdated(new Date());
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  const handleToggleSpike = () => {
    const nextState = !isSimulatingSpike;
    setIsSimulatingSpike(nextState);
    if (nextState) {
      showToast("⚠️ Peak Load Surge Simulated: +180 kVA added. Demand response alert active!", "warning");
    } else {
      showToast("✓ Normal Load profile restored. Demand within safe operating envelope.", "success");
    }
  };

  const handleTogglePreCooling = () => {
    const nextState = !preCoolingActive;
    setPreCoolingActive(nextState);
    if (nextState) {
      showToast("⚡ Automated Pre-Cooling Sequence Deployed: BMS setpoint set to 21.5°C using solar surplus.", "success");
    } else {
      showToast("BMS Pre-Cooling Sequence deactivated. Returning to default ASHRAE setpoints.", "info");
    }
  };

  // CSV Ledger Exporter for Tenant Sub-Billing
  const handleExportLedger = () => {
    const headers = "Tower,Tenant,Active_Draw_kW,Cumulative_Hourly_kWh,Power_Factor,Contracted_Quota_kW,Hourly_Cost_INR\n";
    const rows = TENANT_ALLOCATION.map(t => 
      `"${t.tower}","${t.tenantName}",${t.activeDrawKW},${t.cumulativeHourlyKWh},${t.powerFactor},${t.contractedQuotaKW},${t.currentHourlyCostINR}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SiliconUrja_${selectedFacility.id}_SubBilling_Ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📥 Sub-Billing CSV Ledger successfully exported!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* 1. Executive Header & Controls */}
      <Header 
        selectedFacility={selectedFacility}
        onSelectFacility={(fac) => {
          setSelectedFacility(fac);
          showToast(`Switched active portal view to: ${fac.name}`, "info");
        }}
        onOpenEsgReport={() => setIsEsgModalOpen(true)}
        isSimulatingSpike={isSimulatingSpike}
        onToggleSpike={handleToggleSpike}
        isLiveUpdating={isLiveUpdating}
        onToggleLiveUpdating={() => setIsLiveUpdating(!isLiveUpdating)}
        lastUpdated={lastUpdated}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Real-time Grid Telemetry & Feeder Health Banner */}
        <GridStatusBanner />

        {/* 2. KPI Metrics Bar (4 Executive Cards) */}
        <KpiMetricsBar 
          metrics={metrics}
          isSimulatingSpike={isSimulatingSpike}
          onOpenPreCooling={() => setIsPreCoolingModalOpen(true)}
        />

        {/* 24-Hour Active Demand vs Solar Curve & BESCOM Tariff Engine */}
        <PowerDemandChart 
          preCoolingActive={preCoolingActive}
        />

        {/* 3. Main Content Layout (Split Across Sector Draw and Tenant Allocation) */}
        <div className="space-y-6">
          
          {/* Section: Facility Power Draw by Sector with Actionable Pre-Cooling Recommendation Box */}
          <SectorPowerBreakdown 
            preCoolingActive={preCoolingActive}
            onTogglePreCooling={handleTogglePreCooling}
            onOpenPreCoolingModal={() => setIsPreCoolingModalOpen(true)}
          />

          {/* Section: Tenant Power Allocation & Sub-Billing */}
          <TenantAllocationCard 
            onExportLedger={handleExportLedger}
          />

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/90 py-6 text-xs text-slate-500 mt-12 no-print shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-900">SiliconUrja</span>
            <span>• Commercial Energy Intelligence Platform</span>
            <span>• Bengaluru Smart Grid Feeder #4</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>BESCOM HT-2B Tariff Valid 2026-27</span>
            <span>•</span>
            <span>ISO 50001 Verified</span>
            <span>•</span>
            <button 
              onClick={() => setIsEsgModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-medium underline font-sans"
            >
              ESG Compliance View
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-xl backdrop-blur-md border text-xs font-medium flex items-center gap-2.5 ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-emerald-500/10' 
              : toastMessage.type === 'warning' 
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-amber-500/10' 
                : 'bg-white text-blue-950 border-blue-300 shadow-blue-500/10'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : toastMessage.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            ) : (
              <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
            )}
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <EsgReportModal 
        isOpen={isEsgModalOpen}
        onClose={() => setIsEsgModalOpen(false)}
      />

      <PreCoolingModal 
        isOpen={isPreCoolingModalOpen}
        onClose={() => setIsPreCoolingModalOpen(false)}
        preCoolingActive={preCoolingActive}
        onTogglePreCooling={handleTogglePreCooling}
      />

    </div>
  );
}
