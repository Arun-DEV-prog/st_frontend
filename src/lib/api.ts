// API utilities for service management
export const api = {
  // Accept params for pagination, tab, search
  getServices: async ({ page = 1, limit = 10, tab, search }: { page?: number; limit?: number; tab?: string; search?: string } = {}) => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    // Map tab to status param for API
    if (tab === 'Drafts') params.append('status', 'draft');
    if (tab === 'Published') params.append('status', 'published');
    if (search) params.append('search', search);
    return fetch(`http://localhost:5000/api/specialists?${params.toString()}`).then(res => res.json());
  },

  createService: async (service: any) => {
    // return fetch('/api/services', { method: 'POST', body: JSON.stringify(service) });
    throw new Error('Not implemented');
  },

  updateService: async (id: number, service: any) => {
    // return fetch(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(service) });
    throw new Error('Not implemented');
  },

  deleteService: async (id: string) => {
    // Call backend API to delete specialist
    const res = await fetch(`http://localhost:5000/api/specialists/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete specialist');
    // Some backends return no content for DELETE (204), so check before parsing JSON
    if (res.status === 204) return true;
    try {
      return await res.json();
    } catch {
      return true;
    }
  }
};