'use client';

import { memo } from 'react';

interface TeamPlanTopControlsProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const TeamPlanTopControls = ({ 
  title = "Team Plan", 
  subtitle = "Manage projects and timelines across your team",
  className = ""
}: TeamPlanTopControlsProps) => {
  return (
    <div className={`w-full bg-white border-b border-slate-200/65 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
          {/* Future: Could add action buttons, filters, or other controls here */}
        </div>
      </div>
    </div>
  );
};

export default memo(TeamPlanTopControls);