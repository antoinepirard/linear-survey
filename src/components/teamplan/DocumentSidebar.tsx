'use client';

import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { NotepadDocument } from '@/types/plan';

interface DocumentSidebarProps {
  currentDocument: NotepadDocument | null;
  allDocuments: NotepadDocument[];
  onCreateDocument?: (title: string) => Promise<NotepadDocument> | NotepadDocument | void;
  onSwitchToDocument?: (documentId: string) => void;
  onRenameDocument?: (documentId: string, newTitle: string) => void;
  onDeleteDocument?: (documentId: string) => void;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  currentDocument,
  allDocuments,
  onCreateDocument,
  onSwitchToDocument,
  onDeleteDocument,
}) => {
  return (
    <div className="h-full flex flex-col w-64 border-r border-slate-200/65 flex-shrink-0 bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200/65">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-600">
            Documents [{allDocuments.length}]
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateDocument?.('')}
            className="h-6 w-6 p-0"
            title="Create new document"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-2">
        {allDocuments.map((doc, index) => (
          <div
            key={doc.id}
            className={`px-2 py-1 rounded text-sm cursor-pointer flex items-center justify-between group hover:bg-slate-100 ${
              doc.id === currentDocument?.id ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
            }`}
          >
            <div className="flex-1 min-w-0" onClick={() => onSwitchToDocument?.(doc.id)}>
              <span className="truncate">{doc.title || 'Untitled'}</span>
            </div>
            <div className="flex items-center gap-2">
              {index < 9 && (
                <span className="text-xs font-mono text-slate-400">⌘{index + 1}</span>
              )}
              {allDocuments.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument?.(doc.id);
                  }}
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                  title="Delete document"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentSidebar;