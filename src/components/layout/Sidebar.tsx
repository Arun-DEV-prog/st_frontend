import React from 'react';
import {
  Clipboard,
  Users,
  FileText,
  MessageSquare,
  Folder,
  HelpCircle,
  Settings
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigationItems = [
    { icon: Clipboard, label: 'Specialists', active: true },
    { icon: Users, label: 'Clients', active: false },
    { icon: FileText, label: 'Service Orders', active: false },
    { icon: Clipboard, label: 'Inquiries', active: false },
    { icon: MessageSquare, label: 'Messages', active: false },
    { icon: Folder, label: 'Reports & Receipts', active: false },
  ];

  const footerItems = [
    { icon: HelpCircle, label: 'Help', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden lg:w-64`}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            JL
          </div>
          <div>
            <p className="font-semibold text-gray-800">James Liau</p>
            <p className="text-xs text-gray-500">james-accounting-service</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-current={item.active ? 'page' : undefined}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200 space-y-1">
          {footerItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};