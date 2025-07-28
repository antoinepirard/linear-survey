'use client';

import { ProjectImpact } from '@/data/teamplan';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  ExclamationTriangleIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface ImpactSelectorProps {
  impact?: ProjectImpact;
  onChange: (impact: ProjectImpact) => void;
  disabled?: boolean;
}

const impactConfig = {
  low: {
    icon: ChevronDownIcon,
    label: 'Low',
    color: 'text-slate-500',
    hoverColor: 'hover:text-slate-700 hover:bg-slate-50',
  },
  medium: {
    icon: ChevronUpIcon,
    label: 'Medium',
    color: 'text-blue-500',
    hoverColor: 'hover:text-blue-700 hover:bg-blue-50',
  },
  high: {
    icon: ExclamationTriangleIcon,
    label: 'High',
    color: 'text-orange-500',
    hoverColor: 'hover:text-orange-700 hover:bg-orange-50',
  },
  urgent: {
    icon: FireIcon,
    label: 'Urgent',
    color: 'text-red-500',
    hoverColor: 'hover:text-red-700 hover:bg-red-50',
  },
};

export default function ImpactSelector({ impact, onChange, disabled = false }: ImpactSelectorProps) {
  const currentConfig = impact ? impactConfig[impact] : null;
  const CurrentIcon = currentConfig?.icon;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={`
            h-6 w-6 p-0 rounded-md transition-colors
            ${currentConfig ? 
              `${currentConfig.color} ${currentConfig.hoverColor}` : 
              'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }
          `}
          title={currentConfig ? `Impact: ${currentConfig.label}` : 'Set impact level'}
        >
          {CurrentIcon ? (
            <CurrentIcon className="h-3.5 w-3.5" />
          ) : (
            <span className="text-xs font-mono">?</span>
          )}
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        {Object.entries(impactConfig).map(([level, config]) => {
          const Icon = config.icon;
          return (
            <ContextMenuItem
              key={level}
              onClick={() => onChange(level as ProjectImpact)}
              className={`flex items-center gap-2 ${config.color}`}
            >
              <Icon className="h-4 w-4" />
              {config.label}
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
} 