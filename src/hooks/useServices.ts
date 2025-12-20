
import React, { useState, useEffect } from 'react';
import { Service, TabType } from '../types/service';
import { api } from '../lib/api';


export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServices = async (page = 1, limit = 10, tab = activeTab, search = searchTerm) => {
    try {
      setLoading(true);
      // Pass pagination, tab, and search to API if supported
      const response = await api.getServices({ page, limit, tab, search });
      if (response && Array.isArray(response.data)) {
        const mapped = response.data.map((item: any) => ({
          id: item.id,
          service: item.title,
          price: `RM ${item.final_price}`,
          purchases: item.total_number_of_ratings,
          duration: `${item.duration_days} days`,
          approvalStatus: item.verification_status || 'pending',
          publishStatus: item.is_draft ? 'draft' : 'published',
        }));
        setServices(mapped);
        setPagination(response.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
      } else {
        setServices([]);
        setPagination({ total: 0, page: 1, limit: 10, totalPages: 1 });
      }
    } catch (err) {
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(pagination.page, pagination.limit, activeTab, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, activeTab, searchTerm]);

  return {
    services,
    loading,
    error,
    pagination,
    setPagination,
    setActiveTab,
    setSearchTerm,
    fetchServices,
    activeTab,
    searchTerm,
  };
};