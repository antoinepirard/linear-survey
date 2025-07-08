'use client';

import { useState, useEffect } from 'react';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { motion } from 'motion/react';

export default function LocationTime() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [timezoneInfo, setTimezoneInfo] = useState<{ timezone: string; offset: string }>({ timezone: '', offset: '' });
  const [isTimeLoading, setIsTimeLoading] = useState(true);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [locationPhase, setLocationPhase] = useState<'pin' | 'flag' | 'text'>('pin');
  const [isHoveringLocation, setIsHoveringLocation] = useState(false);

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
      setIsTimeLoading(false);
    };

    // Subtle loading delay for time
    const timeLoadingTimeout = setTimeout(() => {
      updateTime();
    }, 400);

    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => {
      clearTimeout(timeLoadingTimeout);
      clearInterval(interval);
    };
  }, []);

  // Location loading simulation with phases
  useEffect(() => {
    // Phase 1: Show pin for 300ms
    const pinTimeout = setTimeout(() => {
      setLocationPhase('flag');
    }, 300);

    // Phase 2: Show EU flag for 1000ms
    const flagTimeout = setTimeout(() => {
      setLocationPhase('text');
    }, 1300);

    // Phase 3: Show Belgium text
    const textTimeout = setTimeout(() => {
      setIsLocationLoading(false);
    }, 1600);

    return () => {
      clearTimeout(pinTimeout);
      clearTimeout(flagTimeout);
      clearTimeout(textTimeout);
    };
  }, []);


  return (
    <div className="flex items-center gap-3 text-slate-500">
      <div className="flex items-center gap-1">
        <motion.div
          className="w-4 h-4 flex items-center justify-center"
          transition={{ duration: 0.3 }}
        >
          {locationPhase === 'pin' && (
            <motion.div
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.3 }}
            >
              <MapPinIcon className="h-4 w-4 text-slate-400" />
            </motion.div>
          )}
          {locationPhase === 'flag' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              🇪🇺
            </motion.span>
          )}
          {locationPhase === 'text' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isHoveringLocation ? 1.1 : 1 
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="text-sm"
            >
              {isHoveringLocation ? '🇪🇺' : '🇧🇪'}
            </motion.span>
          )}
        </motion.div>
        <div className="w-14 text-sm font-regular">
          <motion.div
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHoveringLocation(true)}
            onMouseLeave={() => setIsHoveringLocation(false)}
          >
            {locationPhase === 'pin' && (
              <motion.span
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.3 }}
              >
                Locating
              </motion.span>
            )}
            {locationPhase === 'flag' && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                Europe
              </motion.span>
            )}
            {locationPhase === 'text' && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: isLocationLoading ? 0.4 : 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isHoveringLocation ? 'Europe' : 'Belgium'}
              </motion.span>
            )}
          </motion.div>
        </div>
      </div>
      
      <div className="w-px h-4 bg-slate-200" />
      <div className="flex items-center gap-1 relative group cursor-help">
        <ClockIcon className="h-4 w-4 text-slate-400" />
        <div className="w-10 text-sm font-regular">
          <motion.span
            animate={{ opacity: isTimeLoading ? 0.4 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentTime || '--:--'}
          </motion.span>
        </div>
        
        {/* Timezone tooltip */}
        {!isTimeLoading && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            <span className="text-slate-300">{timezoneInfo.timezone}</span>
            <span className="ml-1 font-medium text-white">GMT{timezoneInfo.offset}</span>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}
