import { TeamPlanData } from '@/data/teamplan';

export interface Plan {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  teamPlanData: TeamPlanData;
  notepadData: {
    content: string;
    title: string;
    width: number;
  };
}

export interface PlanMetadata {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanStorage {
  currentPlanId: string | null;
  plans: Record<string, Plan>;
}