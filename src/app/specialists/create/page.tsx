'use client';
import { useEffect } from 'react'
import React, { useState } from 'react';
import axios from 'axios';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SpecialistFormData {
  title: string;
  description: string;
  duration_days: number;
  base_price: number;
  service_category: string;
  additional_offerings: string[];
  image1: File | null;
  image2: File | null;
  image3: File | null;
}

export default function SpecialistCreate() {
  const [formData, setFormData] = useState<SpecialistFormData>({
    title: '',
    description: '',
    duration_days: 1,
    base_price: 0,
    service_category: '',
    additional_offerings: [],
    image1: null,
    image2: null,
    image3: null,
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
 const [previews, setPreviews] = useState<{
  image1?: string;
  image2?: string;
  image3?: string;
}>({});
useEffect(() => {
  return () => {
    Object.values(previews).forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
  };
}, [previews]);

  // ---------------- HANDLERS ----------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: 
        name==='duration_days' || name==='base_price'
        ? Number(value)
        :value
    }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      additional_offerings: prev.additional_offerings.includes(value)
        ? prev.additional_offerings.filter(v => v !== value)
        : [...prev.additional_offerings, value],
    }));
  };

 const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  key: 'image1' | 'image2' | 'image3'
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // save file
  setFormData(prev => ({ ...prev, [key]: file }));

  // create preview
  const previewUrl = URL.createObjectURL(file);
  setPreviews(prev => ({ ...prev, [key]: previewUrl }));
};

  // ---------------- SUBMIT ----------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ MUST USE FormData (for multer)
      const form = new FormData();

      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('duration_days', String(formData.duration_days));
      form.append('base_price', String(formData.base_price));
      form.append('service_category', formData.service_category);
      form.append('is_draft', 'true');

      formData.additional_offerings.forEach(item =>
        form.append('additional_offerings[]', item)
      );

      if (formData.image1) form.append('image1', formData.image1);
      if (formData.image2) form.append('image2', formData.image2);
      if (formData.image3) form.append('image3', formData.image3);

       console.log(formData)

      // ✅ REAL API CALL
      await axios.post(
        'http://localhost:5000/api/specialists',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('Specialist created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create specialist');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- UI ----------------

  return (
    <ResponsiveLayout>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Create Specialist</h1>

        <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Estimated Completion Time (Days)
          </label>
          <select
            name="duration_days"
            value={formData.duration_days}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {[1, 2, 3, 4, 5, 6, 7, 14].map(day => (
              <option key={day} value={day}>{day} days</option>
            ))}
          </select>
        </div>

        <Input
          label="Price"
          name="base_price"
          type="number"
          value={formData.base_price}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            Service Category (Choose one)
          </label>
          <select
            name="service_category"
            value={formData.service_category}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select category</option>
            <option value="incorporation">Incorporation of New Company</option>
            <option value="secretary">Company Secretary Subscription</option>
            <option value="bank">Opening of Bank Account</option>
          </select>
        </div>

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
                checked={formData.additional_offerings.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
        </div>

        {/* 🔥 EXACT IMAGE FIELDS LIKE FIGMA */}
       

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Specialist'}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
  {(['image1', 'image2', 'image3'] as const).map((key, index) => (
    <div
      key={key}
      className="border-2 border-dashed rounded-lg p-4 text-center"
    >
      <p className="text-sm font-medium mb-2">
        Service Image ({index + 1})
      </p>

      {previews[key] ? (
        <img
          src={previews[key]}
          alt={`Preview ${index + 1}`}
          className="w-full h-32 object-cover rounded mb-2"
        />
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-400">
          No image selected
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e, key)}
        className="mt-2"
      />
    </div>
  ))}
</div>

      </form>
      
    </ResponsiveLayout>
  );
}
