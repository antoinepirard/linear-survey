'use client';

import { useState } from 'react';
import { NotepadDocument } from '@/types/plan';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronsUpDown, Plus, Trash2, Check, FileText } from 'lucide-react';

interface DocumentSelectorProps {
  currentDocument: NotepadDocument | null;
  allDocuments: NotepadDocument[];
  onSelectDocument: (documentId: string) => void;
  onCreateDocument: (title: string) => void;
  onDeleteDocument: (documentId: string) => void;
  onRenameDocument?: (documentId: string, newTitle: string) => void;
}

interface CreateDocumentDialogProps {
  onCreateDocument: (title: string) => void;
}

const CreateDocumentDialog: React.FC<CreateDocumentDialogProps> = ({ onCreateDocument }) => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (documentTitle.trim()) {
      onCreateDocument(documentTitle.trim());
      setDocumentTitle('');
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
          title="Create new document"
        >
          <Plus className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Enter document title..."
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
              disabled={!documentTitle.trim()}
            >
              Create Document
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  currentDocument,
  allDocuments,
  onSelectDocument,
  onCreateDocument,
  onDeleteDocument,
  onRenameDocument,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleSelectDocument = (documentId: string) => {
    onSelectDocument(documentId);
    setIsPopoverOpen(false);
  };

  const handleDeleteClick = (documentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (allDocuments.length <= 1) {
      return; // Don't allow deleting the last document
    }
    setDeleteConfirmId(documentId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteDocument(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleRenameClick = (document: NotepadDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDocumentId(document.id);
    setEditTitle(document.title);
  };

  const handleRenameSave = () => {
    if (editingDocumentId && editTitle.trim() && onRenameDocument) {
      onRenameDocument(editingDocumentId, editTitle.trim());
    }
    setEditingDocumentId(null);
    setEditTitle('');
  };

  const handleRenameCancel = () => {
    setEditingDocumentId(null);
    setEditTitle('');
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSave();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else if (diffInSeconds < 2419200) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w ago`;
    } else {
      // For older dates, fall back to month/day format
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const getWordCount = (content: string): number => {
    if (!content) return 0;
    // Remove HTML tags and count words
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text ? text.split(/\s+/).length : 0;
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
            <div className="flex items-center gap-2">
              <FileText className="size-3.5 opacity-50" />
              <span className="text-sm truncate max-w-[150px]">
                {currentDocument?.title || 'No Document Selected'}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 size-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="px-4 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-slate-500 font-mono">Documents</span>
              <CreateDocumentDialog onCreateDocument={onCreateDocument} />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto p-2">
            {allDocuments.map((document, index) => (
              <div
                key={document.id}
                className="px-3 py-2 hover:bg-slate-50 hover:rounded-lg cursor-pointer flex items-center justify-between group transition-all duration-150"
                onClick={() => editingDocumentId !== document.id && handleSelectDocument(document.id)}
              >
                <div className="flex-1 min-w-0">
                  {editingDocumentId === document.id ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={handleRenameKeyDown}
                      onBlur={handleRenameSave}
                      className="h-6 text-sm font-medium px-1 py-0"
                      maxLength={50}
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="font-medium text-sm truncate hover:bg-slate-100 px-1 py-0.5 rounded cursor-text inline-block"
                      onClick={(e) => handleRenameClick(document, e)}
                    >
                      {document.title}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground px-1 flex items-center gap-2 -mt-0.5">
                    <span>{formatDate(document.updatedAt)}</span>
                    <span>•</span>
                    <span>{getWordCount(document.content)} words</span>
                  </div>
                </div>
                
                <div className="relative flex items-center justify-end gap-2">
                  {/* Keyboard shortcut indicator */}
                  {index < 9 && (
                    <div className="hidden group-hover:flex items-center bg-white px-1.5 py-0.5 rounded text-xs font-mono text-slate-600 border">
                      ⌘{index + 1}
                    </div>
                  )}
                  
                  <div className="relative flex items-center justify-end w-6 h-6">
                    {currentDocument?.id === document.id && (
                      <Check className="h-3.5 w-3.5 text-primary/70 group-hover:opacity-0 transition-opacity" />
                    )}
                    {allDocuments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteClick(document.id, e)}
                        className="absolute opacity-0 group-hover:opacity-100 h-5 w-5 p-0"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
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
              <DialogTitle>Delete Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete &quot;{allDocuments.find(d => d.id === deleteConfirmId)?.title}&quot;? 
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

export default DocumentSelector; 