"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2, GripVertical } from "lucide-react";
import { QuestionGroup } from "@/lib/types";
import { useState } from "react";

interface StepSeparatorProps {
  group: QuestionGroup;
  stepNumber: number;
  onUpdate: (updates: Partial<QuestionGroup>) => void;
  onDelete: () => void;
}

export function StepSeparator({
  group,
  stepNumber,
  onUpdate,
  onDelete,
}: StepSeparatorProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative flex items-center gap-3 py-4">
      {/* Left line */}
      <div className="h-px flex-1 bg-border" />

      {/* Step label */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-sm">
        <GripVertical className="h-3 w-3 text-text-tertiary cursor-grab" />
        
        {isEditing ? (
          <Input
            value={group.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditing(false);
            }}
            autoFocus
            className="h-6 w-24 text-xs border-0 bg-transparent p-0 focus:ring-0"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {group.title || `Step ${stepNumber}`}
          </button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-5 w-5 p-0 text-text-tertiary hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Right line */}
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

