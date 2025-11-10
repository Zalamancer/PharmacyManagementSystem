import { render, screen, waitFor } from '@testing-library/react';
import { PatientPortal } from '../components/PatientPortal';

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));


describe('PatientPortal', () => {
    
  // NFR-3 (Performance)
  it('loads the main patient portal page within a reasonable time', async () => {
    const startTime = performance.now();
    
    render(<PatientPortal patientName="Alice Johnson" onLogout={() => {}} />);
    
    // Wait for a key element to be visible
    await waitFor(() => {
      expect(screen.getByText('Welcome, Alice Johnson')).toBeInTheDocument();
    }, { timeout: 2000 }); // Set a generous timeout for the test
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    console.log(`Patient Portal load time: ${loadTime.toFixed(2)}ms`);
    
    // Assert that the load time is under a reasonable threshold (e.g., 1000ms)
    // This is a basic performance check
    expect(loadTime).toBeLessThan(1000);
  });

  // FR-5 (Reminders)
  it('displays reminders for low refills and upcoming appointments', async () => {
    render(<PatientPortal patientName="Alice Johnson" onLogout={() => {}} />);
    
    await waitFor(() => {
        // Find the alert that contains the reminders
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        
        // Check for low prescription reminder
        expect(screen.getByText(/Lisinopril 10mg is running low/)).toBeInTheDocument();

        // Check for upcoming appointment reminder
        expect(screen.getByText(/Vaccination scheduled in/)).toBeInTheDocument();
    });
  });

});
