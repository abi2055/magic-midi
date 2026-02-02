import { useCallback, useState } from "react";
import { fetchGeminiSuggestions } from "../services/GeminiService";
import { useGeminiStore } from "./useGeminiStore";
import { usePianoRoll } from "./usePianoRoll";
import { useSong } from "./useSong";

export const useGeminiGenerator = () => {
  const { setSuggestions, clearSuggestions } = useGeminiStore()

  const { tracks, getTrack } = useSong()

  const { selectedTrackId } = usePianoRoll()
  const [isGenerating, setIsGenerating] = useState(false)

  const generateMusic = useCallback(async () => {
    setIsGenerating(true)
    clearSuggestions()
    
    try {
      const currentTrack = getTrack(selectedTrackId)
      if (!currentTrack) return

      if (!currentTrack) {
        console.warn("No track selected!")
        return
      }

      const currentNotes = currentTrack.events.filter(e => (e as any).subtype === "note") || []

      // Looking at all traacks besides the current one
      const contextTracks = Object.values(tracks)
        .filter(t => t.id !== selectedTrackId)
        .map(t => ({
          nname: t.name || `Track ${t.id}`,
          // Gemini will translate "0" -> Piano, "32" -> Bass, etc.
          programNumber: t.programNumber ?? 0, 
          isRhythm: t.isRhythmTrack, // Help it identify drums
          notes: t.events.filter(e => e.type === "channel" && e.subtype === "note") || []
        }))
        .filter(t => t.notes.length > 0)
      
      console.log(`Sending Target (${currentNotes.length} notes) + Context (${contextTracks.length} tracks)`)

      const { notes, explanation } = await fetchGeminiSuggestions(currentNotes as any, contextTracks as any, currentTrack.programNumber ?? 0)
      // Expects two arguments the current notes on the track and the context from other tracks

      if (notes.length > 0) {
        console.log("Received from Gemini: ", notes, explanation)
      }

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
  }, [tracks, getTrack, selectedTrackId, setSuggestions, clearSuggestions])

  return { generateMusic, isGenerating }
}