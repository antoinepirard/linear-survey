'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">TeamPlan</h1>
          <p className="text-slate-600">Intuitive project planning for product teams</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6"
        >
          <TeamPlanBoard 
            data={teamPlanData}
            onChange={handleDataChange}
          />
        </motion.div>
      </div>
    </div>
  );
}