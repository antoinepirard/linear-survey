'use client';

import { useState } from 'react';
import { Person, generateId } from '@/data/teamplan';

interface AddPersonCellProps {
  onAddPerson: (person: Person) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDraggedOver?: boolean;
  numTimeSlots?: number;
}

export default function AddPersonCell({ 
  onAddPerson, 
  onDragOver, 
  onDrop, 
  isDraggedOver = false, 
  numTimeSlots = 3 
}: AddPersonCellProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      const newPerson: Person = {
        id: generateId(),
        name: newName.trim()
      };
      onAddPerson(newPerson);
      setNewName('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewName('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(e);
  };

  return (
    <div 
      className={`col-span-full p-2 m-1 rounded-md transition-all duration-200 cursor-pointer ${
        isDraggedOver 
          ? 'bg-blue-50/30 border border-blue-200' 
          : isAdding 
            ? 'bg-white border border-slate-200 cursor-default' 
            : 'border border-transparent hover:bg-slate-100'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={isAdding ? undefined : () => setIsAdding(true)}
      data-add-person-zone="true"
      style={{ gridColumn: `1 / ${numTimeSlots + 3}` }}
    >
      <div className="flex items-center justify-center min-h-8">
        {isAdding ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Person name"
              className="text-sm bg-transparent border-none outline-none placeholder-slate-400 text-slate-700 px-1"
              autoFocus
            />
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">↵</kbd>
              <span>to add</span>
            </div>
            <button
              onClick={handleCancel}
              className="text-xs text-slate-400 hover:text-slate-600 ml-1"
            >
              esc
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors pointer-events-none">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className={isDraggedOver ? 'text-blue-700' : ''}>
              {isDraggedOver ? 'Drop to create person' : 'Add Person'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}