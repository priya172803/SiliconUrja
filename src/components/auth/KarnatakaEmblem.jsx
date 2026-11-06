import React from 'react';

export const KarnatakaEmblem = ({ className = "w-10 h-10" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="46" fill="#0b2046" stroke="#fbbf24" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="41" fill="#0f295c" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
    
    {/* Ashoka Stambh Lion Capital silhouette top */}
    <path d="M43 22h14v3h-14z M45 18h10v4h-10z M47 14h6v4h-6z" fill="#fbbf24" />
    <circle cx="50" cy="27" r="3" fill="#22d3ee" />
    
    {/* Double Headed Eagle / Gandaberunda Wings & Body */}
    <path 
      d="M50 35 C42 35 34 40 28 47 C33 48 38 46 44 48 C38 52 32 58 30 66 C36 63 42 63 46 66 C48 68 49 74 50 78 C51 74 52 68 54 66 C58 63 64 63 70 66 C68 58 62 52 56 48 C62 46 67 48 72 47 C66 40 58 35 50 35 Z" 
      fill="#fbbf24" 
    />
    
    {/* Central Chakra */}
    <circle cx="50" cy="54" r="5" fill="#0b2046" stroke="#fbbf24" strokeWidth="1.5" />
    <circle cx="50" cy="54" r="1.5" fill="#22d3ee" />
    
    {/* Base motto banner */}
    <path d="M30 81 C38 78 62 78 70 81 L68 85 C60 82 40 82 32 85 Z" fill="#fbbf24" />
    <text x="50" y="93" textAnchor="middle" fill="#93c5fd" fontSize="6.5" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">
      GOVT OF KARNATAKA
    </text>
  </svg>
);

export const KPTCLLogo = ({ className = "w-9 h-9" }) => (
  <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-400/30 text-white shadow-sm ${className}`}>
    <div className="absolute inset-0 bg-blue-500/10 rounded-xl" />
    <div className="text-center">
      <span className="block text-[8px] font-extrabold tracking-widest text-cyan-400 leading-none">KPTCL</span>
      <span className="block text-[6px] font-semibold text-amber-300/90 tracking-tighter leading-tight">SLDC</span>
    </div>
  </div>
);
