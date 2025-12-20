import React from 'react';
import { TabType } from '../../types/service';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ServiceFiltersProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateClick: () => void;
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  onCreateClick
}) => {
  const tabs: TabType[] = ['All', 'Drafts', 'Published'];

  return (
    <div className="border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Specialists</h2>
          <div className="flex space-x-4 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`pb-2 ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                aria-pressed={activeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          type="text"
          placeholder="Search Specialists"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />
        <div className="flex gap-2">
          <Button onClick={onCreateClick}>
            Create Specialists
          </Button>
          <Button variant="outline">
            Action
          </Button>
        </div>
      </div>
    </div>
  );
};