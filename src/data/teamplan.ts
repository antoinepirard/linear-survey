export interface Project {
  id: string;
  title: string;
  description?: string;
  color: string;
  personId: string;
  timeSlotId: string;
}

export interface Person {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  type: 'week' | 'month';
  startDate?: Date;
  endDate?: Date;
}

export interface TeamPlanData {
  people: Person[];
  timeSlots: TimeSlot[];
  projects: Project[];
}

// Project colors for visual variety
export const PROJECT_COLORS = [
  'bg-white border-slate-200 text-slate-800',
  'bg-white border-slate-200 text-slate-800',
  'bg-white border-slate-200 text-slate-800',
  'bg-white border-slate-200 text-slate-800',
  'bg-white border-slate-200 text-slate-800',
  'bg-white border-slate-200 text-slate-800',
  'bg-white border-slate-200 text-slate-800',
  'bg-white border-slate-200 text-slate-800',
] as const;

// Default sample data
export const DEFAULT_TEAMPLAN_DATA: TeamPlanData = {
  people: [
    { id: '1', name: 'Alice Johnson', role: 'Product Manager' },
    { id: '2', name: 'Bob Smith', role: 'Frontend Developer' },
    { id: '3', name: 'Carol Davis', role: 'Designer' },
  ],
  timeSlots: [
    { id: '1', label: 'Week 1', type: 'week' },
    { id: '2', label: 'Week 2', type: 'week' },
    { id: '3', label: 'Week 3', type: 'week' },
    { id: '4', label: 'Week 4', type: 'week' },
  ],
  projects: [
    {
      id: '1',
      title: 'User Research',
      description: 'Conduct user interviews',
      color: PROJECT_COLORS[0],
      personId: '1',
      timeSlotId: '1',
    },
    {
      id: '2',
      title: 'Login Flow',
      description: 'Implement authentication',
      color: PROJECT_COLORS[1],
      personId: '2',
      timeSlotId: '2',
    },
    {
      id: '3',
      title: 'Design System',
      description: 'Create component library',
      color: PROJECT_COLORS[2],
      personId: '3',
      timeSlotId: '1',
    },
  ],
};

// Utility functions
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getRandomColor = () => 
  PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];

export const getProjectsForCell = (projects: Project[], personId: string, timeSlotId: string) =>
  projects.filter(project => project.personId === personId && project.timeSlotId === timeSlotId);