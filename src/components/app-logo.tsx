import { Pill } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <Pill className="h-6 w-6 text-primary" />
      <h1 className="font-headline text-xl font-semibold">MediTrack Pro</h1>
    </div>
  );
}
