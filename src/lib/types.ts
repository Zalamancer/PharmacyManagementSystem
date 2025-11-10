export interface Prescription {
  id: string;
  drug: string;
  quantity: number;
  dosage_mg: number;
}

export interface Appointment {
  id: string;
  type: 'Vaccination' | 'Consultation' | 'Check-up';
  date: string;
}

export interface Transaction {
  id: string;
  drug: string;
  amount: number;
  co_pay: number;
  date: string;
}

export interface Patient {
  id: string;
  name: string;
  avatarUrl: string;
  prescriptions: Prescription[];
  appointments: Appointment[];
  transactions: Transaction[];
  next_appointment: string;
  caregivers?: string[];
}

export interface InventoryItem {
  quantity: number;
  expiration: string;
  lowStockThreshold: number;
}

export interface Inventory {
  [drugName: string]: InventoryItem;
}
