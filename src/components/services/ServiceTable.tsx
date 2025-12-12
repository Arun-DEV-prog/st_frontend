import React, { useState, useMemo } from 'react';
import { Service, TabType } from '../../types/service';
import { useServices } from '../../hooks/useServices';
import { usePagination } from '../../hooks/usePagination';
import { ServiceFilters } from './ServiceFilters';
import { ServiceRow } from './ServiceRow';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 10;

export const ServiceTable: React.FC = () => {
  const { services, loading, error, filterServices } = useServices();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<Set<number>>(new Set());

  const filteredServices = useMemo(() => {
    return filterServices(services, activeTab, searchTerm);
  }, [services, activeTab, searchTerm, filterServices]);

  const {
    currentPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage
  } = usePagination({
    totalItems: filteredServices.length,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  const handleSelectService = (id: number) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedServices(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedServices.size === paginatedServices.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(paginatedServices.map(s => s.id)));
    }
  };

  const handleEdit = (id: number) => {
    console.log('Edit service:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: number) => {
    console.log('Delete service:', id);
    // TODO: Implement delete functionality
  };

  const handleCreate = () => {
    console.log('Create new service');
    // TODO: Implement create functionality
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error loading services</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <ServiceFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={handleCreate}
      />

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedServices.size === paginatedServices.length && paginatedServices.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                  aria-label="Select all services"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchases
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publish Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedServices.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            ) : (
              paginatedServices.map((service) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  isSelected={selectedServices.has(service.id)}
                  onSelect={handleSelectService}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={goToPage}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
};