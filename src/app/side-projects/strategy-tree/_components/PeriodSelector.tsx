'use client';

import { useState, useCallback } from 'react';
import { ChevronDownIcon, CalendarIcon } from '@heroicons/react/24/outline';
import type { NodePeriod, PeriodType } from '../_types';
import { PERIOD_TYPE_CONFIG, getCurrentYear } from '../_types';

interface PeriodSelectorProps {
  value?: NodePeriod;
  onChange: (period: NodePeriod) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentYear = getCurrentYear();
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  
  // Default values
  const periodType = value?.type || 'quarter';
  const year = value?.year || currentYear;
  const periodValue = value?.value || 'Q1';

  const handleTypeChange = useCallback((type: PeriodType) => {
    const config = PERIOD_TYPE_CONFIG[type];
    const newValue = type === 'date' 
      ? new Date().toISOString().split('T')[0]
      : config.options[0];
    
    onChange({
      type,
      year,
      value: newValue,
    });
  }, [year, onChange]);

  const handleYearChange = useCallback((newYear: number) => {
    onChange({
      type: periodType,
      year: newYear,
      value: periodValue,
    });
  }, [periodType, periodValue, onChange]);

  const handleValueChange = useCallback((newValue: string) => {
    onChange({
      type: periodType,
      year,
      value: newValue,
    });
  }, [periodType, year, onChange]);

  const getDisplayValue = () => {
    if (!value) return 'Select period';
    if (value.type === 'date') {
      const date = new Date(value.value);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return `${value.value} ${value.year}`;
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span className={value ? 'text-slate-900' : 'text-slate-400'}>
            {getDisplayValue()}
          </span>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white rounded-lg border border-slate-200 shadow-lg p-3 space-y-3">
            {/* Period Type Selector */}
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Type
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(Object.keys(PERIOD_TYPE_CONFIG) as PeriodType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`px-2 py-1.5 text-[11px] font-medium rounded transition-colors ${
                      periodType === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'date' ? 'Date' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Selector (not shown for date type) */}
            {periodType !== 'date' && (
              <div>
                <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                  Year
                </label>
                <div className="flex gap-1">
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => handleYearChange(y)}
                      className={`flex-1 px-2 py-1.5 text-[11px] font-medium rounded transition-colors ${
                        year === y
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Period Value Selector */}
            <div>
              <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                {periodType === 'date' ? 'Date' : 'Period'}
              </label>
              
              {periodType === 'date' ? (
                <input
                  type="date"
                  value={periodValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : periodType === 'month' ? (
                <div className="grid grid-cols-4 gap-1">
                  {PERIOD_TYPE_CONFIG.month.options.map((month) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => {
                        handleValueChange(month);
                        setIsOpen(false);
                      }}
                      className={`px-2 py-1.5 text-[11px] font-medium rounded transition-colors ${
                        periodValue === month
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`grid gap-1 ${periodType === 'half' ? 'grid-cols-2' : 'grid-cols-4'}`}>
                  {PERIOD_TYPE_CONFIG[periodType].options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        handleValueChange(opt);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                        periodValue === opt
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Done button for date picker */}
            {periodType === 'date' && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

