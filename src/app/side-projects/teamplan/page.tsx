'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import PageLoader from '@/components/PageLoader';
import TeamPlanBoard from '@/components/teamplan/TeamPlanBoard';
import TeamPlanTopControls from '@/components/teamplan/TeamPlanTopControls';
import NotePad from '@/components/teamplan/NotePad';
import BacklogPanel from '@/components/teamplan/BacklogPanel';
import CommentsPanel from '@/components/teamplan/CommentsPanel';
import VerticalNavigation from '@/components/teamplan/VerticalNavigation';
import SidebarHeader from '@/components/teamplan/SidebarHeader';
import { usePlanStorage } from '@/hooks/usePlanStorage';
import { useResizable } from '@/hooks/useResizable';
import { useNotePadStorage } from '@/hooks/useNotePadStorage';
import { TeamPlanData, Project, getBacklogProjects, getAllGroups, generateId } from '@/data/teamplan';
import { NOTEPAD_CONSTANTS } from '@/constants/notepad';
import { teamPlanLogger as logger } from '@/utils/logger';

// Utility functions for time slot sequence management
const shouldShiftSubsequentSlots = (originalLabel: string, newLabel: string): boolean => {
  // Only shift if both labels follow a recognizable sequence pattern
  return isSequencePattern(originalLabel) && isSequencePattern(newLabel);
};

const isSequencePattern = (label: string): boolean => {
  const patterns = [
    /^q(\d+)$/i,                    // Q1, Q2, etc.
    /^(quarter)\s+(\d+)$/i,         // Quarter 1, Quarter 2
    /^(week)\s+(\d+)$/i,            // Week 1, Week 2
    /^(month)\s+(\d+)$/i,           // Month 1, Month 2
    /^(\d{4})$/,                    // 2024, 2025
    /^(year)\s+(\d+)$/i,            // Year 2023, Year 2024
    /^([a-zA-Z]+)\s+(\d+)$/i        // Phase 1, Sprint 2, etc.
  ];
  
  return patterns.some(pattern => pattern.test(label.trim()));
};

const generateSequenceLabels = (startLabel: string, count: number): string[] => {
  const labels = [startLabel];
  
  if (count <= 0) return labels;
  
  // Handle different sequence patterns
  const quarterMatch = startLabel.match(/^q(\d+)$/i);
  if (quarterMatch) {
    const startNumber = parseInt(quarterMatch[1]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Q${startNumber + i}`);
    }
    return labels;
  }

  const quarterFullMatch = startLabel.match(/^(quarter)\s+(\d+)$/i);
  if (quarterFullMatch) {
    const startNumber = parseInt(quarterFullMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Quarter ${startNumber + i}`);
    }
    return labels;
  }

  const weekMatch = startLabel.match(/^(week)\s+(\d+)$/i);
  if (weekMatch) {
    const startNumber = parseInt(weekMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Week ${startNumber + i}`);
    }
    return labels;
  }

  const monthMatch = startLabel.match(/^(month)\s+(\d+)$/i);
  if (monthMatch) {
    const startNumber = parseInt(monthMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Month ${startNumber + i}`);
    }
    return labels;
  }

  const yearMatch = startLabel.match(/^(\d{4})$/);
  if (yearMatch) {
    const startNumber = parseInt(yearMatch[1]);
    for (let i = 1; i <= count; i++) {
      labels.push(`${startNumber + i}`);
    }
    return labels;
  }

  const yearFullMatch = startLabel.match(/^(year)\s+(\d+)$/i);
  if (yearFullMatch) {
    const startNumber = parseInt(yearFullMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`Year ${startNumber + i}`);
    }
    return labels;
  }

  const genericMatch = startLabel.match(/^([a-zA-Z]+)\s+(\d+)$/i);
  if (genericMatch) {
    const prefix = genericMatch[1];
    const startNumber = parseInt(genericMatch[2]);
    for (let i = 1; i <= count; i++) {
      labels.push(`${prefix} ${startNumber + i}`);
    }
    return labels;
  }
  
  return labels;
};

export default function TeamPlanPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState<'notepad' | 'backlog' | 'comments'>('notepad');
  const [isColorCodingEnabled, setIsColorCodingEnabled] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [isNotePadFullScreen, setIsNotePadFullScreen] = useState(false);

  // Load color coding preference from localStorage on mount
  useEffect(() => {
    const savedColorCoding = localStorage.getItem('teamplan-color-coding-enabled');
    if (savedColorCoding !== null) {
      setIsColorCodingEnabled(JSON.parse(savedColorCoding));
    }
  }, []);

  // Load active panel preference from localStorage on mount
  useEffect(() => {
    const savedActivePanel = localStorage.getItem('teamplan-active-panel');
    if (savedActivePanel && ['notepad', 'backlog', 'comments'].includes(savedActivePanel)) {
      setActivePanel(savedActivePanel as 'notepad' | 'backlog' | 'comments');
      setIsSidebarExpanded(true); // Ensure sidebar is expanded when restoring panel
    }
  }, []);

  // Save color coding preference to localStorage when it changes
  const handleColorCodingChange = (checked: boolean) => {
    setIsColorCodingEnabled(checked);
    localStorage.setItem('teamplan-color-coding-enabled', JSON.stringify(checked));
  };

  // Save active panel preference to localStorage when it changes
  const handleSetActivePanel = (panel: 'notepad' | 'backlog' | 'comments') => {
    setActivePanel(panel);
    localStorage.setItem('teamplan-active-panel', panel);
  };

  const handlePageLoadingComplete = () => {
    setIsPageLoading(false);
  };
  
  const {
    isLoading,
    currentPlan,
    currentDocument,
    allPlans,
    allDocuments,
    createPlan,
    deletePlan,
    switchToPlan,
    updateCurrentPlan,
    renamePlan,
    createDocument,
    deleteDocument,
    switchToDocument,
    renameDocument,
    updateDocumentContent,
  } = usePlanStorage();

  // Document management functions with error handling
  const handleCreateDocument = useCallback(async (title: string) => {
    try {
      const newDoc = createDocument(title);
      // Could show success toast here in the future
      return newDoc;
    } catch (error) {
      console.error('Failed to create document:', error);
      // Could show error toast here in the future
      throw error;
    }
  }, [createDocument]);

  const handleSwitchToDocument = useCallback(async (documentId: string) => {
    try {
      switchToDocument(documentId);
    } catch (error) {
      console.error('Failed to switch document:', error);
      // Could show error toast here in the future
    }
  }, [switchToDocument]);


  const handleUpdateDocumentContent = useCallback(async (documentId: string, content: string) => {
    try {
      updateDocumentContent(documentId, content);
    } catch (error) {
      console.error('Failed to update document:', error);
      // Could show error toast here in the future
    }
  }, [updateDocumentContent]);

  const handleDeleteDocument = useCallback(async (documentId: string) => {
    try {
      deleteDocument(documentId);
    } catch (error) {
      console.error('Failed to delete document:', error);
      // Could show error toast here in the future
    }
  }, [deleteDocument]);

  // Keyboard shortcuts for plan and document switching
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

    const mod = event.metaKey || event.ctrlKey;
    const shift = event.shiftKey;

    // ESC key to exit full-screen mode
    if (event.key === 'Escape' && isNotePadFullScreen && activePanel === 'notepad') {
      event.preventDefault();
      setIsNotePadFullScreen(false);
      return;
    }

    // Plan switching with Shift + number keys
    if (shift && !mod && event.key >= '1' && event.key <= '9') {
      event.preventDefault();
      const planIndex = parseInt(event.key) - 1;
      if (planIndex < allPlans.length) {
        const targetPlan = allPlans[planIndex];
        if (targetPlan && targetPlan.id !== currentPlan?.id) {
          switchToPlan(targetPlan.id);
        }
      }
    }

    // Document switching with Cmd/Ctrl + number keys
    if (mod && !shift && event.key >= '1' && event.key <= '9') {
      event.preventDefault();
      const docIndex = parseInt(event.key) - 1;
      if (docIndex < allDocuments.length) {
        const targetDoc = allDocuments[docIndex];
        if (targetDoc && targetDoc.id !== currentDocument?.id) {
          switchToDocument(targetDoc.id);
        }
      }
    }

    // Handle keyboard shortcuts
    if (event.metaKey || event.ctrlKey) {
      // Document switching shortcuts can be handled here if needed in the future
    }
  }, [allPlans, currentPlan?.id, switchToPlan, allDocuments, currentDocument?.id, switchToDocument, isNotePadFullScreen, activePanel]);

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


  // Sidebar resize functionality with direct DOM manipulation
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isResizing, handleResizeStart } = useResizable({
    initialWidth: sidebarWidth,
    minWidth: NOTEPAD_CONSTANTS.MIN_WIDTH,
    maxWidth: NOTEPAD_CONSTANTS.MAX_WIDTH,
    onWidthChange: setSidebarWidth,
    elementRef: sidebarRef,
  });

  const handleDataChange = (newData: TeamPlanData) => {
    logger.debug('handleDataChange called', { 
      projectsCount: newData.projects?.length || 0,
      timeSlots: newData.timeSlots?.length || 0,
      people: newData.people?.length || 0
    });
    
    updateCurrentPlan({ teamPlanData: newData });
  };

  const handleRenameGroup = (oldGroupName: string, newGroupName: string) => {
    if (!currentPlan) return;
    
    const newData = {
      ...currentPlan.teamPlanData,
      projects: currentPlan.teamPlanData.projects.map(project => 
        project.group === oldGroupName 
          ? { ...project, group: newGroupName }
          : project
      )
    };
    
    handleDataChange(newData);
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

  // Backlog management handlers
  const handleCreateBacklogProject = (project: Omit<Project, 'id'>) => {
    if (!currentPlan) return;
    
    const projectId = generateId();
    const newProject: Project = {
      ...project,
      id: projectId,
    };
    
    const newData = {
      ...currentPlan.teamPlanData,
      projects: [...currentPlan.teamPlanData.projects, newProject]
    };
    
    handleDataChange(newData);
  };

  const handleUpdateBacklogProject = (updatedProject: Project) => {
    if (!currentPlan) return;
    
    const newData = {
      ...currentPlan.teamPlanData,
      projects: currentPlan.teamPlanData.projects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      )
    };
    
    handleDataChange(newData);
  };

  const handleDeleteBacklogProject = (projectId: string) => {
    if (!currentPlan) return;
    
    const newData = {
      ...currentPlan.teamPlanData,
      projects: currentPlan.teamPlanData.projects.filter(p => p.id !== projectId)
    };
    
    handleDataChange(newData);
  };

  const handleMoveBacklogProjectToBoard = (projectId: string, personId?: string, timeSlotId?: string) => {
    if (!currentPlan) return;
    
    const project = currentPlan.teamPlanData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    // If no person/timeSlot specified, use first available
    const targetPersonId = personId || currentPlan.teamPlanData.people[0]?.id;
    const targetTimeSlotId = timeSlotId || currentPlan.teamPlanData.timeSlots[0]?.id;
    
    if (!targetPersonId || !targetTimeSlotId) return;
    
    const updatedProject = {
      ...project,
      personId: targetPersonId,
      timeSlotId: targetTimeSlotId,
    };
    
    const newData = {
      ...currentPlan.teamPlanData,
      projects: currentPlan.teamPlanData.projects.map(p => 
        p.id === projectId ? updatedProject : p
      )
    };
    
    handleDataChange(newData);
    toast.success('Project moved to board successfully!');
  };

  const handleToggleSidebar = () => {
    if (activePanel === 'notepad' && isSidebarExpanded) {
      setIsSidebarExpanded(false);
    } else {
      handleSetActivePanel('notepad');
      setIsSidebarExpanded(true);
    }
  };

  const handleToggleBacklog = () => {
    if (activePanel === 'backlog') {
      setIsSidebarExpanded(false);
    } else {
      handleSetActivePanel('backlog');
      setIsSidebarExpanded(true);
    }
  };

  const handleToggleComments = () => {
    if (activePanel === 'comments') {
      setIsSidebarExpanded(false);
    } else {
      handleSetActivePanel('comments');
      setIsSidebarExpanded(true);
    }
  };

  const handleToggleNotePadFullScreen = () => {
    setIsNotePadFullScreen(!isNotePadFullScreen);
  };


  if (!currentPlan || isLoading || isStorageLoading) {
    return null;
  }

  return (
    <>
      {isPageLoading && <PageLoader onComplete={handlePageLoadingComplete} />}
      <div 
        className="h-screen bg-slate-50/75 overflow-hidden flex"
        style={{ 
          display: isPageLoading ? 'none' : 'flex',
          '--sidebar-width': `${sidebarWidth}px` // CSS custom property
        } as React.CSSProperties}
      >
      {/* Sidebar Container with Resize */}
      <div className="relative flex">
        <div 
          ref={sidebarRef}
          className="flex flex-col bg-white overflow-visible ring-1 ring-slate-300/30 shadow-md z-20 sidebar-container" 
          style={{ 
            width: isSidebarExpanded 
              ? (isNotePadFullScreen && activePanel === 'notepad' ? '100vw' : 'var(--sidebar-width)')
              : '48px',
            transition: 'none'
          }}
        >
          
          {/* SidebarHeader - spans full width when expanded */}
          {isSidebarExpanded && (
            <div className="flex-shrink-0">
              <SidebarHeader
                currentPlan={currentPlan}
                allPlans={allPlans}
                onSelectPlan={switchToPlan}
                onCreatePlan={createPlan}
                onDeletePlan={deletePlan}
                onRenamePlan={renamePlan}
                isNotePadFullScreen={isNotePadFullScreen}
                onToggleNotePadFullScreen={handleToggleNotePadFullScreen}
                showFullScreenToggle={activePanel === 'notepad'}
              />
            </div>
          )}

          {/* Bottom section: Navigation + Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Always present navigation */}
            <div className="w-12 h-full bg-transparent border-r border-slate-200/65 flex flex-col flex-shrink-0">
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
              <div className="flex-1 flex flex-col overflow-hidden">
              
                {/* Panel Content */}
                {activePanel === 'notepad' ? (
                  <div className="flex-1 min-h-0">
                    <NotePad 
                      currentPlan={currentPlan}
                      currentDocument={currentDocument}
                      allDocuments={allDocuments}
                      onCreateDocument={handleCreateDocument}
                      onSwitchToDocument={handleSwitchToDocument}
                      onUpdateDocumentContent={handleUpdateDocumentContent}
                      onRenameDocument={renameDocument}
                      onDeleteDocument={handleDeleteDocument}
                      showDocumentList={true}
                      isFullScreen={isNotePadFullScreen}
                    />
                  </div>
                ) : activePanel === 'backlog' ? (
                  <div className="flex-1 min-h-0">
                    <BacklogPanel 
                      width={sidebarWidth - 48}
                      backlogProjects={getBacklogProjects(currentPlan.teamPlanData.projects)}
                      availableGroups={getAllGroups(currentPlan.teamPlanData.projects)}
                      onCreateProject={handleCreateBacklogProject}
                      onUpdateProject={handleUpdateBacklogProject}
                      onDeleteProject={handleDeleteBacklogProject}
                      onMoveToBoard={handleMoveBacklogProjectToBoard}
                      onRenameGroup={handleRenameGroup}
                      people={currentPlan.teamPlanData.people}
                      timeSlots={currentPlan.teamPlanData.timeSlots}
                    />
                  </div>
                ) : (
                  <div className="flex-1 min-h-0">
                    <CommentsPanel width={sidebarWidth - 48} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resize Handle - Only show when sidebar is expanded and not in full-screen mode */}
          {isSidebarExpanded && !(isNotePadFullScreen && activePanel === 'notepad') && (
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
      
      {/* Team Plan Board - Only render when NOT in full-screen notepad mode */}
      {!(isNotePadFullScreen && activePanel === 'notepad') && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <TeamPlanTopControls 
            isColorCodingEnabled={isColorCodingEnabled}
            onColorCodingChange={handleColorCodingChange}
          />
          <div className="flex-1 overflow-hidden">
            <TeamPlanBoard 
            data={currentPlan.teamPlanData}
            onChange={handleDataChange}
            onDataSyncError={handleDataSyncError}
            isColorCodingEnabled={isColorCodingEnabled}
            hoveredColumn={hoveredColumn}
            onColumnMouseEnter={setHoveredColumn}
            onColumnMouseLeave={() => setHoveredColumn(null)}
            onAddTimeSlot={(timeSlot) => {
              const newData = {
                ...currentPlan.teamPlanData,
                timeSlots: [...currentPlan.teamPlanData.timeSlots, timeSlot]
              };
              updateCurrentPlan({ teamPlanData: newData });
            }}
            onRemoveTimeSlot={(timeSlotId) => {
              const newData = {
                ...currentPlan.teamPlanData,
                timeSlots: currentPlan.teamPlanData.timeSlots.filter(t => t.id !== timeSlotId),
                projects: currentPlan.teamPlanData.projects.filter(p => p.timeSlotId !== timeSlotId)
              };
              updateCurrentPlan({ teamPlanData: newData });
            }}
            onUpdateTimeSlot={(updatedTimeSlot) => {
              const timeSlotIndex = currentPlan.teamPlanData.timeSlots.findIndex(ts => ts.id === updatedTimeSlot.id);
              if (timeSlotIndex === -1) return;

              const updatedTimeSlots = [...currentPlan.teamPlanData.timeSlots];
              const originalLabel = updatedTimeSlots[timeSlotIndex].label;
              updatedTimeSlots[timeSlotIndex] = updatedTimeSlot;

              // Auto-shift subsequent time slots if the pattern changed
              const shouldShift = shouldShiftSubsequentSlots(originalLabel, updatedTimeSlot.label);
              if (shouldShift) {
                const nextSequenceLabels = generateSequenceLabels(updatedTimeSlot.label, updatedTimeSlots.length - timeSlotIndex - 1);
                for (let i = 1; i < nextSequenceLabels.length; i++) {
                  const targetIndex = timeSlotIndex + i;
                  if (targetIndex < updatedTimeSlots.length) {
                    updatedTimeSlots[targetIndex] = {
                      ...updatedTimeSlots[targetIndex],
                      label: nextSequenceLabels[i]
                    };
                  }
                }
              }

              const newData = {
                ...currentPlan.teamPlanData,
                timeSlots: updatedTimeSlots
              };
              updateCurrentPlan({ teamPlanData: newData });
            }}
            onMoveTimeSlotLeft={(timeSlotId) => {
              const currentIndex = currentPlan.teamPlanData.timeSlots.findIndex(t => t.id === timeSlotId);
              if (currentIndex <= 0) return;
              const newTimeSlots = [...currentPlan.teamPlanData.timeSlots];
              [newTimeSlots[currentIndex - 1], newTimeSlots[currentIndex]] = [newTimeSlots[currentIndex], newTimeSlots[currentIndex - 1]];
              const newData = {
                ...currentPlan.teamPlanData,
                timeSlots: newTimeSlots
              };
              updateCurrentPlan({ teamPlanData: newData });
            }}
            onMoveTimeSlotRight={(timeSlotId) => {
              const currentIndex = currentPlan.teamPlanData.timeSlots.findIndex(t => t.id === timeSlotId);
              if (currentIndex >= currentPlan.teamPlanData.timeSlots.length - 1) return;
              const newTimeSlots = [...currentPlan.teamPlanData.timeSlots];
              [newTimeSlots[currentIndex], newTimeSlots[currentIndex + 1]] = [newTimeSlots[currentIndex + 1], newTimeSlots[currentIndex]];
              const newData = {
                ...currentPlan.teamPlanData,
                timeSlots: newTimeSlots
              };
              updateCurrentPlan({ teamPlanData: newData });
            }}
          />
          </div>
        </div>
      )}
    </div>
    </>
  );
}