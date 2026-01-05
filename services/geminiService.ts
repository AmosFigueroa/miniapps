import { GoogleGenAI } from "@google/genai";
import { ORGANIZATION_INFO } from '../constants';

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // Safely access process.env to prevent immediate crashes during module loading
    // if the environment variable isn't ready yet.
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    
    if (!apiKey) {
      console.warn("API_KEY is missing. AI features will not work.");
      // We don't throw here to avoid crashing the whole app, 
      // instead we let the API call fail gracefully later.
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateHumasResponse = async (userMessage: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    if (!ai) {
        return "Maaf, konfigurasi API Key belum tersedia. Hubungi admin.";
    }

    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: ORGANIZATION_INFO.systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    });

    return response.text || "Maaf, saya sedang mengalami gangguan koneksi. Silakan hubungi admin.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan teknis. Silakan coba lagi nanti atau hubungi kontak resmi kami.";
  }
};