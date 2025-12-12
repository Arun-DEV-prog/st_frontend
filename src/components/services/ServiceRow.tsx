import React from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { Service } from '../../types/service';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

interface ServiceRowProps {
  service: Service;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ServiceRow: React.FC<ServiceRowProps> = ({
  service,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(service.id)}
          className="rounded border-gray-300"
          aria-label={`Select service ${service.service}`}
        />
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {service.service}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {service.price}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {service.purchases}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {service.duration}
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={service.approvalStatus}>
          {service.approvalStatus.charAt(0).toUpperCase() + service.approvalStatus.slice(1)}
        </StatusBadge>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={service.publishStatus}>
          {service.publishStatus.charAt(0).toUpperCase() + service.publishStatus.slice(1)}
        </StatusBadge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(service.id)}
            aria-label={`Edit service ${service.service}`}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(service.id)}
            className="text-red-600 hover:text-red-700"
            aria-label={`Delete service ${service.service}`}
          >
            <Trash2 size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="More actions"
          >
            <MoreVertical size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
};