import { inventory } from '@/lib/data';
import { InventoryClient } from '@/components/inventory/inventory-client';

export default function InventoryPage() {
  // In a real app, you'd fetch this data from an API
  const inventoryData = inventory;

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Inventory Management</h2>
      </div>
      <InventoryClient initialInventory={inventoryData} />
    </main>
  );
}
