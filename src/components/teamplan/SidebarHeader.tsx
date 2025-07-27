'use client';

import { useState } from 'react';
import { PlanMetadata } from '@/types/plan';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import PlanSelector from '@/components/teamplan/PlanSelector';

interface SidebarHeaderProps {
  // Plan management (always visible)
  currentPlan: PlanMetadata | null;
  allPlans: PlanMetadata[];
  onSelectPlan: (planId: string) => void;
  onCreatePlan: (name: string) => void;
  onDeletePlan: (planId: string) => void;
  onRenamePlan: (planId: string, newName: string) => void;
  
  // Settings (always visible)
  isColorCodingEnabled: boolean;
  onColorCodingChange: (enabled: boolean) => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  currentPlan,
  allPlans,
  onSelectPlan,
  onCreatePlan,
  onDeletePlan,
  onRenamePlan,
  isColorCodingEnabled,
  onColorCodingChange,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="bg-transparent border-b border-slate-200/65 px-4 flex-shrink-0 flex items-center justify-between" style={{ paddingTop: '7px', paddingBottom: '7px' }}>
      <div className="flex items-center gap-3">
        <PlanSelector
          currentPlan={currentPlan}
          allPlans={allPlans}
          onSelectPlan={onSelectPlan}
          onCreatePlan={onCreatePlan}
          onDeletePlan={onDeletePlan}
          onRenamePlan={onRenamePlan}
        />
      </div>
      
      {/* Settings Button */}
      <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
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
    </div>
  );
};

export default SidebarHeader;