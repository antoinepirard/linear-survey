'use client';

import { useState, useRef, useEffect } from 'react';
import { PlanMetadata } from '@/types/plan';

interface PlanSelectorProps {
  currentPlan: PlanMetadata | null;
  allPlans: PlanMetadata[];
  onSelectPlan: (planId: string) => void;
  onCreatePlan: (name: string) => void;
  onDeletePlan: (planId: string) => void;
  onRenamePlan?: (planId: string, newName: string) => void;
}

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (name: string) => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose, onCreatePlan }) => {
  const [planName, setPlanName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (planName.trim()) {
      onCreatePlan(planName.trim());
      setPlanName('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Plan</h3>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter plan name..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={50}
          />
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!planName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlanSelector: React.FC<PlanSelectorProps> = ({
  currentPlan,
  allPlans,
  onSelectPlan,
  onCreatePlan,
  onDeletePlan,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleSelectPlan = (planId: string) => {
    onSelectPlan(planId);
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (allPlans.length <= 1) {
      return; // Don't allow deleting the last plan
    }
    setDeleteConfirmId(planId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeletePlan(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors group"
        >
          <span className="font-medium truncate max-w-[200px]">
            {currentPlan?.name || 'No Plan Selected'}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
            <div className="px-3 py-2 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Your Plans</span>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  + New
                </button>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {allPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group ${
                    currentPlan?.id === plan.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">
                      {plan.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Updated {formatDate(plan.updatedAt)}
                    </div>
                  </div>
                  
                  {allPlans.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteClick(plan.id, e)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-slate-400 hover:text-red-600 transition-all"
                      title="Delete plan"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePlan={onCreatePlan}
      />

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Plan</h3>
            <p className="text-slate-600 mb-4">
              Are you sure you want to delete &quot;{allPlans.find(p => p.id === deleteConfirmId)?.name}&quot;? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanSelector;