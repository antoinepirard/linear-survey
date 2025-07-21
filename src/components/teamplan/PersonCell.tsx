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
    <div className="border-b border-dashed border-slate-200 p-2 pt-3 pb-3 flex items-start justify-between group min-h-16">
      {isEditing ? (
        <div className="flex-1">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="Name"
            className="w-full text-sm font-medium bg-gray-100 border-0 outline-none px-2 py-0.5 rounded transition-colors"
            autoFocus
          />
        </div>
      ) : (
        <>
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <h4 className="text-sm font-medium text-slate-900 px-2 py-0.5 rounded transition-colors">{person.name}</h4>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded transition-colors"
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