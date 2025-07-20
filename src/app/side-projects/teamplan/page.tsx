'use client';

import { useState, useEffect } from 'react';
import TeamPlanBoard from '@/components/teamplan/TeamPlanBoard';
import { TeamPlanData, DEFAULT_TEAMPLAN_DATA } from '@/data/teamplan';

const STORAGE_KEY = 'teamplan-data';

export default function TeamPlanPage() {
  const [teamPlanData, setTeamPlanData] = useState<TeamPlanData>(DEFAULT_TEAMPLAN_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('🔍 TeamPlanPage: Loading data from localStorage...');
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('🔍 TeamPlanPage: Retrieved from localStorage:', saved ? 'Data found' : 'No data found');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('🔍 TeamPlanPage: Parsed data:', parsed);
          console.log('🔍 TeamPlanPage: Projects count:', parsed.projects?.length || 0);
          setTeamPlanData(parsed);
          console.log('✅ TeamPlanPage: Successfully loaded data from localStorage');
        } catch (error) {
          console.error('❌ TeamPlanPage: Failed to parse saved TeamPlan data:', error);
        }
      } else {
        console.log('🔍 TeamPlanPage: No saved data found, using default data');
      }
    }
    setIsLoading(false);
  }, []);

  const handleDataChange = (newData: TeamPlanData) => {
    console.log('🔄 TeamPlanPage: handleDataChange called');
    console.log('🔄 TeamPlanPage: New data projects count:', newData.projects?.length || 0);
    console.log('🔄 TeamPlanPage: New data:', newData);
    
    setTeamPlanData(newData);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const serialized = JSON.stringify(newData);
        localStorage.setItem(STORAGE_KEY, serialized);
        console.log('✅ TeamPlanPage: Successfully saved to localStorage');
        console.log('✅ TeamPlanPage: Saved data size:', serialized.length, 'characters');
        
        // Verify the save worked
        const verification = localStorage.getItem(STORAGE_KEY);
        console.log('🔍 TeamPlanPage: Verification - data saved correctly:', verification === serialized);
      } catch (error) {
        console.error('❌ TeamPlanPage: Failed to save to localStorage:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-white overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
          <p className="text-slate-600 text-sm">Loading your team plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white overflow-hidden">
      <TeamPlanBoard 
        data={teamPlanData}
        onChange={handleDataChange}
      />
    </div>
  );
}