'use client';

import { useState, memo } from 'react';
import { motion } from 'motion/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TimeSlot, generateId } from '@/data/teamplan';
import { Button } from '@/components/ui/button';
import TeamPlanContextMenu from './TeamPlanContextMenu';

interface TeamPlanHeaderProps {
  className?: string;
  timeSlots: TimeSlot[];
  onAddTimeSlot?: (timeSlot: TimeSlot) => void;
  onRemoveTimeSlot?: (timeSlotId: string) => void;
  onUpdateTimeSlot?: (timeSlot: TimeSlot) => void;
  onMoveTimeSlotLeft?: (timeSlotId: string) => void;
  onMoveTimeSlotRight?: (timeSlotId: string) => void;
  hoveredColumn?: string | null;
  onColumnMouseEnter?: (timeSlotId: string) => void;
  onColumnMouseLeave?: () => void;
}

const TeamPlanHeader = ({ 
  className = "",
  timeSlots,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot,
  onMoveTimeSlotLeft,
  onMoveTimeSlotRight,
  hoveredColumn,
  onColumnMouseEnter,
  onColumnMouseLeave
}: TeamPlanHeaderProps) => {
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const generateNextTimeSlotLabel = (): { label: string; type: 'week' | 'month' } => {
    if (timeSlots.length === 0) {
      return { label: 'Week 1', type: 'week' };
    }

    const lastSlot = timeSlots[timeSlots.length - 1];
    const lastLabel = lastSlot.label;

    // Pattern matching for common time slot formats
    const patterns = [
      // Week patterns: "Week 1", "week 2", "WEEK 3"
      { regex: /^(week)\s+(\d+)$/i, prefix: 'Week', type: 'week' as const },
      // Month patterns: "Month 1", "month 12"
      { regex: /^(month)\s+(\d+)$/i, prefix: 'Month', type: 'month' as const },
      // Quarter patterns: "Q1", "Q2", "Quarter 1"
      { regex: /^q(\d+)$/i, prefix: 'Q', type: 'month' as const },
      { regex: /^(quarter)\s+(\d+)$/i, prefix: 'Quarter', type: 'month' as const },
      // Year patterns: "2024", "Year 2023"
      { regex: /^(\d{4})$/, prefix: '', type: 'month' as const },
      { regex: /^(year)\s+(\d+)$/i, prefix: 'Year', type: 'month' as const },
      // Generic patterns: "Phase 1", "Sprint 15", etc.
      { regex: /^([a-zA-Z]+)\s+(\d+)$/i, prefix: null, type: 'week' as const }
    ];

    for (const pattern of patterns) {
      const match = lastLabel.match(pattern.regex);
      if (match) {
        let prefix = pattern.prefix;
        let number: number;

        if (pattern.regex.source.includes('\\d{4}')) {
          // Year pattern: "2024" -> "2025"
          number = parseInt(match[1]) + 1;
          return { label: number.toString(), type: pattern.type };
        } else if (pattern.regex.source.startsWith('^q')) {
          // Q pattern: "Q1" -> "Q2"
          number = parseInt(match[1]) + 1;
          return { label: `${prefix}${number}`, type: pattern.type };
        } else {
          // Standard patterns: "Week 1" -> "Week 2"
          if (prefix === null) {
            // Generic pattern - preserve the original prefix case
            prefix = match[1];
          }
          number = parseInt(match[2]) + 1;
          return { label: `${prefix} ${number}`, type: pattern.type };
        }
      }
    }

    // Fallback: if no pattern is detected, default to Week pattern
    return { label: `Week ${timeSlots.length + 1}`, type: 'week' };
  };

  const handleAddSlot = () => {
    if (!onAddTimeSlot) return;
    const { label, type } = generateNextTimeSlotLabel();
    const newSlot: TimeSlot = {
      id: generateId(),
      label,
      type
    };
    onAddTimeSlot(newSlot);
  };

  const handleStartEdit = (slot: TimeSlot) => {
    setEditingSlot(slot.id);
    setEditValue(slot.label);
  };

  const handleSaveEdit = (slotId: string) => {
    const slot = timeSlots.find(s => s.id === slotId);
    if (slot && editValue.trim() && onUpdateTimeSlot) {
      onUpdateTimeSlot({ ...slot, label: editValue.trim() });
    }
    setEditingSlot(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, slotId: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(slotId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Timeslots Section - aligned with content grid */}
      <div className="px-6">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
          {/* Time Slot Headers */}
          {timeSlots.map((timeSlot, timeSlotIndex) => (
            <TeamPlanContextMenu
              key={timeSlot.id}
              type="timeSlot"
              canMoveUp={timeSlotIndex > 0}
              canMoveDown={timeSlotIndex < timeSlots.length - 1}
              canDelete={timeSlots.length > 1}
              onMoveUp={() => onMoveTimeSlotLeft?.(timeSlot.id)}
              onMoveDown={() => onMoveTimeSlotRight?.(timeSlot.id)}
              onDelete={() => onRemoveTimeSlot?.(timeSlot.id)}
            >
              <motion.div
                className={`p-2 group relative transition-colors duration-200 ${
                  hoveredColumn === timeSlot.id ? 'bg-slate-100/70' : 'hover:bg-slate-50/60'
                }`}
                data-column-id={timeSlot.id}
                onMouseEnter={() => onColumnMouseEnter?.(timeSlot.id)}
                onMouseLeave={() => onColumnMouseLeave?.()}
              >
                <div className="flex items-center justify-between">
                  {editingSlot === timeSlot.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSaveEdit(timeSlot.id)}
                      onKeyDown={(e) => handleKeyDown(e, timeSlot.id)}
                      className="font-mono uppercase text-xs text-slate-900 bg-transparent border-none outline-none pl-4 pr-2 py-1 text-left w-full transition-colors"
                      autoFocus
                    />
                  ) : (
                    <h3 
                      className="font-mono uppercase text-xs text-slate-700 text-left cursor-pointer hover:text-slate-900 flex-1 pl-4"
                      onClick={() => handleStartEdit(timeSlot)}
                      title="Click to edit"
                    >
                      {timeSlot.label}
                    </h3>
                  )}
                  
                  {timeSlots.length > 1 && (
                    <button
                      onClick={() => onRemoveTimeSlot?.(timeSlot.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-red-100 rounded"
                      title="Remove time slot"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            </TeamPlanContextMenu>
          ))}
          
          {/* Add Time Slot Column */}
          <div className="flex items-center justify-center">
            <Button
              onClick={handleAddSlot}
              variant="secondary"
              size="icon"
              className="bg-white hover:bg-slate-50 ring-1 ring-slate-200/65 hover:ring-1 hover:ring-slate-300/50 size-7"
              title="Add time slot"
            >
              <PlusIcon className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TeamPlanHeader);