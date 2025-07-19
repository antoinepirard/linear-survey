'use client';

import { useState, useEffect } from 'react';
import TeamPlanBoard from '@/components/teamplan/TeamPlanBoard';
import { TeamPlanData, DEFAULT_TEAMPLAN_DATA } from '@/data/teamplan';

const STORAGE_KEY = 'teamplan-data';

export default function TeamPlanPage() {
  const [teamPlanData, setTeamPlanData] = useState<TeamPlanData>(DEFAULT_TEAMPLAN_DATA);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTeamPlanData(parsed);
        } catch (error) {
          console.error('Failed to parse saved TeamPlan data:', error);
        }
      }
    }
  }, []);

  const handleDataChange = (newData: TeamPlanData) => {
    setTeamPlanData(newData);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }
  };

  return (
    <div className="h-screen bg-white overflow-hidden">
      <TeamPlanBoard 
        data={teamPlanData}
        onChange={handleDataChange}
      />
    </div>
  );
}