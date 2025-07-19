'use client';

import { useState } from 'react';
import { Person } from '@/data/teamplan';

interface PersonCellProps {
  person: Person;
  onUpdatePerson: (person: Person) => void;
  onRemovePerson: (personId: string) => void;
  canRemove: boolean;
}

export default function PersonCell({
  person,
  onUpdatePerson,
  onRemovePerson,
  canRemove
}: PersonCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(person.name);
  const [editRole, setEditRole] = useState(person.role || '');

  const handleSave = () => {
    if (editName.trim()) {
      onUpdatePerson({
        ...person,
        name: editName.trim(),
        role: editRole.trim() || undefined
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(person.name);
    setEditRole(person.role || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="border border-slate-200 bg-white p-3 flex items-center justify-between group hover:bg-slate-50/50 min-h-20">
      {isEditing ? (
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Name"
            className="w-full text-sm font-medium bg-white border border-slate-300 rounded px-2 py-1"
            autoFocus
          />
          <input
            type="text"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Role (optional)"
            className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1"
          />
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
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
        <>
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <h4 className="text-sm font-medium text-slate-900">{person.name}</h4>
            {person.role && (
              <p className="text-xs text-slate-500">{person.role}</p>
            )}
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
              title="Edit person"
            >
              <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {canRemove && (
              <button
                onClick={() => onRemovePerson(person.id)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
                title="Remove person"
              >
                <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}