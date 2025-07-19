'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Person, generateId } from '@/data/teamplan';
import { Button } from '@/components/ui/button';

interface PersonManagementProps {
  people: Person[];
  onAddPerson: (person: Person) => void;
  onRemovePerson: (personId: string) => void;
  onUpdatePerson: (person: Person) => void;
}

export default function PersonManagement({
  people,
  onAddPerson,
  onRemovePerson,
  onUpdatePerson
}: PersonManagementProps) {
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('');
  const [editingPerson, setEditingPerson] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      const newPerson: Person = {
        id: generateId(),
        name: newPersonName.trim(),
        role: newPersonRole.trim() || undefined
      };
      onAddPerson(newPerson);
      setNewPersonName('');
      setNewPersonRole('');
      setIsAddingPerson(false);
    }
  };

  const handleStartEdit = (person: Person) => {
    setEditingPerson(person.id);
    setEditName(person.name);
    setEditRole(person.role || '');
  };

  const handleSaveEdit = (personId: string) => {
    if (editName.trim()) {
      const updatedPerson: Person = {
        id: personId,
        name: editName.trim(),
        role: editRole.trim() || undefined
      };
      onUpdatePerson(updatedPerson);
    }
    setEditingPerson(null);
    setEditName('');
    setEditRole('');
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setEditName('');
    setEditRole('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      if (isAddingPerson) {
        setIsAddingPerson(false);
        setNewPersonName('');
        setNewPersonRole('');
      } else {
        handleCancelEdit();
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Existing People */}
      <AnimatePresence>
        {people.map(person => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between group hover:shadow-sm transition-shadow"
          >
            {editingPerson === person.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(person.id))}
                  placeholder="Name"
                  className="w-full font-medium text-slate-900 bg-slate-50 border border-slate-300 rounded px-3 py-1"
                  autoFocus
                />
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(person.id))}
                  placeholder="Role (optional)"
                  className="w-full text-sm text-slate-500 bg-slate-50 border border-slate-300 rounded px-3 py-1"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(person.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleStartEdit(person)}
                >
                  <h4 className="font-medium text-slate-900">{person.name}</h4>
                  {person.role && (
                    <p className="text-sm text-slate-500">{person.role}</p>
                  )}
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(person)}
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                    title="Edit person"
                  >
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {people.length > 1 && (
                    <button
                      onClick={() => onRemovePerson(person.id)}
                      className="p-2 hover:bg-red-50 rounded transition-colors"
                      title="Remove person"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add New Person */}
      {isAddingPerson ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg space-y-3"
        >
          <input
            type="text"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAddPerson)}
            placeholder="Person name"
            className="w-full font-medium bg-white border border-slate-300 rounded px-3 py-2"
            autoFocus
          />
          <input
            type="text"
            value={newPersonRole}
            onChange={(e) => setNewPersonRole(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAddPerson)}
            placeholder="Role (optional)"
            className="w-full text-sm bg-white border border-slate-300 rounded px-3 py-2"
          />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleAddPerson}
              disabled={!newPersonName.trim()}
            >
              Add Person
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setIsAddingPerson(false);
                setNewPersonName('');
                setNewPersonRole('');
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsAddingPerson(true)}
          className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Team Member
        </Button>
      )}
    </div>
  );
}