import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Award, 
  Sparkles, 
  QrCode,
  ShieldCheck
} from 'lucide-react';

export default function DomesticRedeemModal({ 
  isOpen, 
  onClose, 
  reward, 
  voucherCode 
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !reward) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-blue-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with celebration icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-md">
            <Award className="w-7 h-7 text-blue-600 animate-bounce" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Reward Successfully Redeemed!</span>
          </div>

          <h3 className="text-xl font-black text-slate-900">
            {reward.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {reward.partner}
          </p>
        </div>

        {/* Voucher Box */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="font-mono">VOUCHER / DISCOUNT CODE</span>
            <span className="text-blue-700 font-bold">Valid for {reward.expiryDays || 30} days</span>
          </div>

          <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-lg border border-blue-200 font-mono text-blue-900 text-base font-black tracking-wider shadow-sm">
            <span>{voucherCode}</span>
            <button
              onClick={handleCopy}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded border border-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
            {reward.id === 'reward_bescom_rebate' ? (
              <span className="text-emerald-700 font-bold">
                ✓ Auto-Rebate Applied: ₹150 has been credited directly to Alex's monthly bill estimate on this dashboard!
              </span>
            ) : (
              <span>
                Apply this coupon code at checkout on partner portal or show this voucher QR code in-store.
              </span>
            )}
          </div>
        </div>

        {/* QR Code & Security Stamp */}
        <div className="mt-4 p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
              <QrCode className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <div className="text-slate-900 font-mono text-[11px] font-bold">
                BESCOM Verified Voucher
              </div>
              <div className="text-[10px] text-slate-500">
                Encrypted via SiliconUrja Smart Contract
              </div>
            </div>
          </div>
          <span className="text-blue-700 text-[10px] font-mono flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            KERC Auth
          </span>
        </div>

        {/* Close button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-colors cursor-pointer"
          >
            Done & Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
