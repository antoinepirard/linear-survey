'use client';

import { useState } from 'react';
import { Person, generateId } from '@/data/teamplan';

interface AddPersonCellProps {
  onAddPerson: (person: Person) => void;
}

export default function AddPersonCell({ onAddPerson }: AddPersonCellProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      const newPerson: Person = {
        id: generateId(),
        name: newName.trim(),
        role: newRole.trim() || undefined
      };
      onAddPerson(newPerson);
      setNewName('');
      setNewRole('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewName('');
    setNewRole('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="border border-slate-200 bg-slate-50/50 p-3 flex items-center justify-center min-h-16">
      {isAdding ? (
        <div className="w-full space-y-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Person name"
            className="w-full text-sm font-medium bg-white border border-slate-300 rounded px-2 py-1"
            autoFocus
          />
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Role (optional)"
            className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1"
          />
          <div className="flex gap-1">
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 text-xs bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Person
        </button>
      )}
    </div>
  );
}