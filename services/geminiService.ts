import { GoogleGenAI } from "@google/genai";
import { ORGANIZATION_INFO } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHumasResponse = async (userMessage: string): Promise<string> => {
  try {
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