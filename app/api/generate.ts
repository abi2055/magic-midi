import { GoogleGenAI } from "@google/genai"

export const config = {
  runtime: "edge",
}

interface Note {
  noteNumber: number
  tick: number
  duration: number
  velocity: number
}

interface Track {
  name: string
  programNumber: number
  isRhythm: boolean
  notes: Note[]
}

interface GenerateRequest {
  currentNotes: Note[]
  contextTracks: Track[]
  targetProgramNumber: number
}

export default async function handler(req: Request) {
  // only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body = (await req.json()) as GenerateRequest
    const { contextTracks, targetProgramNumber, currentNotes } = body

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in server environment")
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const model = "gemini-3-flash-preview"

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

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    })

    const text = response.text || ""
    const cleanText = text.replace(/```json|```/g, "").trim()
    const data = JSON.parse(cleanText)

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Backend Connection Error:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Unknown Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
