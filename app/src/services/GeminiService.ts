import { GoogleGenAI } from "@google/genai"
// import { NoteEvent } from "../../../packages/core/src/entities"

// @ts-expect-error: vite types are missing
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

console.log("GEMINI_API_KEY present?", !!API_KEY)

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: API_KEY })

interface GeminiResponse {
  notes: any[]
  explanation: string
}

interface ContextTrack {
  name: string
  programNumber: number
  isRhythm: boolean
  notes: any[]
}

export const fetchGeminiSuggestions = async (
  currentNotes: any[],
  contextTracks: ContextTrack[],
  targetProgramNumber: number,
): Promise<GeminiResponse> => {
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

  const contextJson = JSON.stringify(
    contextTracks.map((t) => ({
      id: t.name,
      instrument: `MIDI Program ${t.programNumber}`,
      role: t.isRhythm ? "DRUMS/PERCUSSION" : "MELODIC",
      notes: t.notes.map((n) => ({
        tick: n.tick,
        note: n.noteNumber,
        dur: n.duration,
      })),
    })),
  )

  const prompt = `
    You are an expert Music Theory Teacher.
    
    CONTEXT (The Band):
    Here are the other tracks. Use their MIDI Program numbers to understand their role internally, BUT DO NOT REFERENCE PROGRAM NUMBERS IN YOUR EXPLANATION.
    - Programs 0-7: Piano
    - Programs 24-31: Guitar
    - Programs 32-39: Bass
    - Programs 113-120: Percussion
    
    ${contextJson}

    TARGET (Your Instrument):
    You are writing for MIDI Program ${targetProgramNumber}.
    ${notesContext}

    YOUR TASK:
    1. Continue the TARGET track for 2-4 bars.
    2. Sync rhythmically with any Drums/Percussion.
    3. Match the harmony defined by any Piano/Bass.
    
    4. GENERATE "TEACHER'S INSIGHT":
       - Explain your choice using MUSIC THEORY terms (e.g., "I landed on the Root Note C," "I used a ii-V-I progression," "I synced with the Kick Drum").
       - FORBIDDEN: Do NOT mention "ticks", "velocity values", "program numbers", or "MIDI channels".
       - REQUIRED: Mention specific Note Names (e.g. "C#", "G Maj") and Rhythmic Terms (e.g. "on the downbeat", "syncopated").
       - Tone: Encouraging, educational, and concise (max 2 sentences).

    RETURN JSON ONLY:
    { 
      "explanation": "string", 
      "notes": [...] 
    }
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
    // cleanup

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
