import { GoogleGenAI } from "@google/genai"
import "dotenv/config"

console.log("GEMINI_API_KEY present?", !!process.env.GEMINI_API_KEY)
console.log("GOOGLE_API_KEY present?", !!process.env.GOOGLE_API_KEY)

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({})

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain how AI works in a few words",
  })
  console.log(response.text)
}

main()
