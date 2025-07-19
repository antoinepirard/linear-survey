'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
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
    <div className="grid gap-0 mb-0" style={{ gridTemplateColumns: `200px repeat(${timeSlots.length}, minmax(200px, 1fr))` }}>
      {/* Team Header */}
      <div className="p-4 bg-slate-100 border border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">Team</h3>
      </div>

      {/* Time Slot Headers */}
      {timeSlots.map((timeSlot, index) => (
        <motion.div
          key={timeSlot.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="p-4 bg-slate-100 border border-slate-200 group relative"
        >
          <div className="flex items-center justify-between">
            {editingSlot === timeSlot.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveEdit(timeSlot.id)}
                onKeyDown={(e) => handleKeyDown(e, timeSlot.id)}
                className="font-semibold text-slate-700 bg-white border border-slate-300 rounded px-2 py-1 text-center w-full"
                autoFocus
              />
            ) : (
              <h3 
                className="font-semibold text-slate-700 text-center cursor-pointer hover:text-slate-900 flex-1"
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
      
      {/* Add Week Button as overlay */}
      <div className="fixed bottom-4 right-4 z-10">
        <Button
          onClick={handleAddSlot}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Week
        </Button>
      </div>
    </div>
  );
}