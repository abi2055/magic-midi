import { GoogleGenAI } from "@google/genai"

// @ts-expect-error: vite types are missing
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

console.log("GEMINI_API_KEY present?", !!API_KEY)

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: API_KEY })

export const fetchGeminiSuggestions = async (currentNotes: any[]) => {
  const model = "gemini-3-flash-preview"

  // First step is to construct the prompt based on current notes
  const noteString = currentNotes
    .map(
      (n) =>
        `Note: ${n.noteNumber}, Start: ${n.tick}, Duration: ${n.duration}, Velocity: ${n.velocity || 100}`,
    )
    .join("\n")

  const prompt = `
    I am a MIDI composer assistant. Here is the current musical context:
    ${noteString}

    Please continue this with 2-4 bars of music (melody AND harmony).
    - You can create CHORDS by outputting multiple notes with the same 'tick' value.
    - Generate between 8-16 notes total.
    
    Respond ONLY with a JSON array of notes. 
    Format: [{"noteNumber": 60, "tick": 480, "duration": 480, "velocity": 100}]
    Do not write any markdown or explanation. Just the JSON.
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
    const newNotes = JSON.parse(cleanText)
    return newNotes
  } catch (error) {
    console.error("Error fetching Gemini suggestions:", error)
    return []
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
