import { useCallback, useState } from "react";
import { fetchGeminiSuggestions } from "../services/GeminiService";
import { useGeminiStore } from "./useGeminiStore";
import { usePianoRoll } from "./usePianoRoll";
import { useSong } from "./useSong";

export const useGeminiGenerator = () => {
  const { setSuggestions, clearSuggestions } = useGeminiStore()

  const { getTrack } = useSong()

  const { selectedTrackId } = usePianoRoll()
  const [isGenerating, setIsGenerating] = useState(false)

  const generateMusic = useCallback(async () => {
    setIsGenerating(true)
    clearSuggestions()
    
    try {
      const currentTrack = getTrack(selectedTrackId)

      if (!currentTrack) {
        console.warn("No track selected!")
        return
      }

      const currentNotes = currentTrack.events.filter(e => (e as any).subtype === "note") || []
      
      console.log("Sending context to Gemini:", currentNotes.length, "notes")

      const { notes, explanation }= await fetchGeminiSuggestions(currentNotes as any)

      console.log("Received from Gemini: ", notes, explanation)

      if (notes.length > 0) {
        setSuggestions(notes, explanation)
      } else {
        console.warn("Gemini returned 0 notes.")
      }
      
    } catch (e) {
      console.error("Failed to generate:", e)
    } finally {
      setIsGenerating(false)
    }
  }, [getTrack, selectedTrackId, setSuggestions, clearSuggestions])

  return { generateMusic, isGenerating }
}