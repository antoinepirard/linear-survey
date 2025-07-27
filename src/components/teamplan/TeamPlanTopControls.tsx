'use client';

import { memo } from 'react';
import { Tabs as ShadcnTabs, TabsList, TabsTrigger } from '@/components/ui/shadcn-tabs';

interface TeamPlanTopControlsProps {
  className?: string;
}

const TeamPlanTopControls = ({ 
  className = ""
}: TeamPlanTopControlsProps) => {
  return (
    <div className={`w-full bg-white border-b border-slate-200/65 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <ShadcnTabs defaultValue="plan" className="w-fit">
            <TabsList>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="canvas" disabled className="opacity-50 cursor-not-allowed">
                Canvas
              </TabsTrigger>
            </TabsList>
          </ShadcnTabs>
          {/* Future: Could add action buttons, filters, or other controls here */}
        </div>
      </div>
    </div>
  );
};

export default memo(TeamPlanTopControls);