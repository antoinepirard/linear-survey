'use client';

import { useState, useEffect } from 'react';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';

export default function LocationTime() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [timezoneInfo, setTimezoneInfo] = useState<{ timezone: string; offset: string }>({ timezone: '', offset: '' });

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const belgiumTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Brussels',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);
      
      // Get timezone offset for Brussels
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: 'Europe/Brussels',
        timeZoneName: 'longOffset'
      });
      const parts = formatter.formatToParts(now);
      const offsetPart = parts.find(part => part.type === 'timeZoneName');
      let gmtOffset = offsetPart ? offsetPart.value.replace('GMT', '') : '+2';
      // Remove minutes from offset (e.g., +02:00 -> +2)
      gmtOffset = gmtOffset.replace(':00', '').replace(/^([+-])0/, '$1');
      
      setCurrentTime(belgiumTime);
      setTimezoneInfo({ timezone: 'Europe/Brussels', offset: gmtOffset });
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex items-center gap-3 text-slate-500">
      <div className="flex items-center gap-1">
        <MapPinIcon className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-medium">Belgium</span>
      </div>
      
      <div className="w-px h-4 bg-slate-200" />
      <div className="flex items-center gap-1 relative group cursor-help">
        <ClockIcon className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-medium">{currentTime}</span>
        
        {/* Timezone tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          <span className="text-slate-300">{timezoneInfo.timezone}</span>
          <span className="ml-1 font-semibold text-white">GMT{timezoneInfo.offset}</span>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-900"></div>
        </div>
      </div>
    </div>
  );
}
