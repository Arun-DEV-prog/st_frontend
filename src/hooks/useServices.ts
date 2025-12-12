import { useState, useEffect } from 'react';
import { Service, TabType } from '../types/service';

const mockServices: Service[] = [
  { id: 1, service: 'Incorporation of a new company', price: 'RM 2,000', purchases: 0, duration: '3 Days', approvalStatus: 'approved', publishStatus: 'published' },
  { id: 2, service: 'Incorporation of a new company', price: 'RM 2,000', purchases: 0, duration: '1 Day', approvalStatus: 'approved', publishStatus: 'published' },
  { id: 3, service: 'Incorporation of a new company', price: 'RM 2,000', purchases: 498, duration: '14 Days', approvalStatus: 'pending', publishStatus: 'published' },
  { id: 4, service: 'Incorporation of a new company', price: 'RM 2,000', purchases: 0, duration: '7 Days', approvalStatus: 'pending', publishStatus: 'published' },
  { id: 5, service: 'Incorporation of a new company', price: 'RM 2,000', purchases: 5883, duration: '4 Days', approvalStatus: 'rejected', publishStatus: 'draft' },
  { id: 6, service: 'Incorporation of a new company', price: 'RM 2,000', purchases: 5385, duration: '5 Days', approvalStatus: 'rejected', publishStatus: 'draft' },
];

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchServices = async () => {
      try {
        setLoading(true);
        // In real app, this would be: await api.getServices()
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        setServices(mockServices);
      } catch (err) {
        setError('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filterServices = (services: Service[], activeTab: TabType, searchTerm: string) => {
    return services.filter(service => {
      const matchesTab = activeTab === 'All' ||
        (activeTab === 'Drafts' && service.publishStatus === 'draft') ||
        (activeTab === 'Published' && service.publishStatus === 'published');

      const matchesSearch = service.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.price.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  };

  return {
    services,
    loading,
    error,
    filterServices,
    setServices
  };
};