import React from 'react';
import { 
  Award, 
  Leaf, 
  IndianRupee, 
  Zap, 
  Train, 
  ShieldCheck, 
  Receipt, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Gift,
  History
} from 'lucide-react';
import { AVAILABLE_REWARDS } from './domesticData';

export default function DomesticGreenCreditsRewards({ 
  greenCredits, 
  onRedeemReward, 
  redeemedRewardIds = [], 
  onOpenCreditsModal 
}) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Receipt':
        return <Receipt className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Train':
        return <Train className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Gift className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Redeem Green Credits</span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                Gamified Rewards
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Exchange your peak-avoidance credits for utility bill waivers & clean home tech.
          </p>
        </div>

        <button
          onClick={onOpenCreditsModal}
          className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <History className="w-3.5 h-3.5" />
          <span>Reward Ledger</span>
        </button>
      </div>

      {/* Hero Balance Ribbon - Royal Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-xl p-4 mb-4 flex items-center justify-between shadow-md shadow-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-blue-100 uppercase tracking-wider font-semibold">
              Available to Redeem
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-white">
                {greenCredits.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-cyan-200 font-mono">pts</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-blue-200 block">Tier Status</span>
          <span className="text-xs font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 inline-block mt-0.5">
            Champion Tier
          </span>
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AVAILABLE_REWARDS.map((reward) => {
          const isRedeemed = redeemedRewardIds.includes(reward.id);
          const canAfford = greenCredits >= reward.creditsCost;

          return (
            <div
              key={reward.id}
              className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                isRedeemed
                  ? 'bg-slate-50 border-emerald-300 opacity-90'
                  : canAfford
                  ? 'bg-white hover:bg-blue-50/40 border-slate-200 hover:border-blue-300 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200 opacity-70'
              }`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    reward.id === 'reward_bescom_rebate'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : reward.id === 'reward_smart_plug'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    {getIcon(reward.iconName)}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {reward.highlight}
                  </span>
                </div>

                {/* Title & Partner */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {reward.title}
                </h4>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  {reward.partner}
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {reward.description}
                </p>
              </div>

              {/* Bottom Row: Cost & Action Button */}
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-black text-blue-700">
                    {reward.creditsCost}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono ml-1 font-medium">pts</span>
                </div>

                <button
                  disabled={isRedeemed || !canAfford}
                  onClick={() => onRedeemReward(reward)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isRedeemed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : canAfford
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isRedeemed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Redeemed</span>
                    </>
                  ) : canAfford ? (
                    <>
                      <span>Redeem</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  ) : (
                    <span>Need {reward.creditsCost - greenCredits} pts</span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Rebate Note */}
      <div className="mt-3 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 text-[11px] text-slate-600 flex items-center justify-between font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Redeemed BESCOM rebates auto-deduct from your active cycle statement.</span>
        </span>
      </div>

    </div>
  );
}
