'use client';
import AdminForm from '@/components/AdminForm';

export default function AdminPage() {
  const handleSubmit = (data: any) => {
    console.log('Restaurant data submitted:', data);
    // TODO: Send to API in Phase 10
  };

  return <AdminForm onSubmit={handleSubmit} />;
}
