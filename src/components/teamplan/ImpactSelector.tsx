'use client';

import { ProjectImpact } from '@/data/teamplan';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

interface ImpactSelectorProps {
  impact?: ProjectImpact;
  onChange: (impact: ProjectImpact) => void;
  disabled?: boolean;
}

const impactConfig = {
  low: {
    icon: '/Assets/TeamPlan-Ravell/priority-low.svg',
    label: 'Low',
    color: 'text-slate-600',
    hoverColor: 'hover:text-slate-700 hover:bg-slate-50',
  },
  medium: {
    icon: '/Assets/TeamPlan-Ravell/priority-medium.svg',
    label: 'Medium',
    color: 'text-slate-600',
    hoverColor: 'hover:text-slate-700 hover:bg-slate-50',
  },
  high: {
    icon: '/Assets/TeamPlan-Ravell/priority-high.svg',
    label: 'High',
    color: 'text-slate-600',
    hoverColor: 'hover:text-slate-700 hover:bg-slate-50',
  },
  urgent: {
    icon: '/Assets/TeamPlan-Ravell/priority-urgent.svg',
    label: 'Urgent',
    color: 'text-orange-600',
    hoverColor: 'hover:text-orange-700 hover:bg-orange-50',
  },
};

export default function ImpactSelector({ impact, onChange, disabled = false }: ImpactSelectorProps) {
  const currentConfig = impact ? impactConfig[impact] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
          {currentConfig ? (
            <Image
              src={currentConfig.icon}
              alt={currentConfig.label}
              width={14}
              height={14}
              className="w-3.5 h-3.5"
            />
          ) : (
            <Image
              src="/Assets/TeamPlan-Ravell/priority-unset.svg"
              alt="No impact set"
              width={14}
              height={14}
              className="w-3.5 h-3.5"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32" align="start">
        {Object.entries(impactConfig).map(([level, config]) => {
          return (
            <DropdownMenuItem
              key={level}
              onClick={() => onChange(level as ProjectImpact)}
              className={`flex items-center gap-2 ${config.color} cursor-pointer`}
            >
              <Image
                src={config.icon}
                alt={config.label}
                width={16}
                height={16}
                className="w-4 h-4"
              />
              {config.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 