'use client';

import React from 'react';
import { ResponsiveLayout, ServiceTable } from '@/components';

export default function SpecialistsPage() {
  return (
    <ResponsiveLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Specialists</h1>
          <ServiceTable />
        </div>
      </div>
    </ResponsiveLayout>
  );
}