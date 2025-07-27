'use client';

import { PlanMetadata } from '@/types/plan';
import { Button } from '@/components/ui/button';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import PlanSelector from '@/components/teamplan/PlanSelector';

interface SidebarHeaderProps {
  // Plan management (always visible)
  currentPlan: PlanMetadata | null;
  allPlans: PlanMetadata[];
  onSelectPlan: (planId: string) => void;
  onCreatePlan: (name: string) => void;
  onDeletePlan: (planId: string) => void;
  onRenamePlan: (planId: string, newName: string) => void;
  
  
  // Full-screen toggle (notepad only)
  isNotePadFullScreen?: boolean;
  onToggleNotePadFullScreen?: () => void;
  showFullScreenToggle?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  currentPlan,
  allPlans,
  onSelectPlan,
  onCreatePlan,
  onDeletePlan,
  onRenamePlan,
  isNotePadFullScreen,
  onToggleNotePadFullScreen,
  showFullScreenToggle,
}) => {

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
      
      <div className="flex items-center gap-2">
        {/* Full-screen Toggle Button */}
        {showFullScreenToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            onClick={onToggleNotePadFullScreen}
            title={isNotePadFullScreen ? "Exit full screen" : "Full screen"}
          >
            {isNotePadFullScreen ? (
              <ArrowsPointingInIcon className="h-4 w-4" />
            ) : (
              <ArrowsPointingOutIcon className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;