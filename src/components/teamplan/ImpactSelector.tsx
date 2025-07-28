'use client';

import { ProjectImpact } from '@/data/teamplan';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

// Custom priority icons
const PriorityUnsetIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6.5C3.39782 6.5 3.77936 6.65804 4.06066 6.93934C4.34196 7.22064 4.5 7.60218 4.5 8C4.5 8.39782 4.34196 8.77936 4.06066 9.06066C3.77936 9.34196 3.39782 9.5 3 9.5C2.60218 9.5 2.22064 9.34196 1.93934 9.06066C1.65804 8.77936 1.5 8.39782 1.5 8C1.5 7.60218 1.65804 7.22064 1.93934 6.93934C2.22064 6.65804 2.60218 6.5 3 6.5ZM8 6.5C8.39782 6.5 8.77936 6.65804 9.06066 6.93934C9.34196 7.22064 9.5 7.60218 9.5 8C9.5 8.39782 9.34196 8.77936 9.06066 9.06066C8.77936 9.34196 8.39782 9.5 8 9.5C7.60218 9.5 7.22064 9.34196 6.93934 9.06066C6.65804 8.77936 6.5 8.39782 6.5 8C6.5 7.60218 6.65804 7.22064 6.93934 6.93934C7.22064 6.65804 7.60218 6.5 8 6.5ZM13 6.5C13.3978 6.5 13.7794 6.65804 14.0607 6.93934C14.342 7.22064 14.5 7.60218 14.5 8C14.5 8.39782 14.342 8.77936 14.0607 9.06066C13.7794 9.34196 13.3978 9.5 13 9.5C12.6022 9.5 12.2206 9.34196 11.9393 9.06066C11.658 8.77936 11.5 8.39782 11.5 8C11.5 7.60218 11.658 7.22064 11.9393 6.93934C12.2206 6.65804 12.6022 6.5 13 6.5Z" fill="currentColor"/>
  </svg>
);

const PriorityLowIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5H7C6.44772 5 6 5.44772 6 6V13C6 13.5523 6.44772 14 7 14H8C8.55228 14 9 13.5523 9 13V6C9 5.44772 8.55228 5 8 5Z" fill="currentColor" opacity="0.3"/>
    <path d="M3 8H2C1.44772 8 1 8.44772 1 9V13C1 13.5523 1.44772 14 2 14H3C3.55228 14 4 13.5523 4 13V9C4 8.44772 3.55228 8 3 8Z" fill="currentColor"/>
    <path d="M13 2H12C11.4477 2 11 2.44772 11 3V13C11 13.5523 11.4477 14 12 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" fill="currentColor" opacity="0.3"/>
  </svg>
);

const PriorityMediumIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5H7C6.44772 5 6 5.44772 6 6V13C6 13.5523 6.44772 14 7 14H8C8.55228 14 9 13.5523 9 13V6C9 5.44772 8.55228 5 8 5Z" fill="currentColor"/>
    <path d="M3 8H2C1.44772 8 1 8.44772 1 9V13C1 13.5523 1.44772 14 2 14H3C3.55228 14 4 13.5523 4 13V9C4 8.44772 3.55228 8 3 8Z" fill="currentColor"/>
    <path d="M13 2H12C11.4477 2 11 2.44772 11 3V13C11 13.5523 11.4477 14 12 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" fill="currentColor" opacity="0.3"/>
  </svg>
);

const PriorityHighIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5H7C6.44772 5 6 5.44772 6 6V13C6 13.5523 6.44772 14 7 14H8C8.55228 14 9 13.5523 9 13V6C9 5.44772 8.55228 5 8 5Z" fill="currentColor"/>
    <path d="M3 8H2C1.44772 8 1 8.44772 1 9V13C1 13.5523 1.44772 14 2 14H3C3.55228 14 4 13.5523 4 13V9C4 8.44772 3.55228 8 3 8Z" fill="currentColor"/>
    <path d="M13 2H12C11.4477 2 11 2.44772 11 3V13C11 13.5523 11.4477 14 12 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" fill="currentColor"/>
  </svg>
);

const PriorityUrgentIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.99998 1C2.46956 1 1.96085 1.21071 1.58578 1.58578C1.21071 1.96085 1 2.46956 1 2.99998V12.9999C1 13.5303 1.21071 14.039 1.58578 14.4141C1.96085 14.7892 2.46956 14.9999 2.99998 14.9999H12.9999C13.5303 14.9999 14.039 14.7892 14.4141 14.4141C14.7892 14.039 14.9999 13.5303 14.9999 12.9999V2.99998C14.9999 2.46956 14.7892 1.96085 14.4141 1.58578C14.039 1.21071 13.5303 1 12.9999 1H2.99998ZM6.91395 3.99998H8.65194L8.49994 9.60193H7.06995L6.91395 3.99998ZM8.72294 11.1639C8.71983 11.4117 8.62001 11.6485 8.44477 11.8237C8.26953 11.999 8.03275 12.0988 7.78495 12.1019C7.65979 12.106 7.53508 12.0849 7.41825 12.0398C7.30141 11.9948 7.19484 11.9267 7.10485 11.8396C7.01487 11.7525 6.94331 11.6482 6.89445 11.5329C6.84558 11.4176 6.8204 11.2936 6.8204 11.1684C6.8204 11.0432 6.84558 10.9192 6.89445 10.804C6.94331 10.6887 7.01487 10.5844 7.10485 10.4973C7.19484 10.4102 7.30141 10.3421 7.41825 10.297C7.53508 10.2519 7.65979 10.2308 7.78495 10.2349C8.28494 10.2349 8.71894 10.6519 8.72294 11.1639Z" fill="currentColor"/>
  </svg>
);

interface ImpactSelectorProps {
  impact?: ProjectImpact;
  onChange: (impact: ProjectImpact) => void;
  disabled?: boolean;
}

const impactConfig = {
  low: {
    icon: PriorityLowIcon,
    label: 'Low',
    color: 'text-slate-500',
    hoverColor: 'hover:text-slate-700 hover:bg-slate-50',
  },
  medium: {
    icon: PriorityMediumIcon,
    label: 'Medium',
    color: 'text-blue-500',
    hoverColor: 'hover:text-blue-700 hover:bg-blue-50',
  },
  high: {
    icon: PriorityHighIcon,
    label: 'High',
    color: 'text-orange-500',
    hoverColor: 'hover:text-orange-700 hover:bg-orange-50',
  },
  urgent: {
    icon: PriorityUrgentIcon,
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
            <PriorityUnsetIcon className="h-3.5 w-3.5" />
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