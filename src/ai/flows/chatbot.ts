'use server';

/**
 * @fileOverview A simple chatbot flow for the pharmacy management system.
 *
 * - chat - A function that handles chat interactions.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { patients, inventory, drugInteractions } from '../../lib/mockData';

const ChatInputSchema = z.object({
  userType: z.enum(['patient', 'pharmacist']).describe('The type of user interacting with the chatbot.'),
  userName: z.string().optional().describe('The name of the user, required if userType is "patient".'),
  query: z.string().describe('The user\'s question or message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The chat history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string().describe('The chatbot\'s response.');
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Mock data access functions to simulate database queries
const getPatientByName = async (name: string) => patients.find(p => p.name.toLowerCase() === name.toLowerCase());
const getInventoryByDrugName = async (drugName: string) => inventory.find(i => i.drug.toLowerCase().includes(drugName.toLowerCase()));
const getDrugInteractions = async () => drugInteractions;

const getPatientDataTool = ai.defineTool({
    name: 'getPatientData',
    description: 'Get patient data including prescriptions, appointments, and allergies.',
    inputSchema: z.object({ name: z.string().describe('The name of the patient.') }),
    outputSchema: z.any(),
}, async ({ name }) => getPatientByName(name));

const getInventoryDataTool = ai.defineTool({
    name: 'getInventoryData',
    description: 'Get inventory level and reorder information for a specific drug.',
    inputSchema: z.object({ drug: z.string().describe('The name of the drug.') }),
    outputSchema: z.any(),
}, async ({ drug }) => getInventoryByDrugName(drug));

const checkDrugInteractionsTool = ai.defineTool({
    name: 'checkDrugInteractions',
    description: 'Check for potential interactions between all drugs a patient is prescribed.',
    inputSchema: z.object({ patientName: z.string().describe('The name of the patient.') }),
    outputSchema: z.any(),
}, async ({ patientName }) => {
    const patient = await getPatientByName(patientName);
    if (!patient) return { error: 'Patient not found.' };

    const patientDrugs = patient.prescriptions.map(p => p.drug.split(' ')[0]);
    const allInteractions = await getDrugInteractions();
    const foundInteractions = [];

    for (let i = 0; i < patientDrugs.length; i++) {
        for (let j = i + 1; j < patientDrugs.length; j++) {
            const drug1 = patientDrugs[i];
            const drug2 = patientDrugs[j];
            const interaction = allInteractions.find(inter =>
                (inter.drug1 === drug1 && inter.drug2 === drug2) ||
                (inter.drug1 === drug2 && inter.drug2 === drug1)
            );
            if (interaction) {
                foundInteractions.push(interaction);
            }
        }
    }
    return foundInteractions;
});


export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const patientPrompt = `
You are a friendly and helpful pharmacy assistant chatbot for patients.
Use the available tools to answer questions about prescriptions, refills, appointments, and drug information.
Keep your answers concise and easy to understand.
Do not answer questions that are not related to pharmacy services.
The current patient is {{userName}}.
`;

const pharmacistPrompt = `
You are an efficient pharmacy assistant chatbot for pharmacists.
Use the available tools to provide quick access to patient profiles, prescription statuses, and inventory levels.
Be professional and provide data-driven answers.
If you look up patient data, mention the patient's name in your response.
Do not answer questions that are not related to pharmacy operations.
`;

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { userType, userName, query, history } = input;
    
    let tools = [getPatientDataTool, checkDrugInteractionsTool];
    let systemPrompt = patientPrompt;

    if (userType === 'pharmacist') {
      tools.push(getInventoryDataTool);
      systemPrompt = pharmacistPrompt;
    }

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: query,
      system: systemPrompt,
      history: history,
      tools: tools,
      templateData: { userName }
    });
    
    return text;
  }
);
