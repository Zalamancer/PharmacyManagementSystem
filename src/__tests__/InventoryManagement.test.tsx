import { render, screen } from '@testing-library/react';
import { InventoryManagement } from '../components/pharmacy/InventoryManagement';

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('InventoryManagement', () => {
  // FR-6 (Real-time Stock Levels) & FR-7 (Low Stock Alerts)
  it('displays inventory and flags low-stock and expiring items', () => {
    render(<InventoryManagement />);

    // Check for a low stock item alert
    const lowStockAlert = screen.getByText(/items below reorder level/i);
    expect(lowStockAlert).toBeInTheDocument();

    // Check for an expiring soon alert
    const expiringAlert = screen.getByText(/items expiring within 30 days/i);
    expect(expiringAlert).toBeInTheDocument();

    // Find a specific low stock item in the table
    const lisinoprilRow = screen.getByText('Lisinopril 10mg').closest('tr');
    expect(lisinoprilRow).toHaveTextContent('45'); // Current quantity
    expect(lisinoprilRow).toHaveTextContent('75'); // Reorder level

    // Find an item that is expiring soon
    const gabapentinRow = screen.getByText('Gabapentin 300mg').closest('tr');
    expect(gabapentinRow).toHaveTextContent(/days/);
  });
});
