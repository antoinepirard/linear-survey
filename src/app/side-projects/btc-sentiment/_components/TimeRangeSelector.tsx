"use client";

import { TimeRange, TimeRangeOption } from "../_types";

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: "30d", label: "30D", days: 30 },
  { value: "90d", label: "90D", days: 90 },
  { value: "1y", label: "1Y", days: 365 },
  { value: "2y", label: "2Y", days: 730 },
  { value: "3y", label: "3Y", days: 1095 },
  { value: "5y", label: "5Y", days: 1825 },
  { value: "max", label: "MAX", days: "max" },
];

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-0.5">
      {TIME_RANGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-2 py-1 text-xs font-mono font-medium rounded transition-all ${
            value === option.value
              ? "bg-white/10 text-white"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
