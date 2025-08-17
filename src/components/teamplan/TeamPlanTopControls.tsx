'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import { Tabs as ShadcnTabs, TabsList, TabsTrigger } from '@/components/ui/shadcn-tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

interface TeamPlanTopControlsProps {
  className?: string;
  isColorCodingEnabled?: boolean;
  onColorCodingChange?: (enabled: boolean) => void;
}

const TeamPlanTopControls = ({ 
  className = "",
  isColorCodingEnabled,
  onColorCodingChange
}: TeamPlanTopControlsProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
          
          <div className="flex items-center gap-2">
            {/* Settings Button */}
            {isColorCodingEnabled !== undefined && onColorCodingChange && (
              <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    title="Settings"
                  >
                    <Cog6ToothIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <span className="text-xs font-mono text-slate-900">Settings</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-slate-900">Color coding</span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Color code cards with identical values for easier reading.
                        </p>
                      </div>
                      <Switch
                        checked={isColorCodingEnabled}
                        onCheckedChange={onColorCodingChange}
                        className="ml-3"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            <Button variant="outline" size="sm">
              Share
            </Button>
            
            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
              <Image 
                src="/Assets/TeamPlan-Ravell/logo-light.svg" 
                alt="" 
                width={16}
                height={16}
                className="h-4 w-4"
              />
              Push
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TeamPlanTopControls);