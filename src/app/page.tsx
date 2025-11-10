
'use client';

import { useState } from 'react';
import { Login } from '@/components/Login';
import { PharmacyDashboard } from '@/components/PharmacyDashboard';
import { PatientPortal } from '@/components/PatientPortal';

export default function Home() {
  const [userType, setUserType] = useState<'pharmacist' | 'patient' | null>(null);
  const [currentPatient, setCurrentPatient] = useState<string | null>(null);

  const handleLogin = (type: 'pharmacist' | 'patient', patientName?: string) => {
    setUserType(type);
    if (type === 'patient' && patientName) {
      setCurrentPatient(patientName);
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentPatient(null);
  };

  if (!userType) {
    return <Login onLogin={handleLogin} />;
  }

  if (userType === 'pharmacist') {
    return <PharmacyDashboard onLogout={handleLogout} />;
  }

  return <PatientPortal patientName={currentPatient!} onLogout={handleLogout} />;
}
