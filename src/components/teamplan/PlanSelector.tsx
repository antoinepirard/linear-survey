'use client';

import { useState } from 'react';
import { PlanMetadata } from '@/types/plan';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronsUpDown, Plus, Trash2, Check } from 'lucide-react';

interface PlanSelectorProps {
  currentPlan: PlanMetadata | null;
  allPlans: PlanMetadata[];
  onSelectPlan: (planId: string) => void;
  onCreatePlan: (name: string) => void;
  onDeletePlan: (planId: string) => void;
  onRenamePlan?: (planId: string, newName: string) => void;
}

interface CreatePlanDialogProps {
  onCreatePlan: (name: string) => void;
}

const CreatePlanDialog: React.FC<CreatePlanDialogProps> = ({ onCreatePlan }) => {
  const [planName, setPlanName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (planName.trim()) {
      onCreatePlan(planName.trim());
      setPlanName('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          size="icon" 
          className="bg-white hover:bg-slate-50 ring-1 ring-slate-200/65 hover:ring-1 hover:ring-slate-300/50 size-7"
          title="Create new plan"
        >
          <Plus className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="Enter plan name..."
            maxLength={50}
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!planName.trim()}
            >
              Create Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PlanSelector: React.FC<PlanSelectorProps> = ({
  currentPlan,
  allPlans,
  onSelectPlan,
  onCreatePlan,
  onDeletePlan,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    onSelectPlan(planId);
    setIsPopoverOpen(false);
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
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={isPopoverOpen}
            className="w-auto justify-between px-3 py-2 h-auto text-left font-medium"
          >
            <span className="text-sm truncate max-w-[200px]">
              {currentPlan?.name || 'No Plan Selected'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="px-4 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-slate-500 font-mono">Your Plans</span>
              <CreatePlanDialog onCreatePlan={onCreatePlan} />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto p-2">
            {allPlans.map((plan) => (
              <div
                key={plan.id}
                className="px-3 py-2 hover:bg-slate-50 hover:rounded-lg cursor-pointer flex items-center justify-between group transition-all duration-150"
                onClick={() => handleSelectPlan(plan.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {plan.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated {formatDate(plan.updatedAt)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {currentPlan?.id === plan.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                  {allPlans.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(plan.id, e)}
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {deleteConfirmId && (
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete &quot;{allPlans.find(p => p.id === deleteConfirmId)?.name}&quot;? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PlanSelector;