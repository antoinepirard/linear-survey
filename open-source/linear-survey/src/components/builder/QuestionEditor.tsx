"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  GripVertical,
  Plus,
  X,
} from "lucide-react";
import {
  Question,
  QuestionGroup,
  QUESTION_TYPE_LABELS,
  ChoiceQuestion,
  RatingQuestion,
  TextQuestion,
  EmailQuestion,
} from "@/lib/types";

interface QuestionEditorProps {
  question: Question;
  index: number;
  totalQuestions: number;
  groups: QuestionGroup[];
  onChange: (question: Question) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}

export function QuestionEditor({
  question,
  index,
  totalQuestions,
  groups,
  onChange,
  onDelete,
  onMove,
}: QuestionEditorProps) {
  function updateField<K extends keyof Question>(
    field: K,
    value: Question[K]
  ) {
    onChange({ ...question, [field]: value } as Question);
  }

  function updateOption(optionIndex: number, value: string) {
    if (question.type !== "single_choice" && question.type !== "multiple_choice")
      return;
    const options = [...(question as ChoiceQuestion).options];
    options[optionIndex] = value;
    onChange({ ...question, options } as ChoiceQuestion);
  }

  function addOption() {
    if (question.type !== "single_choice" && question.type !== "multiple_choice")
      return;
    const options = [
      ...(question as ChoiceQuestion).options,
      `Option ${(question as ChoiceQuestion).options.length + 1}`,
    ];
    onChange({ ...question, options } as ChoiceQuestion);
  }

  function removeOption(optionIndex: number) {
    if (question.type !== "single_choice" && question.type !== "multiple_choice")
      return;
    const options = (question as ChoiceQuestion).options.filter(
      (_, i) => i !== optionIndex
    );
    onChange({ ...question, options } as ChoiceQuestion);
  }

  // Get group name for display
  const groupName = groups.find((g) => g.id === question.groupId)?.title;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-secondary px-4 py-2">
        <GripVertical className="h-4 w-4 cursor-grab text-text-tertiary" />
        <span className="text-xs font-medium text-text-secondary">
          {index + 1}. {QUESTION_TYPE_LABELS[question.type]}
        </span>
        {groupName && (
          <span className="text-xs text-accent bg-accent/10 px-1.5 py-0.5 rounded">
            {groupName}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onMove("up")}
            disabled={index === 0}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onMove("down")}
            disabled={index === totalQuestions - 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Title */}
        <div>
          <Label className="mb-1.5 block text-xs text-text-secondary">
            Question
          </Label>
          <Input
            value={question.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Enter your question..."
          />
        </div>

        {/* Description */}
        <div>
          <Label className="mb-1.5 block text-xs text-text-secondary">
            Description (optional)
          </Label>
          <Textarea
            value={question.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Add helpful context..."
            className="min-h-[60px]"
          />
        </div>

        {/* Type-specific fields */}
        {(question.type === "short_text" ||
          question.type === "long_text" ||
          question.type === "email") && (
          <div>
            <Label className="mb-1.5 block text-xs text-text-secondary">
              Placeholder
            </Label>
            <Input
              value={(question as TextQuestion | EmailQuestion).placeholder || ""}
              onChange={(e) =>
                onChange({
                  ...question,
                  placeholder: e.target.value,
                } as TextQuestion | EmailQuestion)
              }
              placeholder="Type your placeholder text..."
            />
          </div>
        )}

        {(question.type === "single_choice" ||
          question.type === "multiple_choice") && (
          <div>
            <Label className="mb-1.5 block text-xs text-text-secondary">
              Options
            </Label>
            <div className="space-y-2">
              {(question as ChoiceQuestion).options.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => removeOption(i)}
                    disabled={(question as ChoiceQuestion).options.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addOption}>
                <Plus className="mr-1 h-3 w-3" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {question.type === "rating" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block text-xs text-text-secondary">
                Min Label
              </Label>
              <Input
                value={(question as RatingQuestion).minLabel || ""}
                onChange={(e) =>
                  onChange({
                    ...question,
                    minLabel: e.target.value,
                  } as RatingQuestion)
                }
                placeholder="e.g., Not likely"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs text-text-secondary">
                Max Label
              </Label>
              <Input
                value={(question as RatingQuestion).maxLabel || ""}
                onChange={(e) =>
                  onChange({
                    ...question,
                    maxLabel: e.target.value,
                  } as RatingQuestion)
                }
                placeholder="e.g., Very likely"
              />
            </div>
          </div>
        )}

        {/* Settings Row */}
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          {/* Required toggle */}
          <div className="flex items-center gap-2">
            <Checkbox
              id={`required-${question.id}`}
              checked={question.required}
              onChange={(e) => updateField("required", e.target.checked)}
            />
            <Label
              htmlFor={`required-${question.id}`}
              className="text-sm font-normal"
            >
              Required
            </Label>
          </div>

          {/* Group selector - only show if groups exist */}
          {groups.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <Label className="text-xs text-text-secondary">Step:</Label>
              <Select
                value={question.groupId || ""}
                onChange={(e) => updateField("groupId", e.target.value || undefined)}
                className="h-8 text-sm w-auto min-w-[120px]"
              >
                <option value="">No step</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.title}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
