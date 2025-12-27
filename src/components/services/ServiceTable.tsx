"use client"
import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Service, TabType } from '../../types/service';
import { useServices } from '../../hooks/useServices';
import { api } from '../../lib/api';
import { usePagination } from '../../hooks/usePagination';
import { ServiceFilters } from './ServiceFilters';
import { ServiceRow } from './ServiceRow';
import { Pagination } from './Pagination';
import { useRouter } from 'next/navigation';


export default function ServiceTable() {
  const {
    services,
    loading,
    error,
    pagination,
    setPagination,
    setActiveTab,
    setSearchTerm,
    activeTab,
    searchTerm,
    fetchServices,
  } = useServices();
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [editId, setEditId] = useState<string|null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const router = useRouter();

  const handleSelectService = (id: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedServices(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedServices.size === services.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(services.map(s => s.id)));
    }
  };

  const handleEdit = async (id: string) => {
    setEditId(id);
    setEditOpen(true);
    setEditLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/specialists/${id}`);
      const data = res.data;
      // Map media array to image1, image2, image3 fields for edit form
      if (Array.isArray(data.media)) {
        data.image1 = data.media[0]?.file_name || '';
        data.image2 = data.media[1]?.file_name || '';
        data.image3 = data.media[2]?.file_name || '';
      }
      setEditData(data);
    } catch (err) {
      alert('Failed to load specialist data');
      setEditOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this specialist?')) return;
    try {
      await api.deleteService(id);
      fetchServices(pagination.page, pagination.limit, activeTab, searchTerm);
    } catch (err) {
      alert('Failed to delete specialist.');
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditId(null);
    setEditData(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditData((prev: any) => {
      const media = [...(prev.media || [])];
      media[idx] = { ...media[idx], file };
      return { ...prev, media };
    });
  };

const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setEditLoading(true);

  try {
    const form = new FormData();

    form.append('title', editData.title);
    form.append('description', editData.description || '');
    form.append('duration_days', Number(editData.duration_days).toString());
    form.append('base_price', Number(editData.base_price).toString());
    form.append('service_category', editData.service_category || '');
    form.append('is_draft', editData.is_draft ? 'true' : 'false');

    // ✅ Additional offerings — append non-empty values as array items
    if (Array.isArray(editData.additional_offerings)) {
      editData.additional_offerings
        .filter((item: any) => item !== undefined && item !== null && String(item).trim() !== '')
        .forEach((item: string) => {
          // append multiple entries with the same name so server parses into an array
          form.append('additional_offerings', item.trim());
        });
    } else if (typeof editData.additional_offerings === 'string' && editData.additional_offerings.trim() !== '') {
      form.append('additional_offerings', editData.additional_offerings.trim());
    }

    // ✅ Images (ONLY THIS WAY)
    if (editData.image1 instanceof File) form.append('image1', editData.image1);
    if (editData.image2 instanceof File) form.append('image2', editData.image2);
    if (editData.image3 instanceof File) form.append('image3', editData.image3);

    // Include specialists id explicitly to ensure backend has a reference
    //if (editId) form.append('specialists', editId);

    // Debug: log form entries to help diagnose missing fields on backend (after append)
    if (typeof window !== 'undefined') {
      try {
        // eslint-disable-next-line no-console
        console.log('FormData entries before submit (after appending specialists):');
        for (const entry of Array.from(form.entries())) {
          // eslint-disable-next-line no-console
          console.log(entry[0], entry[1]);
        }
      } catch (e) {
        // ignore
      }
    }

    await axios.patch(
      `http://localhost:5000/api/specialists/${editId}`,
      form
    );

    alert('Specialist updated successfully!');
    handleEditClose();
    fetchServices(pagination.page, pagination.limit, activeTab, searchTerm);

  } catch (err: any) {
    console.error('UPDATE ERROR:', err.response?.data || err);
    alert('Failed to update specialist');
  } finally {
    setEditLoading(false);
  }
};


  const handleCreate = () => {
    router.push('specialists/create');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPagination((prev: any) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPagination((prev: any) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev: any) => ({ ...prev, page }));
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev: any) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev: any) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow relative">
      <ServiceFilters
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onCreateClick={handleCreate}
      />

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedServices.size === services.length && services.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                  aria-label="Select all services"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consultation Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointments
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
            {services.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            ) : (
              services.map((service) => (
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
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.page < pagination.totalPages}
        hasPrevPage={pagination.page > 1}
        onPageChange={handlePageChange}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />

      {/* Edit Drawer */}
      {editOpen && (
        <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 overflow-y-auto border-l border-gray-200">
          <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Specialist</h2>
              <button type="button" onClick={handleEditClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {editLoading ? (
              <div>Loading...</div>
            ) : editData ? (
              <>
                {/* Title */}
                <input
                  className="w-full border rounded p-2 mb-2"
                  name="title"
                  value={editData.title || ''}
                  onChange={handleEditChange}
                  placeholder="Title"
                  required
                />
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editData.description || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded p-2"
                    rows={4}
                  />
                </div>
                {/* Duration Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Completion Time (Days)</label>
                  <select
                    name="duration_days"
                    value={editData.duration_days || 1}
                    onChange={handleEditChange}
                    className="w-full border rounded p-2"
                  >
                    {[1,2,3,4,5,6,7,14].map(day => (
                      <option key={day} value={day}>{day} days</option>
                    ))}
                  </select>
                </div>
                {/* Price */}
                <input
                  className="w-full border rounded p-2 mb-2"
                  name="base_price"
                  type="number"
                  value={editData.base_price || ''}
                  onChange={handleEditChange}
                  placeholder="Price"
                />
                {/* Service Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">Service Category (Choose one)</label>
                  <select
                    name="service_category"
                    value={editData.service_category || ''}
                    onChange={handleEditChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select category</option>
                    <option value="incorporation">Incorporation of New Company</option>
                    <option value="secretary">Company Secretary Subscription</option>
                    <option value="bank">Opening of Bank Account</option>
                  </select>
                </div>
                {/* Additional Offerings Checkboxes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Offerings</label>
                  {[
                    'Company Secretary Subscription',
                    'Bank Account Opening',
                    'Compliance Calendar Setup',
                    'SSM Filing',
                  ].map(item => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editData.additional_offerings?.includes(item) || false}
                        onChange={() => {
                          setEditData((prev: any) => ({
                            ...prev,
                            additional_offerings: prev.additional_offerings?.includes(item)
                              ? prev.additional_offerings.filter((v: string) => v !== item)
                              : [...(prev.additional_offerings || []), item],
                          }));
                        }}
                      />
                      {item}
                    </label>
                  ))}
                </div>
                {/* Images */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['image1','image2','image3'].map((key, idx) => (
                    <div key={key} className="border rounded p-2 text-center">
                      <div className="mb-2">Image {idx+1}</div>
                      {editData[key] ? (
                        <img src={typeof editData[key] === 'string' ? `http://localhost:5000/uploads/${editData[key]}` : URL.createObjectURL(editData[key])} alt="preview" className="w-full h-24 object-cover mb-2" />
                      ) : (
                        <div className="h-24 flex items-center justify-center text-gray-400">No image</div>
                      )}
                      <input type="file" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setEditData((prev: any) => ({ ...prev, [key]: file }));
                      }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" className="px-4 py-2 border rounded" onClick={handleEditClose}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={editLoading}>{editLoading ? 'Saving...' : 'Published'}</button>
                </div>
              </>
            ) : (
              <div>No data</div>
            )}
          </form>
        </div>
      )}
    </div>

  );
}
