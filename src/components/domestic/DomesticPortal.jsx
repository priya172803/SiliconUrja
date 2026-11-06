import React, { useState, useEffect } from 'react';
import DomesticHeader from './DomesticHeader';
import DomesticKpiCards from './DomesticKpiCards';
import DomesticBillOcr from './DomesticBillOcr';
import DomesticApplianceBreakdown from './DomesticApplianceBreakdown';
import DomesticGreenCreditsRewards from './DomesticGreenCreditsRewards';
import DomesticUrjaAiCopilot from './DomesticUrjaAiCopilot';
import DomesticRedeemModal from './DomesticRedeemModal';
import TariffBreakdownModal from './TariffBreakdownModal';
import DomesticCreditsGuideModal from './DomesticCreditsGuideModal';

import {
  INITIAL_DOMESTIC_PROFILE,
  INITIAL_DOMESTIC_KPIS,
  INITIAL_APPLIANCE_BREAKDOWN
} from './domesticData';

import { 
  CheckCircle2, 
  X, 
  Zap,
  Calendar,
  Clock
} from 'lucide-react';

export default function DomesticPortal({ sessionData }) {
  const getInitialProfile = () => {
    if (sessionData?.profile) {
      return {
        ...INITIAL_DOMESTIC_PROFILE,
        name: sessionData.profile.full_name || sessionData.profile.name || INITIAL_DOMESTIC_PROFILE.name,
        bescomId: sessionData.profile.bescom_id || sessionData.profile.bescomId || INITIAL_DOMESTIC_PROFILE.bescomId,
        meterNo: sessionData.profile.meter_number || sessionData.profile.meterNo || INITIAL_DOMESTIC_PROFILE.meterNo,
        zone: sessionData.profile.grid_zone || sessionData.profile.zone || INITIAL_DOMESTIC_PROFILE.zone,
        sanctionedLoad: sessionData.profile.connected_load || sessionData.profile.sanctionedLoad || INITIAL_DOMESTIC_PROFILE.sanctionedLoad,
        tariff: sessionData.profile.tariff_category || sessionData.profile.tariff || INITIAL_DOMESTIC_PROFILE.tariff,
      };
    }
    if (sessionData?.persona) {
      return {
        ...INITIAL_DOMESTIC_PROFILE,
        name: sessionData.persona.name || INITIAL_DOMESTIC_PROFILE.name,
        bescomId: sessionData.persona.bescomId || sessionData.persona.consumerId || INITIAL_DOMESTIC_PROFILE.bescomId,
        meterNo: sessionData.persona.meterNo || INITIAL_DOMESTIC_PROFILE.meterNo,
        zone: sessionData.persona.zone || INITIAL_DOMESTIC_PROFILE.zone,
        sanctionedLoad: sessionData.persona.sanctionedLoad || INITIAL_DOMESTIC_PROFILE.sanctionedLoad,
        tariff: sessionData.persona.tariff || INITIAL_DOMESTIC_PROFILE.tariff,
      };
    }
    return INITIAL_DOMESTIC_PROFILE;
  };

  // Consumer Profile & Credits State
  const [profile, setProfile] = useState(getInitialProfile);
  const [greenCredits, setGreenCredits] = useState(INITIAL_DOMESTIC_PROFILE.greenCredits); // 1240 pts
  const [kpis, setKpis] = useState(INITIAL_DOMESTIC_KPIS);
  const [appliances, setAppliances] = useState(INITIAL_APPLIANCE_BREAKDOWN);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setProfile(getInitialProfile());
  }, [sessionData]);

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatted real date and time strings
  const formattedDate = now.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Interactive States
  const [rebateApplied, setRebateApplied] = useState(0);
  const [isSmartPlugOptimized, setIsSmartPlugOptimized] = useState(false);
  const [redeemedRewardIds, setRedeemedRewardIds] = useState([]);
  const [appliedHabitIds, setAppliedHabitIds] = useState([]);

  // Modals
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [activeRedeemedReward, setActiveRedeemedReward] = useState(null);
  const [activeVoucherCode, setActiveVoucherCode] = useState('');
  
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [isCreditsGuideOpen, setIsCreditsGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // 1. Handle Bill OCR Extraction (simulated or real upload)
  const handleBillExtracted = (billData) => {
    // Update KPIs based on the parsed bill
    setKpis((prev) => ({
      ...prev,
      unitsConsumedKWh: billData.units,
      estimatedMonthlyBill: billData.amount,
      previousMonthBill: Math.round(billData.amount * 1.14),
    }));

    // Update Appliance breakdown percentages if provided
    if (billData.detectedAppliances) {
      setAppliances((prev) =>
        prev.map((app) => {
          if (app.id === 'ac') {
            return {
              ...app,
              sharePct: billData.detectedAppliances.ac,
              kwh: Number(((billData.detectedAppliances.ac / 100) * billData.units).toFixed(1)),
              costInr: Math.round(((billData.detectedAppliances.ac / 100) * billData.amount)),
            };
          }
          if (app.id === 'water_heater') {
            return {
              ...app,
              sharePct: billData.detectedAppliances.waterHeater,
              kwh: Number(((billData.detectedAppliances.waterHeater / 100) * billData.units).toFixed(1)),
              costInr: Math.round(((billData.detectedAppliances.waterHeater / 100) * billData.amount)),
            };
          }
          if (app.id === 'standby_waste') {
            return {
              ...app,
              sharePct: billData.detectedAppliances.standby,
              kwh: Number(((billData.detectedAppliances.standby / 100) * billData.units).toFixed(1)),
              costInr: Math.round(((billData.detectedAppliances.standby / 100) * billData.amount)),
            };
          }
          if (app.id === 'refrig_lighting') {
            return {
              ...app,
              sharePct: billData.detectedAppliances.others,
              kwh: Number(((billData.detectedAppliances.others / 100) * billData.units).toFixed(1)),
              costInr: Math.round(((billData.detectedAppliances.others / 100) * billData.amount)),
            };
          }
          return app;
        })
      );
    }

    // Award bonus green credits for syncing monthly bill
    setGreenCredits((prev) => prev + 50);
    showToast(`⚡ OCR Parsed ${billData.units} Units for RR ${billData.rrNumber}! +50 Green Credits awarded.`);
  };

  // 2. Handle Smart Plug Cutoff Simulation
  const handleToggleSmartPlug = () => {
    setIsSmartPlugOptimized((prev) => {
      const next = !prev;
      if (next) {
        setGreenCredits((c) => c + 30);
        showToast("🔌 Smart Plug Cutoff Activated: Standby waste reduced from 16% to 6%! Earned +30 Green Credits.");
      } else {
        showToast("Smart Plug Schedule Paused.");
      }
      return next;
    });
  };

  // 3. Handle Redeeming Green Credits
  const handleRedeemReward = (reward) => {
    if (greenCredits < reward.creditsCost) {
      showToast("Insufficient Green Credits for this reward.");
      return;
    }

    // Deduct credits
    setGreenCredits((prev) => prev - reward.creditsCost);
    setRedeemedRewardIds((prev) => [...prev, reward.id]);

    // Generate random realistic voucher code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `${reward.voucherPrefix}-${randomSuffix}`;
    setActiveVoucherCode(code);
    setActiveRedeemedReward(reward);
    setIsRedeemModalOpen(true);

    // If it's BESCOM bill rebate, subtract ₹150 from monthly bill
    if (reward.id === 'reward_bescom_rebate') {
      setRebateApplied((prev) => prev + 150);
      showToast("🎉 ₹150 BESCOM Rebate Applied! Your estimated bill has been discounted.");
    } else {
      showToast(`🎉 Redeemed "${reward.title}" for ${reward.creditsCost} Green Credits!`);
    }
  };

  // 4. Handle UrjaAI Copilot Habit Shift Application
  const handleApplyHabit = (tip) => {
    if (appliedHabitIds.includes(tip.id)) return;

    setAppliedHabitIds((prev) => [...prev, tip.id]);
    setGreenCredits((prev) => prev + tip.creditsReward);
    showToast(`🌟 Habit scheduled: "${tip.title}". +${tip.creditsReward} Namma Green Credits added to your account!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white text-slate-900 px-4 py-3 rounded-xl border border-blue-400 shadow-xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold leading-tight flex-1 text-slate-800">
            {toastMessage}
          </p>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header & Navigation */}
      <DomesticHeader 
        profile={profile}
        greenCredits={greenCredits}
        onOpenCreditsModal={() => setIsCreditsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Welcome Sub-Bar with Real-Time & Date */}
        <div className="bg-white rounded-xl p-3.5 px-4 border border-blue-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
            <span className="text-slate-600">
              Welcome back, <strong className="text-slate-900 font-bold">{profile.name}</strong> • Connected to <strong className="text-blue-700 font-bold">{profile.substation}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-600 text-[11px] font-mono flex-wrap">
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md border border-blue-200 font-bold">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{formattedDate}</span>
              <span className="text-slate-300">•</span>
              <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>{formattedTime} IST</span>
            </div>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <div className="flex items-center gap-1 text-slate-500">
              <span>Cycle: <strong className="text-slate-700">{profile.cycleDates}</strong></span>
              <span>•</span>
              <span className="text-blue-700 font-bold">{profile.daysRemainingInCycle} days left</span>
            </div>
          </div>
        </div>

        {/* 2. KPI Cards Row */}
        <section aria-label="Key Performance Indicators">
          <DomesticKpiCards 
            kpis={kpis}
            onOpenTariffModal={() => setIsTariffModalOpen(true)}
            rebateApplied={rebateApplied}
          />
        </section>

        {/* 3. Main Content Area (2-Column Grid) */}
        <section aria-label="Bill Parsing and Energy Management" className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* LEFT COLUMN: Bill Parsing & Breakdown */}
          <div className="space-y-6">
            {/* Drag-and-drop OCR Bill Upload zone */}
            <DomesticBillOcr 
              onBillExtracted={handleBillExtracted}
              currentBillData={kpis}
            />

            {/* Estimated Appliance Energy Breakdown */}
            <DomesticApplianceBreakdown 
              appliances={appliances}
              isSmartPlugOptimized={isSmartPlugOptimized}
              onToggleSmartPlug={handleToggleSmartPlug}
              totalUnits={kpis.unitsConsumedKWh}
            />
          </div>

          {/* RIGHT COLUMN: Rewards & Incentives */}
          <div className="space-y-6">
            {/* Gamified "Redeem Green Credits" panel */}
            <DomesticGreenCreditsRewards 
              greenCredits={greenCredits}
              onRedeemReward={handleRedeemReward}
              redeemedRewardIds={redeemedRewardIds}
              onOpenCreditsModal={() => setIsCreditsGuideOpen(true)}
            />

            {/* AI-driven tip box suggesting off-peak habit shifts */}
            <DomesticUrjaAiCopilot 
              onApplyHabit={handleApplyHabit}
              appliedHabitIds={appliedHabitIds}
              onTriggerStandbyOptimization={setIsSmartPlugOptimized}
            />
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white mt-12 py-6 text-xs text-slate-500 font-mono shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-bold">SiliconUrja Domestic Portal</span>
            <span>•</span>
            <span>Bengaluru Residential Demand Flexibility Hub</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
            <span>BESCOM Smart Feed v3.2</span>
            <span>•</span>
            <span>KERC LT-2a Compliant</span>
            <span>•</span>
            <span>NILM AI Disaggregation Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DomesticRedeemModal 
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        reward={activeRedeemedReward}
        voucherCode={activeVoucherCode}
      />

      <TariffBreakdownModal 
        isOpen={isTariffModalOpen}
        onClose={() => setIsTariffModalOpen(false)}
        kpis={kpis}
        profile={profile}
        rebateApplied={rebateApplied}
      />

      <DomesticCreditsGuideModal 
        isOpen={isCreditsGuideOpen}
        onClose={() => setIsCreditsGuideOpen(false)}
        greenCredits={greenCredits}
        profile={profile}
      />

    </div>
  );
}
