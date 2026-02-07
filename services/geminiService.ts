
import { GoogleGenAI, Type } from "@google/genai";
import { Case } from '../types';

export const generateDailyCase = async (): Promise<Omit<Case, 'id' | 'createdAt'>> => {
  // Use process.env.API_KEY directly in the constructor as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a funny, dramatic Reddit court case for "Reddit Jury". 
      Create 3 pieces of specific evidence:
      1. Physical Evidence (e.g. A suspicious screenshot)
      2. Witness Testimony (e.g. A neighbor's comment)
      3. Character Note (e.g. The defendant's post history)
      
      Requirements:
      - The evidence should be slightly contradictory or ambiguous.
      - Theme: Reddit tropes (mods, karma, cake day, sub rules).
      
      Return as strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            plaintiff: { type: Type.STRING },
            defendant: { type: Type.STRING },
            evidence: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["title", "description", "plaintiff", "defendant", "evidence"]
        }
      }
    });

    // Access text property directly (not a method)
    const data = JSON.parse(response.text);
    return {
      ...data,
      evidence: data.evidence.map((e: any, i: number) => ({
        ...e,
        id: `ev-${i}`,
        isRevealed: false
      }))
    };
  } catch (error) {
    console.error("AI recess:", error);
    return {
      title: "The Case of the Missing Data",
      description: "The AI is on strike. The judge is confused.",
      plaintiff: "The Users",
      defendant: "The Server",
      evidence: [
        { id: '1', title: 'Exhibit A', content: 'A blank sheet of paper.', isRevealed: false },
        { id: '2', title: 'Testimony', content: 'I saw nothing.', isRevealed: false },
        { id: '3', title: 'History', content: 'The logs are empty.', isRevealed: false }
      ]
    };
  }
};