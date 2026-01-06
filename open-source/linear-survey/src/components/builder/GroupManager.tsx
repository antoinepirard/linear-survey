"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Layers,
} from "lucide-react";
import { QuestionGroup } from "@/lib/types";

interface GroupManagerProps {
  groups: QuestionGroup[];
  onChange: (groups: QuestionGroup[]) => void;
}

export function GroupManager({ groups, onChange }: GroupManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  function addGroup() {
    const newGroup: QuestionGroup = {
      id: crypto.randomUUID(),
      title: `Step ${groups.length + 1}`,
    };
    onChange([...groups, newGroup]);
    setEditingId(newGroup.id);
  }

  function updateGroup(id: string, updates: Partial<QuestionGroup>) {
    onChange(groups.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }

  function deleteGroup(id: string) {
    onChange(groups.filter((g) => g.id !== id));
  }

  function moveGroup(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= groups.length) return;

    const updated = [...groups];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  }

  if (groups.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-text-secondary" />
            <p className="text-sm font-medium text-text-primary">Steps</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary mb-3">
          Add steps to create a multi-page survey. Questions will be grouped by step.
        </p>
        <Button variant="secondary" size="sm" onClick={addGroup} className="w-full">
          <Plus className="mr-1.5 h-3 w-3" />
          Add First Step
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-text-secondary" />
          <p className="text-sm font-medium text-text-primary">Steps</p>
        </div>
        <Button variant="ghost" size="sm" onClick={addGroup} className="h-7 px-2">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {groups.map((group, index) => (
          <div
            key={group.id}
            className="flex items-center gap-2 p-2 rounded bg-surface-secondary group"
          >
            <div className="text-text-tertiary cursor-grab">
              <GripVertical className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              {editingId === group.id ? (
                <Input
                  value={group.title}
                  onChange={(e) => updateGroup(group.id, { title: e.target.value })}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditingId(null);
                  }}
                  autoFocus
                  className="h-7 text-sm"
                />
              ) : (
                <button
                  onClick={() => setEditingId(group.id)}
                  className="text-sm text-text-primary hover:text-accent truncate block w-full text-left"
                >
                  {group.title || `Step ${index + 1}`}
                </button>
              )}
            </div>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveGroup(index, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveGroup(index, "down")}
                disabled={index === groups.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteGroup(group.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-text-tertiary">
        Assign questions to steps using the dropdown in each question.
      </p>
    </Card>
  );
}

