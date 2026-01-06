"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Layers } from "lucide-react";
import { QuestionGroup } from "@/lib/types";

interface GroupManagerProps {
  groups: QuestionGroup[];
  onChange: (groups: QuestionGroup[]) => void;
}

export function GroupManager({ groups, onChange }: GroupManagerProps) {
  function addFirstStep() {
    const newGroup: QuestionGroup = {
      id: crypto.randomUUID(),
      title: "Step 1",
    };
    onChange([newGroup]);
  }

  // Only show when there are no steps yet
  if (groups.length > 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-4 w-4 text-text-secondary" />
          <p className="text-sm font-medium text-text-primary">Steps</p>
        </div>
        <p className="text-xs text-text-secondary">
          {groups.length} step{groups.length !== 1 ? "s" : ""} defined. Move questions above or below step separators to organize them.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="h-4 w-4 text-text-secondary" />
        <p className="text-sm font-medium text-text-primary">Steps</p>
      </div>
      <p className="text-xs text-text-secondary mb-3">
        Add steps to create a multi-page survey. Questions below a step separator belong to that step.
      </p>
      <Button variant="secondary" size="sm" onClick={addFirstStep} className="w-full">
        <Plus className="mr-1.5 h-3 w-3" />
        Enable Steps
      </Button>
    </Card>
  );
}

