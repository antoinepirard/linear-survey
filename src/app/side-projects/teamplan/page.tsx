'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import TeamPlanBoard from '@/components/teamplan/TeamPlanBoard';
import NotePad from '@/components/teamplan/NotePad';
import BacklogPanel from '@/components/teamplan/BacklogPanel';
import CommentsPanel from '@/components/teamplan/CommentsPanel';
import VerticalNavigation from '@/components/teamplan/VerticalNavigation';
import PlanSelector from '@/components/teamplan/PlanSelector';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { useResizable } from '@/hooks/useResizable';
import { useNotePadStorage } from '@/hooks/useNotePadStorage';
import { TeamPlanData } from '@/data/teamplan';
import { CubeIcon } from '@heroicons/react/24/solid';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';
import SyncStatusIndicator from '@/components/teamplan/SyncStatusIndicator';
import { teamPlanLogger as logger } from '@/utils/logger';

export default function TeamPlanPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState<'notepad' | 'backlog' | 'comments'>('notepad');
  const [isColorCodingEnabled, setIsColorCodingEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Load color coding preference from localStorage on mount
  useEffect(() => {
    const savedColorCoding = localStorage.getItem('teamplan-color-coding-enabled');
    if (savedColorCoding !== null) {
      setIsColorCodingEnabled(JSON.parse(savedColorCoding));
    }
  }, []);

  // Save color coding preference to localStorage when it changes
  const handleColorCodingChange = (checked: boolean) => {
    setIsColorCodingEnabled(checked);
    localStorage.setItem('teamplan-color-coding-enabled', JSON.stringify(checked));
  };

  const handlePageLoadingComplete = () => {
    setIsPageLoading(false);
  };
  
  const {
    isLoading,
    currentPlan,
    allPlans,
    createPlan,
    deletePlan,
    switchToPlan,
    updateCurrentPlan,
    renamePlan,
    syncState,
    syncError,
    rollbackToLastSyncedState
  } = usePlanStorage();

  // Keyboard shortcuts for plan switching
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if user is currently typing in an input field or contenteditable element
    const activeElement = document.activeElement;
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('contenteditable') === 'true'
    );

    // Skip shortcuts if user is typing
    if (isTyping) {
      return;
    }

    // Only handle shortcuts if Shift is pressed with number keys
    if (event.shiftKey && event.key >= '1' && event.key <= '9') {
      event.preventDefault();
      const planIndex = parseInt(event.key) - 1;
      if (planIndex < allPlans.length) {
        const targetPlan = allPlans[planIndex];
        if (targetPlan && targetPlan.id !== currentPlan?.id) {
          switchToPlan(targetPlan.id);
        }
      }
    }
  }, [allPlans, currentPlan?.id, switchToPlan]);

  // Add and remove keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Sidebar width management
  const {
    width: sidebarWidth,
    setWidth: setSidebarWidth,
    isLoading: isStorageLoading,
  } = useNotePadStorage({
    contentKey: 'teamplan-sidebar-content', // Not used but required
    titleKey: 'teamplan-sidebar-title', // Not used but required
    widthKey: 'teamplan-sidebar-width',
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
    logger.debug('handleDataChange called', { 
      projectsCount: newData.projects?.length || 0,
      timeSlots: newData.timeSlots?.length || 0,
      people: newData.people?.length || 0
    });
    
    updateCurrentPlan({ teamPlanData: newData });
  };

  const handleDataSyncError = (originalData: TeamPlanData, errorData: TeamPlanData, error: Error) => {
    logger.error('Data sync error occurred', { 
      error: error.message,
      originalProjectsCount: originalData.projects?.length || 0,
      errorProjectsCount: errorData.projects?.length || 0
    });
    
    // TODO: When Jonny adds async operations, this will handle real sync errors
    // For now, this is a placeholder that demonstrates the error handling structure
  };

  const handleToggleSidebar = () => {
    if (activePanel === 'notepad' && isSidebarExpanded) {
      setIsSidebarExpanded(false);
    } else {
      setActivePanel('notepad');
      setIsSidebarExpanded(true);
    }
  };

  const handleToggleBacklog = () => {
    if (activePanel === 'backlog') {
      setIsSidebarExpanded(false);
    } else {
      setActivePanel('backlog');
      setIsSidebarExpanded(true);
    }
  };

  const handleToggleComments = () => {
    if (activePanel === 'comments') {
      setIsSidebarExpanded(false);
    } else {
      setActivePanel('comments');
      setIsSidebarExpanded(true);
    }
  };


  if (!currentPlan || isLoading || isStorageLoading) {
    return null;
  }

  return (
    <>
      {isPageLoading && <PageLoader onComplete={handlePageLoadingComplete} />}
      <div 
        className="h-screen bg-slate-50/75 overflow-hidden flex"
        style={{ display: isPageLoading ? 'none' : 'flex' }}
      >
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
              isSidebarExpanded={isSidebarExpanded && activePanel === 'notepad'}
              isBacklogExpanded={isSidebarExpanded && activePanel === 'backlog'}
              isCommentsExpanded={isSidebarExpanded && activePanel === 'comments'}
              onToggleSidebar={handleToggleSidebar}
              onToggleBacklog={handleToggleBacklog}
              onToggleComments={handleToggleComments}
            />
          </div>

          {/* Expandable content area */}
          {isSidebarExpanded && (
            <div
              style={{ width: sidebarWidth - 48 }} // Subtract navigation width
              className="flex flex-col overflow-hidden"
            >
                {/* Plan Selector Header */}
                <div className="bg-transparent border-b border-slate-200/65 px-4 flex-shrink-0 flex items-center justify-between" style={{ paddingTop: '7px', paddingBottom: '7px' }}>
                <div className="flex items-center gap-3">
                  <PlanSelector
                    currentPlan={currentPlan}
                    allPlans={allPlans}
                    onSelectPlan={switchToPlan}
                    onCreatePlan={createPlan}
                    onDeletePlan={deletePlan}
                    onRenamePlan={renamePlan}
                  />
                  
                  {/* Sync Status Indicator */}
                  <SyncStatusIndicator
                    syncState={syncState}
                    syncError={syncError}
                    onRetry={rollbackToLastSyncedState}
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
                          onCheckedChange={handleColorCodingChange}
                          className="ml-3"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
                {/* Panel Content */}
                <AnimatePresence mode="wait">
                  {activePanel === 'notepad' ? (
                    <motion.div
                      key="notepad"
                      initial={{ opacity: 0, x: -3 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 3 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className="flex-1 min-h-0"
                    >
                      <NotePad 
                        width={sidebarWidth - 48} // Subtract navigation width (48px = 12px width + borders)
                        currentPlan={currentPlan}
                        onUpdatePlan={updateCurrentPlan}
                      />
                    </motion.div>
                  ) : activePanel === 'backlog' ? (
                    <motion.div
                      key="backlog"
                      initial={{ opacity: 0, x: -3 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 3 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className="flex-1 min-h-0"
                    >
                      <BacklogPanel width={sidebarWidth - 48} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="comments"
                      initial={{ opacity: 0, x: -3 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 3 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className="flex-1 min-h-0"
                    >
                      <CommentsPanel width={sidebarWidth - 48} />
                    </motion.div>
                  )}
                </AnimatePresence>
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
          onDataSyncError={handleDataSyncError}
          isColorCodingEnabled={isColorCodingEnabled}
        />
      </div>
    </div>
    </>
  );
}