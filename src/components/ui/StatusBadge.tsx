import React from 'react';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'published' | 'draft';
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'published':
        return 'bg-green-500 text-white border-green-500';
      case 'draft':
        return 'bg-red-500 text-white border-red-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
    >
      {children}
    </span>
  );
};