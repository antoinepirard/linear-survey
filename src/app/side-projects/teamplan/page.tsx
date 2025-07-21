'use client';

import { useState } from 'react';
import TeamPlanBoard from '@/components/teamplan/TeamPlanBoard';
import NotePad from '@/components/teamplan/NotePad';
import VerticalNavigation from '@/components/teamplan/VerticalNavigation';
import PlanSelector from '@/components/teamplan/PlanSelector';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { TeamPlanData } from '@/data/teamplan';

export default function TeamPlanPage() {
  const [isNotepadExpanded, setIsNotepadExpanded] = useState(true);
  const {
    isLoading,
    currentPlan,
    allPlans,
    createPlan,
    deletePlan,
    switchToPlan,
    updateCurrentPlan
  } = usePlanStorage();

  const handleDataChange = (newData: TeamPlanData) => {
    console.log('🔄 TeamPlanPage: handleDataChange called');
    console.log('🔄 TeamPlanPage: New data projects count:', newData.projects?.length || 0);
    console.log('🔄 TeamPlanPage: New data:', newData);
    
    updateCurrentPlan({ teamPlanData: newData });
  };

  const handleToggleNotepad = () => {
    setIsNotepadExpanded(!isNotepadExpanded);
  };

  const handleOpenBacklog = () => {
    // Future functionality placeholder
    console.log('Backlog functionality coming soon...');
  };

  if (isLoading) {
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
      {/* Left Panel: Plan Header + Navigation + Notepad */}
      <div className="flex flex-col border-r border-slate-200/65">
        {/* Plan Selector Header */}
        <div className="bg-white border-b border-slate-200/65 px-4 py-2 flex-shrink-0">
          <PlanSelector
            currentPlan={currentPlan}
            allPlans={allPlans}
            onSelectPlan={switchToPlan}
            onCreatePlan={createPlan}
            onDeletePlan={deletePlan}
          />
        </div>
        
        {/* Navigation + Notepad */}
        <div className="flex flex-1">
          <VerticalNavigation 
            isNotepadExpanded={isNotepadExpanded}
            onToggleNotepad={handleToggleNotepad}
            onOpenBacklog={handleOpenBacklog}
          />
          <NotePad 
            className="flex-shrink-0" 
            isExpanded={isNotepadExpanded}
            onToggle={handleToggleNotepad}
            currentPlan={currentPlan}
            onUpdatePlan={updateCurrentPlan}
          />
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