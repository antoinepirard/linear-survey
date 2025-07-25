'use client';

import { useState, memo } from 'react';
import { Person } from '@/data/teamplan';

interface PersonCellProps {
  person: Person;
  onUpdatePerson: (person: Person) => void;
}

const PersonCell = ({
  person,
  onUpdatePerson,
}: PersonCellProps) => {
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
            className="text-sm font-medium text-slate-900 bg-transparent border-0 outline-none pt-4 pb-0 w-full"
            autoFocus
          />
        ) : (
          <h4
            className="text-sm font-medium text-slate-900 pt-4 pb-0 transition-colors cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {person.name}
          </h4>
        )}
      </div>
    </div>
  );
}

export default memo(PersonCell);