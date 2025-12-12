import React from 'react';
import { Menu, X, Settings, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div>
            <p className="text-sm text-gray-500">Dashboard</p>
            <h1 className="text-2xl font-semibold text-gray-800">Services</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            aria-label="Settings"
          >
            <Settings size={20} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};