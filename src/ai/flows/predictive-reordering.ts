'use server';

/**
 * @fileOverview This file implements the Genkit flow for predictive drug reordering based on current prescriptions.
 *
 * - predictReordering - A function that predicts drug reordering needs.
 * - PredictReorderingInput - The input type for the predictReordering function.
 * - PredictReorderingOutput - The return type for the predictReordering function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictReorderingInputSchema = z.object({
  inventory: z.record(z.object({
    quantity: z.number().describe('The current quantity of the drug in stock.'),
    expiration: z.string().describe('The expiration date of the drug (YYYY-MM-DD).'),
  })).describe('A record of drugs in inventory with their quantities and expiration dates.'),
  patients: z.array(z.object({
    name: z.string().describe('The name of the patient.'),
    prescriptions: z.array(z.object({
      drug: z.string().describe('The name of the prescribed drug.'),
      quantity: z.number().describe('The quantity of the drug prescribed.'),
      dosage_mg: z.number().describe('The dosage of the drug in milligrams.'),
    })).describe('A list of prescriptions for the patient.'),
  })).describe('A list of patients with their prescriptions.'),
});
export type PredictReorderingInput = z.infer<typeof PredictReorderingInputSchema>;

const PredictReorderingOutputSchema = z.record(z.object({
  reorderQuantity: z.number().describe('The quantity of the drug to reorder.'),
  reason: z.string().describe('The reasoning behind the reorder recommendation.'),
})).describe('A record of drugs and their recommended reorder quantities, with reasoning.');
export type PredictReorderingOutput = z.infer<typeof PredictReorderingOutputSchema>;

export async function predictReordering(input: PredictReorderingInput): Promise<PredictReorderingOutput> {
  return predictReorderingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictReorderingPrompt',
  input: {schema: PredictReorderingInputSchema},
  output: {schema: PredictReorderingOutputSchema},
  prompt: `You are an expert pharmacy inventory manager. Based on the current inventory and patient prescriptions, you will predict the reordering needs for each drug.  Consider the current quantity, expiration dates, and patient prescriptions to determine the reorder quantity for each drug. Provide a reason for each reorder recommendation.

Current Inventory:
{{#each inventory}}
- Drug: {{@key}}, Quantity: {{this.quantity}}, Expiration: {{this.expiration}}
{{/each}}

Patient Prescriptions:
{{#each patients}}
- Patient: {{this.name}}
  {{#each this.prescriptions}}
    - Drug: {{this.drug}}, Quantity: {{this.quantity}}, Dosage: {{this.dosage_mg}}mg
  {{/each}}
{{/each}}


Output the results as a JSON object where the key is the drug name and the value is an object containing the reorderQuantity and reason. The reorderQuantity should be 0 if no reorder is needed.
`, 
});

const predictReorderingFlow = ai.defineFlow(
  {
    name: 'predictReorderingFlow',
    inputSchema: PredictReorderingInputSchema,
    outputSchema: PredictReorderingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
