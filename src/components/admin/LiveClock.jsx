import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function LiveClock({ compact = false }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });

  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: compact ? undefined : 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  if (compact) {
    return (
      <div className="flex items-center space-x-3 text-xs font-mono">
        <div className="flex items-center space-x-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-blue-800 font-black tracking-wider text-sm">{timeStr}</span>
          <span className="text-blue-500 text-[10px] font-bold">IST</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-blue-700 font-semibold">{dateStr}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <div className="text-2xl font-black font-mono text-blue-700 tracking-widest leading-none">
        {timeStr}
        <span className="text-sm font-bold text-blue-400 ml-1.5">IST</span>
      </div>
      <div className="text-xs font-mono text-blue-500 mt-0.5">{dateStr}</div>
    </div>
  );
}
