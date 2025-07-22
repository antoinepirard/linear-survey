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
import { CubeIcon } from '@heroicons/react/24/solid';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';

export default function TeamPlanPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const {
    isLoading,
    currentPlan,
    allPlans,
    createPlan,
    deletePlan,
    switchToPlan,
    updateCurrentPlan,
    renamePlan
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
      <div className="relative flex p-3">
        <div className="relative flex bg-white rounded-md shadow-md ring-1 ring-slate-200/50 overflow-visible">
          {/* Always present navigation - no animation */}
          <div className="w-12 h-full bg-transparent border-r border-slate-200/65 flex flex-col flex-shrink-0">
            {/* Logo/Header Section */}
            <div className="bg-transparent px-2 py-3 flex-shrink-0 flex items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <CubeIcon className="w-5 h-5 text-slate-900" />
            </div>
            </div>
            
            {/* Navigation */}
            <VerticalNavigation 
              isSidebarExpanded={isSidebarExpanded}
              onToggleSidebar={handleToggleSidebar}
              onOpenBacklog={handleOpenBacklog}
            />
          </div>

          {/* Expandable content area */}
          {isSidebarExpanded && (
            <div
              style={{ width: sidebarWidth - 48 }} // Subtract navigation width
              className="flex flex-col overflow-hidden"
            >
                {/* Plan Selector Header */}
                <div className="bg-transparent border-b border-slate-200/65 px-4 flex-shrink-0 flex items-center" style={{ paddingTop: '7px', paddingBottom: '7px' }}>
                <PlanSelector
                  currentPlan={currentPlan}
                  allPlans={allPlans}
                  onSelectPlan={switchToPlan}
                  onCreatePlan={createPlan}
                  onDeletePlan={deletePlan}
                  onRenamePlan={renamePlan}
                />
              </div>
              
                {/* Notepad */}
                <NotePad 
                  width={sidebarWidth - 48} // Subtract navigation width (48px = 12px width + borders)
                  currentPlan={currentPlan}
                  onUpdatePlan={updateCurrentPlan}
                />
            </div>
          )}

          {/* Resize Handle - Only show when sidebar is expanded */}
          {isSidebarExpanded && (
            <div
              onMouseDown={handleResizeStart}
              className="absolute top-0 w-4 h-full cursor-col-resize flex items-center justify-center z-50"
              style={{ right: -8 }}
              role="separator"
              aria-label="Resize sidebar"
              aria-orientation="vertical"
            >
              <div
                className={`w-1.5 h-6 rounded-full transition-colors duration-150 ${
                  isResizing ? 'bg-blue-500 shadow-sm' : 'bg-slate-300 hover:bg-blue-400 hover:shadow-sm'
                }`}
              />
            </div>
          )}
        </div>
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