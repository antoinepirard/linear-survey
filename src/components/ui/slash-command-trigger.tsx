'use client';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useHotkeys } from 'react-hotkeys-hook';

interface SlashCommandTriggerProps {
  editor: Editor | null;
  text?: string;
  trigger?: string;
  hideWhenUnavailable?: boolean;
  onTriggered?: (trigger: string) => void;
}

export default function SlashCommandTrigger({
  editor,
  text = "Insert Block",
  trigger = "/",
  hideWhenUnavailable = true,
  onTriggered
}: SlashCommandTriggerProps) {
  const insertTrigger = () => {
    if (!editor) return;
    
    // Insert the trigger character at the current cursor position
    editor.commands.insertContent(trigger);
    editor.commands.focus();
    
    onTriggered?.(trigger);
  };

  // Add keyboard shortcut (Cmd/Ctrl + /)
  useHotkeys('meta+/', insertTrigger, { enabled: !!editor });
  useHotkeys('ctrl+/', insertTrigger, { enabled: !!editor });

  // Hide if editor is not available and hideWhenUnavailable is true
  if (hideWhenUnavailable && !editor) {
    return null;
  }

  // Check if insertion is possible
  const canInsert = editor?.can().insertContent(trigger) ?? false;
  
  if (hideWhenUnavailable && !canInsert) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={insertTrigger}
      disabled={!editor || !canInsert}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      title={`${text} (Cmd/Ctrl + /)`}
    >
      <PlusCircleIcon className="h-4 w-4" />
      {text}
    </Button>
  );
}