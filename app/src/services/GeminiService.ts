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
  try {
    console.log("Calling Vercel Backend")
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentNotes,
        contextTracks,
        targetProgramNumber,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `Server responded with status ${response.status}`,
      )
    }

    const data = await response.json()
    return {
      notes: data.notes || [],
      explanation: data.explanation || "No explanation provided.",
    }
  } catch (error: any) {
    console.error("Error fetching Gemini suggestions:", error)
    return {
      notes: [],
      explanation: "Could not generate suggestions and reasoning.",
    }
  }
}
