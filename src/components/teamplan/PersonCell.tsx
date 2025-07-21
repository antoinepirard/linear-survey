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

  const handleSave = () => {
    if (editName.trim()) {
      onUpdatePerson({
        ...person,
        name: editName.trim()
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(person.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div className="p-2 group relative">
      <div className="flex items-center">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="Name"
            className="text-sm font-medium text-slate-900 bg-transparent border-0 outline-none p-0 w-full"
            autoFocus
          />
        ) : (
          <h4
            className="text-sm font-medium text-slate-900 p-0 transition-colors cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {person.name}
          </h4>
        )}
        {canRemove && (
          <button
            onClick={() => onRemovePerson(person.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded ml-2"
            title="Remove person"
          >
            <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}