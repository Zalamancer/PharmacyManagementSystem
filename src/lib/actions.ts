'use server';

import { predictReordering } from '@/ai/flows/predictive-reordering';
import { inventory, patients } from '@/lib/data';
import type { PredictReorderingOutput } from '@/ai/flows/predictive-reordering';

export async function getPredictiveReordering(): Promise<PredictReorderingOutput | { error: string }> {
  try {
    const aiInput = {
      inventory: Object.fromEntries(
        Object.entries(inventory).map(([key, value]) => [
          key,
          { quantity: value.quantity, expiration: value.expiration },
        ])
      ),
      patients: patients.map((p) => ({
        name: p.name,
        prescriptions: p.prescriptions.map((pr) => ({
          drug: pr.drug,
          quantity: pr.quantity,
          dosage_mg: pr.dosage_mg,
        })),
      })),
    };
    
    const result = await predictReordering(aiInput);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get prediction from AI.' };
  }
}
