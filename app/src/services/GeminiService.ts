import { GoogleGenAI } from "@google/genai"

// @ts-expect-error: vite types are missing
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

console.log("GEMINI_API_KEY present?", !!API_KEY)

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: API_KEY })

// interface GeminiResponse {
//   notes: any[];
//   explanation: string;
// }

export const fetchGeminiSuggestions = async (currentNotes: any[]) => {
  const model = "gemini-3-flash-preview"

  // First step is to construct the prompt based on current notes
  const notesContext = JSON.stringify(
    currentNotes.map((n) => ({
      noteNumber: n.noteNumber,
      tick: n.tick,
      duration: n.duration,
      velocity: n.velocity,
    })),
  )

  const prompt = `
    You are an expert music theory teacher.
    Analyze the following MIDI notes (tick, noteNumber, duration, velocity):
    ${notesContext}

    Your task:
    1. Continue this melody for 2-4 bars in a matching style.
    2. Provide a 1-sentence "Teacher's Insight" explaining the theory behind your choice (e.g., scales, intervals, or chord progressions used).

    IMPORTANT: You must return ONLY valid JSON in this exact structure:
    {
      "explanation": "Your theory explanation here...",
      "notes": [
        { "tick": number, "noteNumber": number, "duration": number, "velocity": number }
      ]
    }
    
    Do not use Markdown formatting. Just the raw JSON string.
  `

  try {
    // Api Call
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    })
    const text = response.text || ""
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()
    const data = JSON.parse(cleanText)

    return {
      notes: data.notes || [],
      explanation: data.explanation || "",
    }
  } catch (error) {
    console.error("Error fetching Gemini suggestions:", error)
    return {
      notes: [],
      explanation: "Could not generate suggestions and reasoning.",
    }
  }
}

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Explain how AI works in a few words",
//   })
//   console.log(response.text)
// }

// main()
