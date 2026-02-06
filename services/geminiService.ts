import { GoogleGenAI, Type } from "@google/genai";
import { Case } from '../types';

// Use a secure way to access key in real apps.
// For this boilerplate, we assume environment variable or user input.
const API_KEY = process.env.API_KEY || ''; 

export const generateDailyCase = async (): Promise<Omit<Case, 'id' | 'createdAt'>> => {
  if (!API_KEY) {
    console.warn("No API Key found for Gemini. Using fallback mock data.");
    return {
      title: "The Case of the Missing API Key",
      description: "The developer promised AI features but forgot to configure the environment variables. The users are suing for emotional distress.",
      plaintiff: "The Users",
      defendant: "The Dev"
    };
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a fictional, funny, low-stakes court case for a social game called "Reddit Jury".
      It needs a title, a short description (under 280 chars), a plaintiff name (e.g. /u/User), and a defendant name.
      Keep it lighthearted and Reddit-culture relevant.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            plaintiff: { type: Type.STRING },
            defendant: { type: Type.STRING }
          },
          required: ["title", "description", "plaintiff", "defendant"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini generation failed", error);
    return {
      title: "The Case of the AI Hallucination",
      description: "The AI tried to generate a case but instead generated an error. The court is recessed.",
      plaintiff: "System",
      defendant: "Gemini"
    };
  }
};