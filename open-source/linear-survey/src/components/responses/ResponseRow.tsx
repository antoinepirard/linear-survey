"use client";

import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Check, ExternalLink, Loader2, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Survey, SurveyResponse, Question, Answer } from "@/lib/types";

interface ResponseRowProps {
  response: SurveyResponse;
  survey: Survey;
  selected: boolean;
  pushing: boolean;
  onToggleSelect: () => void;
  onPushToLinear?: () => void;
  getAnswerDisplay: (question: Question, answer: Answer | undefined) => string;
}

export function ResponseRow({
  response,
  survey,
  selected,
  pushing,
  onToggleSelect,
  onPushToLinear,
  getAnswerDisplay,
}: ResponseRowProps) {
  const [expanded, setExpanded] = useState(false);
  const canPush = !!onPushToLinear;
  const isPushed = !!response.linear_issue_id;

  return (
    <>
      <TableRow className={selected ? "bg-surface-secondary" : ""}>
        <TableCell>
          <Checkbox checked={selected} onChange={onToggleSelect} />
        </TableCell>
        <TableCell className="text-xs text-text-secondary">
          {new Date(response.created_at).toLocaleDateString()}{" "}
          {new Date(response.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </TableCell>
        {survey.questions.slice(0, 4).map((q) => (
          <TableCell key={q.id} className="max-w-[200px]">
            <span className="truncate text-sm">
              {getAnswerDisplay(q, response.answers[q.id])}
            </span>
          </TableCell>
        ))}
        {survey.questions.length > 4 && (
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-7 px-2"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </TableCell>
        )}
        <TableCell>
          {isPushed ? (
            <Badge variant="success">
              <Check className="mr-1 h-3 w-3" />
              Pushed
            </Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            {canPush && !isPushed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPushToLinear}
                disabled={pushing}
                className="h-7 px-2"
              >
                {pushing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            )}
            {isPushed && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() =>
                  window.open(
                    `https://linear.app/issue/${response.linear_issue_id}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded view */}
      {expanded && survey.questions.length > 4 && (
        <TableRow>
          <TableCell colSpan={8} className="bg-surface-secondary">
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {survey.questions.slice(4).map((q) => (
                <div key={q.id}>
                  <p className="text-xs font-medium text-text-secondary">
                    {q.title || "Untitled"}
                  </p>
                  <p className="mt-1 text-sm text-text-primary">
                    {getAnswerDisplay(q, response.answers[q.id])}
                  </p>
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

