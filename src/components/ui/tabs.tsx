'use client';

import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
}

export function Tabs({ 
  tabs, 
  defaultTab, 
  className = "", 
  tabClassName = "",
  contentClassName = ""
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 overflow-hidden">
        <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-4 text-sm font-medium relative transition-colors duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                activeTab === tab.id
                  ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-900 after:translate-y-px'
                  : 'text-slate-500 hover:text-slate-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-300 after:opacity-0 hover:after:opacity-100 hover:after:translate-y-px after:transition-all after:duration-200'
              } ${tabClassName}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={contentClassName} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}