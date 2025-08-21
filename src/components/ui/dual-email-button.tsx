"use client";

import { Button } from "@/components/ui/button";
import {
  EnvelopeIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface DualEmailButtonProps {
  email: string;
  className?: string;
}

export function DualEmailButton({ email, className }: DualEmailButtonProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email address copied!");
    } catch (err) {
      console.error("Failed to copy email:", err);
      toast.error("Failed to copy email");
    }
  };

  return (
    <div className={`flex relative ${className || ""}`}>
      <Button
        asChild
        variant="secondary"
        className="bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-800 transition-all duration-150 rounded-r-none border-r-0"
      >
        <a href={`mailto:${email}`}>
          <EnvelopeIcon className="w-4 h-4" />
          Send email
        </a>
      </Button>
      <Button
        onClick={copyToClipboard}
        variant="secondary"
        size="icon"
        className="bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all duration-150 rounded-l-none"
      >
        <ClipboardDocumentIcon className="w-4 h-4" />
      </Button>
      <div className="absolute top-1/2 -translate-y-1/2 right-9 w-px h-4 bg-slate-200 pointer-events-none" />
    </div>
  );
}
