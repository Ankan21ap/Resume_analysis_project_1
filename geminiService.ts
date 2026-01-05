
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis } from "./types";

export const analyzeResumeWithGemini = async (
  resumeText: string,
  targetRole: string
): Promise<Partial<ResumeAnalysis>> => {
  // Always create a new instance right before the call to use the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const prompt = `
    Act as a senior technical recruiter and career coach. 
    Analyze the following resume for the target role: "${targetRole}".
    
    Resume Text:
    """
    ${resumeText}
    """

    Provide a detailed analysis in JSON format including:
    1. A score from 0-100 reflecting how well the resume matches the target role.
    2. A list of top 5-7 missing technical or soft skills required for the role.
    3. Three high-impact general improvements for the resume layout or content.
    4. Five specific ATS-friendly bullet point rewrites based on the existing content. Each should have 'original', 'rewritten', and 'reason'.
    5. A 6-month career roadmap to bridge the gap between current skills and the target role.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            atsRewrites: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  rewritten: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["original", "rewritten", "reason"],
              },
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.NUMBER },
                  focus: { type: Type.STRING },
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["month", "focus", "actions"],
              },
            },
          },
          required: ["score", "missingSkills", "improvements", "atsRewrites", "roadmap"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response.");
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("401")) {
      throw new Error("Invalid or missing API Key. Please check your environment variables.");
    }
    throw new Error(error.message || "An unexpected error occurred during analysis.");
  }
};
