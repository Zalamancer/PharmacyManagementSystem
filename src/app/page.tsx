import { patients } from '@/lib/data';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default function DashboardPage() {
  // In a real app, you'd fetch this data from an API
  const patientData = patients;

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <DashboardClient patients={patientData} />
    </main>
  );
}
