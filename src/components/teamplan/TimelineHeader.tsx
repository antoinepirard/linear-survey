'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TimeSlot, generateId } from '@/data/teamplan';
import { Button } from '@/components/ui/button';

interface TimelineHeaderProps {
  timeSlots: TimeSlot[];
  onAddTimeSlot: (timeSlot: TimeSlot) => void;
  onRemoveTimeSlot: (timeSlotId: string) => void;
  onUpdateTimeSlot: (timeSlot: TimeSlot) => void;
}

export default function TimelineHeader({
  timeSlots,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot
}: TimelineHeaderProps) {
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddSlot = () => {
    const newSlot: TimeSlot = {
      id: generateId(),
      label: `Week ${timeSlots.length + 1}`,
      type: 'week'
    };
    onAddTimeSlot(newSlot);
  };

  const handleStartEdit = (slot: TimeSlot) => {
    setEditingSlot(slot.id);
    setEditValue(slot.label);
  };

  const handleSaveEdit = (slotId: string) => {
    const slot = timeSlots.find(s => s.id === slotId);
    if (slot && editValue.trim()) {
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
    <div className="grid gap-0 mb-0" style={{ gridTemplateColumns: `200px repeat(${timeSlots.length}, minmax(200px, 1fr)) 60px` }}>
      {/* Team Header */}
      <div className="p-2 border-b border-slate-200 flex items-center justify-between">
        <p className="font-mono text-xs text-slate-700">Team</p>
      </div>

      {/* Time Slot Headers */}
      {timeSlots.map((timeSlot) => (
        <motion.div
          key={timeSlot.id}
          className="p-2 border-b border-slate-200 group relative"
        >
          <div className="flex items-center justify-between">
            {editingSlot === timeSlot.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveEdit(timeSlot.id)}
                onKeyDown={(e) => handleKeyDown(e, timeSlot.id)}
                className="font-mono uppercase text-xs text-slate-700 bg-transparent focus:bg-slate-50 border-none outline-none px-2 py-1 text-center w-full transition-colors"
                autoFocus
              />
            ) : (
              <h3 
                className="font-mono uppercase text-xs text-slate-700 text-center cursor-pointer hover:text-slate-900 flex-1"
                onClick={() => handleStartEdit(timeSlot)}
                title="Click to edit"
              >
                {timeSlot.label}
              </h3>
            )}
            
            {timeSlots.length > 1 && (
              <button
                onClick={() => onRemoveTimeSlot(timeSlot.id)}
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
      ))}
      
      {/* Add Time Slot Column */}
      <div className="border-b border-slate-200 flex items-center justify-center">
        <Button
          onClick={handleAddSlot}
          variant="secondary"
          size="icon"
          className="ring-1 ring-slate-200/65 hover:ring-1 hover:ring-slate-300/50 size-7"
          title="Add time slot"
        >
          <PlusIcon className="size-3" />
        </Button>
      </div>
    </div>
  );
}