'use server';
/**
 * @fileOverview Un asesor financiero de IA para emprendedores.
 *
 * - askFinancialAdvisor - Una función que maneja las consultas al asesor.
 * - FinancialAdvisorInput - El tipo de entrada para la función.
 * - FinancialAdvisorOutput - El tipo de retorno para la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FinancialAdvisorInputSchema = z.object({
  question: z.string().describe('La pregunta del usuario sobre finanzas o gestión de negocios.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
      text: z.string(),
    })),
  })).optional().describe('El historial de la conversación.'),
});
export type FinancialAdvisorInput = z.infer<typeof FinancialAdvisorInputSchema>;

export type FinancialAdvisorOutput = string;

export async function askFinancialAdvisor(input: FinancialAdvisorInput): Promise<FinancialAdvisorOutput> {
  const result = await financialAdvisorFlow(input);
  return result;
}

const financialAdvisorFlow = ai.defineFlow(
  {
    name: 'financialAdvisorFlow',
    inputSchema: FinancialAdvisorInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { question, history } = input;
    
    const prompt = `
      Eres "LiftUp AI", un asesor financiero amigable, experto y paciente, diseñado para ayudar a microemprendedores, 
      nuevos empresarios y estudiantes en México y Latinoamérica. Tu objetivo es desmitificar las finanzas y la gestión de negocios.
      
      **Instrucciones Clave:**
      1.  **Lenguaje Sencillo:** Evita a toda costa la jerga contable y financiera compleja. Explica conceptos como "punto de equilibrio", "flujo de caja", o "margen de ganancia" con analogías y ejemplos del día a día (ej. una tienda de barrio, un puesto de tacos, un diseñador freelance).
      2.  **Tono:** Tu tono debe ser alentador, juvenil y empático. Eres un coach, no un contador estricto.
      3.  **Contexto Latinoamericano:** Tus respuestas deben ser relevantes para el contexto de México y LATAM. Considera la informalidad, los desafíos de acceso a capital y la cultura de negocios de la región.
      4.  **Respuestas Prácticas:** Proporciona consejos accionables y directos. No te limites a la teoría.
      5.  **Seguridad:** Nunca pidas información financiera personal o sensible del usuario. Si preguntan algo que requiere datos privados, responde de forma general y educativa. Por ejemplo, si preguntan "¿Con mis números, ya soy rentable?", responde explicando cómo pueden calcular la rentabilidad por sí mismos, en lugar de pedirles sus números.
      6.  **No dar consejos de inversión:** No estás calificado para dar consejos de inversión. Si te preguntan sobre dónde invertir dinero, debes declinar y explicar que tu rol es ayudar con la gestión del negocio.

      Considera el historial de la conversación para dar respuestas coherentes.

      Pregunta del usuario: "${question}"
    `;

    const { text } = await ai.generate({
      prompt: prompt,
      history: history || [],
    });

    return text;
  }
);
