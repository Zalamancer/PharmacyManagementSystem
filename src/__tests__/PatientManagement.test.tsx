import { render, screen, fireEvent } from '@testing-library/react';
import { PatientManagement } from '../components/pharmacy/PatientManagement';

describe('PatientManagement', () => {
  // FR-1 (Pharmacist Access) & FR-4 (Patient Search)
  it('allows pharmacists to search for patients', () => {
    render(<PatientManagement />);
    
    const searchInput = screen.getByPlaceholderText('Search by patient name or ID...');
    expect(searchInput).toBeInTheDocument();

    // Search for a specific patient
    fireEvent.change(searchInput, { target: { value: 'Alice Johnson' } });
    const patientName = screen.getByText('Alice Johnson');
    expect(patientName).toBeInTheDocument();

    // Ensure other patients are filtered out
    const otherPatient = screen.queryByText('Bob Smith');
    expect(otherPatient).not.toBeInTheDocument();
  });

  // FR-3 (Drug Interaction Checks)
  it('displays a warning for potential drug-drug interactions', () => {
    render(<PatientManagement />);

    // Open the accordion for a patient with known interactions
    const patientTrigger = screen.getByText('Carol Martinez');
    fireEvent.click(patientTrigger);

    const interactionWarning = screen.getByText('Interaction Warning');
    expect(interactionWarning).toBeInTheDocument();
    
    // Check for the specific warning message after expanding
    const warningDetails = screen.getByText(/Potential drug interactions detected:/);
    expect(warningDetails).toBeInTheDocument();
    expect(screen.getByText(/Gabapentin \+ Opioid: Increased risk of respiratory depression/)).toBeInTheDocument();
  });
});
