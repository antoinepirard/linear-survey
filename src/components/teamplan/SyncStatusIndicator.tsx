import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { SyncState } from '@/hooks/usePlanStorage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SyncStatusIndicatorProps {
  syncState: SyncState;
  syncError: Error | null;
  onRetry?: () => void;
  className?: string;
}

const SyncStatusIndicator = memo(function SyncStatusIndicator({
  syncState,
  syncError,
  onRetry,
  className
}: SyncStatusIndicatorProps) {
  if (syncState === 'idle') {
    return null;
  }

  const getIcon = () => {
    switch (syncState) {
      case 'syncing':
        return <ArrowPathIcon className="w-3 h-3 animate-spin" />;
      case 'synced':
        return <CheckCircleIcon className="w-3 h-3" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-3 h-3" />;
      default:
        return <CloudIcon className="w-3 h-3" />;
    }
  };

  const getColors = () => {
    switch (syncState) {
      case 'syncing':
        return 'text-blue-500';
      case 'synced':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-slate-400';
    }
  };

  const getTooltip = () => {
    switch (syncState) {
      case 'syncing':
        return 'Saving changes...';
      case 'synced':
        return 'All changes saved';
      case 'error':
        return syncError?.message || 'Failed to save changes';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={syncState}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.15 }}
        className={cn('flex items-center gap-1.5', className)}
        title={getTooltip()}
      >
        <div className={cn('flex items-center', getColors())}>
          {getIcon()}
        </div>
        
        {syncState === 'error' && onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-5 px-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Retry
          </Button>
        )}
        
        {syncState === 'synced' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-green-600 font-medium"
          >
            Saved
          </motion.span>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

export default SyncStatusIndicator;