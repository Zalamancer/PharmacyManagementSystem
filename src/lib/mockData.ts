export interface Prescription {
  id: string;
  drug: string;
  quantity: number;
  dosage_mg: number;
  prescriber: string;
  lastFilled: string;
  nextFill: string;
  isControlled: boolean;
  status: 'ready' | 'in_progress' | 'pending';
  rxNumber: string;
  refillsRemaining: number;
  feedback?: {
    effectiveness: number; // 1-5 scale
    sideEffects: string[];
    overallSatisfaction: number; // 1-5 scale
    comments?: string;
    date: string;
  };
}

export interface Patient {
  name: string;
  id: string;
  prescriptions: Prescription[];
  appointments: Array<{
    type: string;
    date: string;
    time?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }>;
  transactions: Array<{
    drug: string;
    amount: number;
    co_pay: number;
    date: string;
    status: 'paid' | 'pending' | 'submitted';
  }>;
  caregivers: string[];
  nextAppointment?: string;
  allergies?: string[];
  insuranceProvider?: string;
  medicalHistory?: {
    previousMedications: string[];
    chronicConditions: string[];
  };
}

export interface InventoryItem {
  drug: string;
  quantity: number;
  expiration: string;
  isControlled: boolean;
  reorderLevel: number;
  supplier: string;
  cost: number;
}

export const patients: Patient[] = [
  {
    name: 'Alice Johnson',
    id: 'P001',
    prescriptions: [
      {
        id: 'RX001',
        drug: 'Adderall 20mg',
        quantity: 30,
        dosage_mg: 20,
        prescriber: 'Dr. Sarah Chen',
        lastFilled: '2025-10-15',
        nextFill: '2025-11-15',
        isControlled: true,
        status: 'ready',
        rxNumber: '#6273097',
        refillsRemaining: 3,
        feedback: {
          effectiveness: 4,
          sideEffects: ['Mild insomnia', 'Decreased appetite'],
          overallSatisfaction: 4,
          comments: 'Helps with focus but affects sleep. Considering lower dose.',
          date: '2025-10-28',
        },
      },
      {
        id: 'RX002',
        drug: 'Lisinopril 10mg',
        quantity: 90,
        dosage_mg: 10,
        prescriber: 'Dr. Sarah Chen',
        lastFilled: '2025-10-01',
        nextFill: '2025-12-30',
        isControlled: false,
        status: 'ready',
        rxNumber: '#6273098',
        refillsRemaining: 5,
        feedback: {
          effectiveness: 5,
          sideEffects: [],
          overallSatisfaction: 5,
          comments: 'Working great, no side effects.',
          date: '2025-10-25',
        },
      },
    ],
    appointments: [
      {
        type: 'Vaccination',
        date: '2025-11-15',
        time: '10:00 AM',
        status: 'scheduled',
      },
      {
        type: 'Consultation',
        date: '2025-11-20',
        time: '2:00 PM',
        status: 'scheduled',
      },
    ],
    transactions: [
      {
        drug: 'Adderall 20mg',
        amount: 150,
        co_pay: 15,
        date: '2025-10-15',
        status: 'paid',
      },
      {
        drug: 'Lisinopril 10mg',
        amount: 30,
        co_pay: 10,
        date: '2025-10-01',
        status: 'paid',
      },
    ],
    caregivers: ['John Johnson'],
    nextAppointment: '2025-11-15',
    allergies: ['Penicillin'],
    insuranceProvider: 'Blue Cross Blue Shield',
    medicalHistory: {
      previousMedications: ['Ritalin 10mg', 'Concerta 18mg'],
      chronicConditions: ['ADHD', 'Hypertension'],
    },
  },
  {
    name: 'Bob Smith',
    id: 'P002',
    prescriptions: [
      {
        id: 'RX003',
        drug: 'Metformin 500mg',
        quantity: 60,
        dosage_mg: 500,
        prescriber: 'Dr. Michael Lee',
        lastFilled: '2025-10-20',
        nextFill: '2025-11-20',
        isControlled: false,
        status: 'in_progress',
        rxNumber: '#6273099',
        refillsRemaining: 2,
        feedback: {
          effectiveness: 3,
          sideEffects: ['Nausea', 'Stomach discomfort'],
          overallSatisfaction: 2,
          comments: 'Controlling blood sugar but having digestive issues.',
          date: '2025-11-05',
        },
      },
      {
        id: 'RX004',
        drug: 'Atorvastatin 40mg',
        quantity: 30,
        dosage_mg: 40,
        prescriber: 'Dr. Michael Lee',
        lastFilled: '2025-10-25',
        nextFill: '2025-11-25',
        isControlled: false,
        status: 'ready',
        rxNumber: '#6273100',
        refillsRemaining: 4,
      },
    ],
    appointments: [
      {
        type: 'Blood Pressure Check',
        date: '2025-11-12',
        time: '9:00 AM',
        status: 'scheduled',
      },
    ],
    transactions: [
      {
        drug: 'Metformin 500mg',
        amount: 45,
        co_pay: 10,
        date: '2025-10-20',
        status: 'submitted',
      },
    ],
    caregivers: [],
    nextAppointment: '2025-11-12',
    allergies: [],
    insuranceProvider: 'Aetna',
    medicalHistory: {
      previousMedications: ['Glipizide 5mg'],
      chronicConditions: ['Type 2 Diabetes', 'High Cholesterol'],
    },
  },
  {
    name: 'Carol Martinez',
    id: 'P003',
    prescriptions: [
      {
        id: 'RX005',
        drug: 'Levothyroxine 50mcg',
        quantity: 90,
        dosage_mg: 0.05,
        prescriber: 'Dr. Emily Rodriguez',
        lastFilled: '2025-09-10',
        nextFill: '2025-12-10',
        isControlled: false,
        status: 'ready',
        rxNumber: '#6273101',
        refillsRemaining: 6,
      },
      {
        id: 'RX006',
        drug: 'Gabapentin 300mg',
        quantity: 30,
        dosage_mg: 300,
        prescriber: 'Dr. Emily Rodriguez',
        lastFilled: '2025-11-01',
        nextFill: '2025-12-01',
        isControlled: true,
        status: 'pending',
        rxNumber: '#6273102',
        refillsRemaining: 1,
      },
    ],
    appointments: [],
    transactions: [
      {
        drug: 'Levothyroxine 50mcg',
        amount: 25,
        co_pay: 5,
        date: '2025-09-10',
        status: 'paid',
      },
    ],
    caregivers: ['David Martinez'],
    allergies: ['Sulfa drugs'],
    insuranceProvider: 'United Healthcare',
  },
];

export const inventory: InventoryItem[] = [
  {
    drug: 'Adderall 20mg',
    quantity: 85,
    expiration: '2026-03-31',
    isControlled: true,
    reorderLevel: 50,
    supplier: 'McKesson',
    cost: 4.5,
  },
  {
    drug: 'Metformin 500mg',
    quantity: 180,
    expiration: '2026-06-30',
    isControlled: false,
    reorderLevel: 100,
    supplier: 'Cardinal Health',
    cost: 0.75,
  },
  {
    drug: 'Lisinopril 10mg',
    quantity: 45,
    expiration: '2025-12-31',
    isControlled: false,
    reorderLevel: 75,
    supplier: 'AmerisourceBergen',
    cost: 0.35,
  },
  {
    drug: 'Atorvastatin 40mg',
    quantity: 220,
    expiration: '2026-08-15',
    isControlled: false,
    reorderLevel: 100,
    supplier: 'McKesson',
    cost: 1.2,
  },
  {
    drug: 'Levothyroxine 50mcg',
    quantity: 310,
    expiration: '2026-05-20',
    isControlled: false,
    reorderLevel: 150,
    supplier: 'Cardinal Health',
    cost: 0.45,
  },
  {
    drug: 'Gabapentin 300mg',
    quantity: 15,
    expiration: '2025-11-30',
    isControlled: true,
    reorderLevel: 40,
    supplier: 'McKesson',
    cost: 0.85,
  },
  {
    drug: 'Amoxicillin 500mg',
    quantity: 5,
    expiration: '2025-11-15',
    isControlled: false,
    reorderLevel: 50,
    supplier: 'AmerisourceBergen',
    cost: 0.65,
  },
];

export const drugInteractions = [
  {
    drug1: 'Gabapentin',
    drug2: 'Opioid',
    severity: 'high',
    description: 'Increased risk of respiratory depression',
  },
  {
    drug1: 'Adderall',
    drug2: 'MAO Inhibitor',
    severity: 'high',
    description: 'Risk of hypertensive crisis',
  },
  {
    drug1: 'Metformin',
    drug2: 'Alcohol',
    severity: 'moderate',
    description: 'Increased risk of lactic acidosis',
  },
];

export interface MedicationCatalogItem {
  id: string;
  name: string;
  category: string;
  description: string;
  dosages: string[];
  price: number;
  requiresPrescription: boolean;
  commonUses: string[];
  sideEffects: string[];
  contraindications: string[];
}

export const medicationCatalog: MedicationCatalogItem[] = [
  {
    id: 'MED001',
    name: 'Ibuprofen',
    category: 'Pain Relief',
    description: 'Nonsteroidal anti-inflammatory drug (NSAID) for pain and fever',
    dosages: ['200mg', '400mg', '600mg'],
    price: 8.99,
    requiresPrescription: false,
    commonUses: ['Headache', 'Muscle pain', 'Fever', 'Arthritis'],
    sideEffects: ['Stomach upset', 'Nausea', 'Heartburn'],
    contraindications: ['Aspirin allergy', 'Stomach ulcers'],
  },
  {
    id: 'MED002',
    name: 'Acetaminophen',
    category: 'Pain Relief',
    description: 'Pain reliever and fever reducer',
    dosages: ['325mg', '500mg', '650mg'],
    price: 7.49,
    requiresPrescription: false,
    commonUses: ['Headache', 'Fever', 'Muscle aches', 'Toothache'],
    sideEffects: ['Rare allergic reactions', 'Liver damage with excessive use'],
    contraindications: ['Liver disease'],
  },
  {
    id: 'MED003',
    name: 'Omeprazole',
    category: 'Digestive Health',
    description: 'Proton pump inhibitor for acid reflux and heartburn',
    dosages: ['20mg', '40mg'],
    price: 12.99,
    requiresPrescription: false,
    commonUses: ['GERD', 'Heartburn', 'Acid reflux', 'Ulcers'],
    sideEffects: ['Headache', 'Nausea', 'Diarrhea'],
    contraindications: ['Liver problems'],
  },
  {
    id: 'MED004',
    name: 'Loratadine',
    category: 'Allergy Relief',
    description: 'Antihistamine for allergy symptoms',
    dosages: ['10mg'],
    price: 9.99,
    requiresPrescription: false,
    commonUses: ['Seasonal allergies', 'Hay fever', 'Hives', 'Itching'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Headache'],
    contraindications: ['Kidney disease'],
  },
  {
    id: 'MED005',
    name: 'Diphenhydramine',
    category: 'Allergy Relief',
    description: 'Antihistamine for allergies and sleep aid',
    dosages: ['25mg', '50mg'],
    price: 6.99,
    requiresPrescription: false,
    commonUses: ['Allergies', 'Insomnia', 'Motion sickness', 'Cough'],
    sideEffects: ['Drowsiness', 'Dizziness', 'Dry mouth'],
    contraindications: ['Glaucoma', 'Enlarged prostate'],
  },
  {
    id: 'MED006',
    name: 'Guaifenesin',
    category: 'Cold & Flu',
    description: 'Expectorant to loosen mucus and relieve chest congestion',
    dosages: ['200mg', '400mg'],
    price: 8.49,
    requiresPrescription: false,
    commonUses: ['Cough', 'Chest congestion', 'Bronchitis'],
    sideEffects: ['Nausea', 'Vomiting', 'Dizziness'],
    contraindications: ['Chronic cough from smoking'],
  },
  {
    id: 'MED007',
    name: 'Dextromethorphan',
    category: 'Cold & Flu',
    description: 'Cough suppressant',
    dosages: ['15mg', '30mg'],
    price: 7.99,
    requiresPrescription: false,
    commonUses: ['Dry cough', 'Cold symptoms'],
    sideEffects: ['Drowsiness', 'Dizziness', 'Nausea'],
    contraindications: ['MAO inhibitor use'],
  },
  {
    id: 'MED008',
    name: 'Loperamide',
    category: 'Digestive Health',
    description: 'Anti-diarrheal medication',
    dosages: ['2mg'],
    price: 9.49,
    requiresPrescription: false,
    commonUses: ['Diarrhea', 'IBS'],
    sideEffects: ['Constipation', 'Dizziness', 'Drowsiness'],
    contraindications: ['Bloody diarrhea', 'High fever'],
  },
  {
    id: 'MED009',
    name: 'Aspirin',
    category: 'Pain Relief',
    description: 'Pain reliever and anti-inflammatory',
    dosages: ['81mg', '325mg'],
    price: 5.99,
    requiresPrescription: false,
    commonUses: ['Headache', 'Pain', 'Heart attack prevention', 'Fever'],
    sideEffects: ['Stomach upset', 'Bleeding risk', 'Heartburn'],
    contraindications: ['Bleeding disorders', 'Children with viral infections'],
  },
  {
    id: 'MED010',
    name: 'Cetirizine',
    category: 'Allergy Relief',
    description: 'Antihistamine for allergies',
    dosages: ['5mg', '10mg'],
    price: 10.99,
    requiresPrescription: false,
    commonUses: ['Allergies', 'Hives', 'Itching'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    contraindications: ['Kidney disease'],
  },
];

export const symptomDatabase = {
  headache: {
    recommendations: ['Ibuprofen', 'Acetaminophen', 'Aspirin'],
    questions: ['Is it a migraine?', 'Do you have fever?', 'How severe is the pain?'],
  },
  fever: {
    recommendations: ['Acetaminophen', 'Ibuprofen'],
    questions: ['What is your temperature?', 'How long have you had fever?'],
  },
  cough: {
    recommendations: ['Guaifenesin', 'Dextromethorphan'],
    questions: ['Is it a dry cough or productive?', 'Do you have chest congestion?'],
  },
  allergies: {
    recommendations: ['Loratadine', 'Cetirizine', 'Diphenhydramine'],
    questions: ['What are your allergy triggers?', 'Are symptoms seasonal?'],
  },
  'stomach pain': {
    recommendations: ['Omeprazole'],
    questions: ['Do you have heartburn?', 'Is it related to eating?'],
  },
  diarrhea: {
    recommendations: ['Loperamide'],
    questions: ['How long has this lasted?', 'Do you have fever?'],
  },
};
