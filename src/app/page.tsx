import Image from "next/image";
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { ServiceTable } from '@/components/services/ServiceTable';

export default function Home() {
  return (
    <ResponsiveLayout>
      <ServiceTable />
    </ResponsiveLayout>
  );
}
