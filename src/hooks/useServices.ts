import { useState, useEffect } from 'react';
import { Service, TabType } from '../types/service';

const mockServices: Service[] = [
  { id: 1, service: 'Dr. Sarah Johnson - Cardiologist', price: 'RM 500', purchases: 25, duration: '30 min', approvalStatus: 'approved', publishStatus: 'published' },
  { id: 2, service: 'Dr. Michael Chen - Dermatologist', price: 'RM 300', purchases: 18, duration: '45 min', approvalStatus: 'approved', publishStatus: 'published' },
  { id: 3, service: 'Dr. Emily Davis - Pediatrician', price: 'RM 400', purchases: 32, duration: '20 min', approvalStatus: 'pending', publishStatus: 'published' },
  { id: 4, service: 'Dr. Robert Wilson - Orthopedic Surgeon', price: 'RM 800', purchases: 15, duration: '60 min', approvalStatus: 'pending', publishStatus: 'published' },
  { id: 5, service: 'Dr. Lisa Brown - Psychiatrist', price: 'RM 600', purchases: 28, duration: '50 min', approvalStatus: 'rejected', publishStatus: 'draft' },
  { id: 6, service: 'Dr. James Miller - Ophthalmologist', price: 'RM 350', purchases: 22, duration: '40 min', approvalStatus: 'rejected', publishStatus: 'draft' },
  { id: 7, service: 'Dr. Maria Garcia - Gynecologist', price: 'RM 450', purchases: 30, duration: '35 min', approvalStatus: 'approved', publishStatus: 'published' },
  { id: 8, service: 'Dr. David Lee - Dentist', price: 'RM 250', purchases: 45, duration: '30 min', approvalStatus: 'approved', publishStatus: 'published' },
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