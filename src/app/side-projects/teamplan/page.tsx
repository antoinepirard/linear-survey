'use client';

import { useState } from 'react';
import TeamPlanBoard from '@/components/teamplan/TeamPlanBoard';
import NotePad from '@/components/teamplan/NotePad';
import VerticalNavigation from '@/components/teamplan/VerticalNavigation';
import PlanSelector from '@/components/teamplan/PlanSelector';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { useResizable } from '@/hooks/useResizable';
import { usePlanNotePadStorage } from '@/hooks/usePlanNotePadStorage';
import { TeamPlanData } from '@/data/teamplan';
import { PuzzlePieceIcon } from '@heroicons/react/24/solid';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';
import { motion, AnimatePresence } from 'motion/react';

export default function TeamPlanPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const {
    isLoading,
    currentPlan,
    allPlans,
    createPlan,
    deletePlan,
    switchToPlan,
    updateCurrentPlan
  } = usePlanStorage();

  // Sidebar width management
  const {
    width: sidebarWidth,
    setWidth: setSidebarWidth,
    isLoading: isStorageLoading,
  } = usePlanNotePadStorage({
    currentPlan,
    onUpdatePlan: updateCurrentPlan,
    defaultWidth: NOTEPAD_CONSTANTS.DEFAULT_WIDTH,
    minWidth: NOTEPAD_CONSTANTS.MIN_WIDTH,
    maxWidth: NOTEPAD_CONSTANTS.MAX_WIDTH,
  });

  // Sidebar resize functionality
  const { isResizing, handleResizeStart } = useResizable({
    initialWidth: sidebarWidth,
    minWidth: NOTEPAD_CONSTANTS.MIN_WIDTH,
    maxWidth: NOTEPAD_CONSTANTS.MAX_WIDTH,
    onWidthChange: setSidebarWidth,
  });

  const handleDataChange = (newData: TeamPlanData) => {
    console.log('🔄 TeamPlanPage: handleDataChange called');
    console.log('🔄 TeamPlanPage: New data projects count:', newData.projects?.length || 0);
    console.log('🔄 TeamPlanPage: New data:', newData);
    
    updateCurrentPlan({ teamPlanData: newData });
  };

  const handleToggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleOpenBacklog = () => {
    // Future functionality placeholder
    console.log('Backlog functionality coming soon...');
  };

  if (isLoading || isStorageLoading) {
    return (
      <div className="h-screen bg-slate-50/30 overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
          <p className="text-slate-600 text-sm">Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="h-screen bg-slate-50/75 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No plan found</p>
          <button
            onClick={() => createPlan('My First Plan')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Your First Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50/75 overflow-hidden flex">
      {/* Sidebar Container with Resize */}
      <div className="relative flex">
        <AnimatePresence mode="wait">
          {isSidebarExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: sidebarWidth, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={
                isResizing 
                  ? { 
                      type: "tween",
                      duration: 0.05,
                      ease: "easeOut"
                    } 
                  : { 
                      type: "spring", 
                      stiffness: NOTEPAD_CONSTANTS.SPRING_CONFIG.stiffness, 
                      damping: NOTEPAD_CONSTANTS.SPRING_CONFIG.damping,
                      opacity: { duration: NOTEPAD_CONSTANTS.OPACITY_DURATION }
                    }
              }
              className={`flex flex-col overflow-hidden ${
                isResizing ? 'border-r border-blue-500' : 'border-r border-slate-200/65'
              }`}
            >
              {/* Plan Selector Header */}
              <div className="bg-white border-b border-slate-200/65 px-4 py-2 flex-shrink-0 flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <PuzzlePieceIcon className="w-5 h-5 text-slate-900" />
                </div>
                <PlanSelector
                  currentPlan={currentPlan}
                  allPlans={allPlans}
                  onSelectPlan={switchToPlan}
                  onCreatePlan={createPlan}
                  onDeletePlan={deletePlan}
                />
              </div>
              
              {/* Navigation + Notepad */}
              <div className="flex flex-1 min-h-0">
                <VerticalNavigation 
                  isSidebarExpanded={isSidebarExpanded}
                  onToggleSidebar={handleToggleSidebar}
                  onOpenBacklog={handleOpenBacklog}
                />
                <NotePad 
                  width={sidebarWidth - 48} // Subtract navigation width (48px = 12px width + borders)
                  currentPlan={currentPlan}
                  onUpdatePlan={updateCurrentPlan}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Sidebar - Show only logo */}
        {!isSidebarExpanded && (
          <div className="w-12 h-full bg-white border-r border-slate-200/65 flex flex-col">
            {/* Logo Section */}
            <div className="bg-white border-b border-slate-200/65 px-2 py-2 flex-shrink-0 flex items-center justify-center">
              <div className="w-8 h-8 flex items-center justify-center">
                <PuzzlePieceIcon className="w-5 h-5 text-slate-900" />
              </div>
            </div>
            
            {/* Navigation */}
            <VerticalNavigation 
              isSidebarExpanded={isSidebarExpanded}
              onToggleSidebar={handleToggleSidebar}
              onOpenBacklog={handleOpenBacklog}
            />
          </div>
        )}

        {/* Resize Handle - Only show when sidebar is expanded */}
        {isSidebarExpanded && (
          <div
            onMouseDown={handleResizeStart}
            className="absolute top-0 w-4 h-full cursor-col-resize flex items-center justify-center z-50"
            style={{ left: sidebarWidth }}
            role="separator"
            aria-label="Resize sidebar"
            aria-orientation="vertical"
          >
            <div
              className={`w-1 h-6 rounded-full transition-colors duration-150 ${
                isResizing ? 'bg-blue-500' : 'bg-slate-200 hover:bg-blue-400 hover:shadow-blue-100'
              }`}
            />
          </div>
        )}
      </div>
      
      {/* Team Plan Board */}
      <div className="flex-1 overflow-hidden">
        <TeamPlanBoard 
          data={currentPlan.teamPlanData}
          onChange={handleDataChange}
        />
      </div>
    </div>
  );
}