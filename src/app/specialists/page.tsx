'use client';

import React from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';

export default function SpecialistsPage() {
  return (
    <ResponsiveLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Specialists</h1>

          <div className="text-center py-12">
            <p className="text-gray-500">Specialists list will be displayed here.</p>
            <p className="text-gray-400 text-sm mt-2">Click "Create Specialists" to add new specialists.</p>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}