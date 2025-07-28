export interface Project {
  id: string;
  title: string;
  color: string;
  personId?: string; // Optional - undefined for backlog projects
  timeSlotId?: string; // Optional - undefined for backlog projects
  group?: string;
  order?: number; // Optional - for explicit positioning in backlog
}

export interface Person {
  id: string;
  name: string;
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
    { id: '1', name: 'Alice Johnson' },
    { id: '2', name: 'Bob Smith' },
    { id: '3', name: 'Carol Davis' },
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
      color: PROJECT_COLORS[0],
      personId: '1',
      timeSlotId: '1',
      group: 'research',
    },
    {
      id: '2',
      title: 'Login Flow',
      color: PROJECT_COLORS[1],
      personId: '2',
      timeSlotId: '2',
      group: 'frontend',
    },
    {
      id: '3',
      title: 'Design System',
      color: PROJECT_COLORS[2],
      personId: '3',
      timeSlotId: '1',
      group: 'design',
    },
    // Backlog projects (no personId/timeSlotId assignments)
    {
      id: 'backlog-1',
      title: 'Mobile App Research',
      color: PROJECT_COLORS[3],
      group: 'research',
    },
    {
      id: 'backlog-2',
      title: 'API Documentation',
      color: PROJECT_COLORS[4],
      group: 'backend',
    },
    {
      id: 'backlog-3',
      title: 'Performance Optimization',
      color: PROJECT_COLORS[5],
      group: 'engineering',
    },
    {
      id: 'backlog-4',
      title: 'User Analytics Setup',
      color: PROJECT_COLORS[6],
      group: 'research',
    },
    {
      id: 'backlog-5',
      title: 'Accessibility Audit',
      color: PROJECT_COLORS[7],
      // No group = ungrouped project
    },
  ],
};

// Utility functions
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getRandomColor = () => 
  PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];

export const getProjectsForCell = (projects: Project[], personId: string, timeSlotId: string) =>
  projects.filter(project => project.personId === personId && project.timeSlotId === timeSlotId);

export const getAllGroups = (projects: Project[]): string[] =>
  [...new Set(projects.map(p => p.group).filter((group): group is string => Boolean(group)))].sort();

// Utility functions for backlog management
export const getBacklogProjects = (projects: Project[]) =>
  projects.filter(p => !p.personId || !p.timeSlotId);

export const getPlannedProjects = (projects: Project[]) =>
  projects.filter(p => p.personId && p.timeSlotId);

export const getProjectsByGroup = (projects: Project[]) => {
  const backlogProjects = getBacklogProjects(projects);
  const grouped: Record<string, Project[]> = {};
  const ungrouped: Project[] = [];

  backlogProjects.forEach((project) => {
    if (project.group) {
      if (!grouped[project.group]) {
        grouped[project.group] = [];
      }
      grouped[project.group].push(project);
    } else {
      ungrouped.push(project);
    }
  });

  // Sort projects within each group by order
  Object.keys(grouped).forEach((group) => {
    grouped[group].sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  ungrouped.sort((a, b) => (a.order || 0) - (b.order || 0));

  return { grouped, ungrouped };
};