'use client';

import { memo } from 'react';
import { Tabs as ShadcnTabs, TabsList, TabsTrigger } from '@/components/ui/shadcn-tabs';
import { Button } from '@/components/ui/button';

interface TeamPlanTopControlsProps {
  className?: string;
}

const TeamPlanTopControls = ({ 
  className = ""
}: TeamPlanTopControlsProps) => {
  return (
    <div className={`w-full bg-white border-b border-slate-200/65 ${className}`}>
      <div className="px-6 py-[7px]">
        <div className="flex items-center justify-between">
          <ShadcnTabs defaultValue="plan" className="w-fit">
            <TabsList>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="canvas" disabled className="opacity-50 cursor-not-allowed">
                Canvas
              </TabsTrigger>
            </TabsList>
          </ShadcnTabs>
          <Button size="sm">
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(TeamPlanTopControls);