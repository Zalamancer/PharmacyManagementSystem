import type { Patient, Inventory } from './types';

export const patients: Patient[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    prescriptions: [
      { id: 'p1', drug: 'Adderall', quantity: 30, dosage_mg: 20 },
      { id: 'p2', drug: 'Lisinopril', quantity: 90, dosage_mg: 10 },
    ],
    appointments: [
      { id: 'a1', type: 'Consultation', date: '2025-10-20' },
    ],
    transactions: [
      { id: 't1', drug: 'Adderall', amount: 75, co_pay: 15, date: '2024-06-15' },
    ],
    next_appointment: '2025-10-20',
    caregivers: ['David Johnson'],
  },
  {
    id: '2',
    name: 'Bob Williams',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    prescriptions: [
      { id: 'p3', drug: 'Metformin', quantity: 60, dosage_mg: 500 },
    ],
    appointments: [
      { id: 'a2', type: 'Vaccination', date: '2025-11-10' },
    ],
    transactions: [
      { id: 't2', drug: 'Metformin', amount: 25, co_pay: 5, date: '2024-06-10' },
    ],
    next_appointment: '2025-11-15',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    prescriptions: [
      { id: 'p4', drug: 'Atorvastatin', quantity: 4, dosage_mg: 40 },
    ],
    appointments: [],
    transactions: [
      { id: 't3', drug: 'Atorvastatin', amount: 40, co_pay: 10, date: '2024-05-28' },
    ],
    next_appointment: '2025-12-01',
  },
  {
    id: '4',
    name: 'Diana Miller',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    prescriptions: [
      { id: 'p5', drug: 'Opioid Painkiller', quantity: 15, dosage_mg: 5 },
      { id: 'p6', drug: 'Benzodiazepine', quantity: 20, dosage_mg: 1 },
    ],
    appointments: [
      { id: 'a3', type: 'Check-up', date: '2025-09-05' },
    ],
    transactions: [],
    next_appointment: '2025-09-05',
  },
];

export const inventory: Inventory = {
  Adderall: { quantity: 100, expiration: '2025-12-31', lowStockThreshold: 40 },
  Metformin: { quantity: 200, expiration: '2026-06-30', lowStockThreshold: 50 },
  Lisinopril: { quantity: 18, expiration: '2025-08-31', lowStockThreshold: 20 },
  Atorvastatin: { quantity: 150, expiration: '2024-07-15', lowStockThreshold: 30 },
  'Opioid Painkiller': { quantity: 50, expiration: '2026-01-31', lowStockThreshold: 20 },
  Benzodiazepine: { quantity: 80, expiration: '2025-11-30', lowStockThreshold: 25 },
};

export const unsafeDrugCombinations: [string, string][] = [
  ['Opioid Painkiller', 'Benzodiazepine'],
  ['Adderall', 'Opioid Painkiller'],
];
