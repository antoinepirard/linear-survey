"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Radio } from "@/components/ui/Radio";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";
import {
  Question,
  TextQuestion,
  ChoiceQuestion,
  RatingQuestion,
  EmailQuestion,
  Answer,
} from "@/lib/types";

interface QuestionRendererProps {
  question: Question;
  value: Answer | undefined;
  error?: string;
  onChange: (value: Answer) => void;
}

function QuestionHeader({
  question,
  error,
}: {
  question: Question;
  error?: string;
}) {
  return (
    <div className="mb-4">
      <Label required={question.required} className="text-base font-medium">
        {question.title || "Untitled Question"}
      </Label>
      {question.description && (
        <p className="mt-1 text-sm text-text-secondary">
          {question.description}
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Short Text
export function ShortTextRenderer({
  question,
  value,
  error,
  onChange,
}: QuestionRendererProps) {
  const q = question as TextQuestion;
  return (
    <div>
      <QuestionHeader question={question} error={error} />
      <Input
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder || "Your answer..."}
        error={!!error}
      />
    </div>
  );
}

// Long Text
export function LongTextRenderer({
  question,
  value,
  error,
  onChange,
}: QuestionRendererProps) {
  const q = question as TextQuestion;
  return (
    <div>
      <QuestionHeader question={question} error={error} />
      <Textarea
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder || "Your answer..."}
        error={!!error}
        className="min-h-[120px]"
      />
    </div>
  );
}

// Single Choice
export function SingleChoiceRenderer({
  question,
  value,
  error,
  onChange,
}: QuestionRendererProps) {
  const q = question as ChoiceQuestion;
  return (
    <div>
      <QuestionHeader question={question} error={error} />
      <div className="space-y-2">
        {q.options.map((option, index) => (
          <label
            key={index}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
              value === option
                ? "border-accent bg-accent-light"
                : "border-border hover:border-border-hover"
            )}
          >
            <Radio
              name={question.id}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="text-sm text-text-primary">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Multiple Choice
export function MultipleChoiceRenderer({
  question,
  value,
  error,
  onChange,
}: QuestionRendererProps) {
  const q = question as ChoiceQuestion;
  const selected = (value as string[]) || [];

  function toggleOption(option: string) {
    const isSelected = selected.includes(option);
    if (isSelected) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div>
      <QuestionHeader question={question} error={error} />
      <div className="space-y-2">
        {q.options.map((option, index) => {
          const isChecked = selected.includes(option);
          return (
            <label
              key={index}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                isChecked
                  ? "border-accent bg-accent-light"
                  : "border-border hover:border-border-hover"
              )}
            >
              <Checkbox
                checked={isChecked}
                onChange={() => toggleOption(option)}
              />
              <span className="text-sm text-text-primary">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// Rating
export function RatingRenderer({
  question,
  value,
  error,
  onChange,
}: QuestionRendererProps) {
  const q = question as RatingQuestion;
  const selectedValue = value as number | undefined;

  const scale = Array.from(
    { length: q.max - q.min + 1 },
    (_, i) => q.min + i
  );

  return (
    <div>
      <QuestionHeader question={question} error={error} />
      <div className="flex flex-col gap-3">
        <div className="flex justify-between gap-2">
          {scale.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                selectedValue === num
                  ? "border-accent bg-accent text-white"
                  : "border-border text-text-primary hover:border-border-hover hover:bg-surface-secondary"
              )}
            >
              {num}
            </button>
          ))}
        </div>
        {(q.minLabel || q.maxLabel) && (
          <div className="flex justify-between text-xs text-text-tertiary">
            <span>{q.minLabel}</span>
            <span>{q.maxLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Email
export function EmailRenderer({
  question,
  value,
  error,
  onChange,
}: QuestionRendererProps) {
  const q = question as EmailQuestion;
  return (
    <div>
      <QuestionHeader question={question} error={error} />
      <Input
        type="email"
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder || "you@example.com"}
        error={!!error}
      />
    </div>
  );
}

