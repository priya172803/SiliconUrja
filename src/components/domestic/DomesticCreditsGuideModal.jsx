import React from 'react';
import { 
  X, 
  Award, 
  Leaf, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft
} from 'lucide-react';
import { CREDITS_TRANSACTION_HISTORY } from './domesticData';

export default function DomesticCreditsGuideModal({ 
  isOpen, 
  onClose, 
  greenCredits, 
  profile 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-blue-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Namma Green Credits Ledger</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                Bengaluru Rewards
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Incentivizing residential peak shaving for BESCOM HSR Layout substation.
            </p>
          </div>
        </div>

        {/* Active Balance Card - Blue Gradient */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-xl p-4 mb-5 flex items-center justify-between shadow-md shadow-blue-500/20">
          <div>
            <span className="text-xs font-mono text-blue-100 uppercase tracking-wider block font-bold">
              Active Verified Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-white">
                {greenCredits.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-bold text-cyan-200">pts</span>
            </div>
            <span className="text-xs text-blue-100 mt-1 block">
              Rank: <strong className="text-white">{profile.rankInNeighborhood}</strong>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-blue-200 block font-mono">Current Tier</span>
            <span className="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full border border-white/30 inline-flex items-center gap-1 mt-1">
              <Leaf className="w-3 h-3 text-emerald-300" />
              Green Champion
            </span>
          </div>
        </div>

        {/* How Credits Work */}
        <div className="space-y-3 mb-5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>How Alex Earns Namma Green Credits</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-blue-700 font-black font-mono">+40 pts</div>
              <div className="text-slate-900 font-bold mt-1">Off-Peak Shifts</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Moving geyser/laundry to solar afternoon or night valley.</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-indigo-700 font-black font-mono">+25 pts</div>
              <div className="text-slate-900 font-bold mt-1">Standby Kill</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Auto-cutting 16% vampire drain on TV/AV hubs overnight.</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-amber-700 font-black font-mono">+100 pts</div>
              <div className="text-slate-900 font-bold mt-1">OCR Bill Sync</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Paperless digital bill OCR upload every monthly cycle.</div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Recent Activity Log</span>
          </h4>

          <div className="space-y-2">
            {CREDITS_TRANSACTION_HISTORY.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    tx.type === 'credit'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold">{tx.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tx.date} • {tx.category}</div>
                  </div>
                </div>

                <div className={`font-mono font-bold ${
                  tx.type === 'credit' ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
          >
            Close Ledger
          </button>
        </div>

      </div>
    </div>
  );
}
