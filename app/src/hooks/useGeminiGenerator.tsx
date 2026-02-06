import { useCallback, useEffect, useState } from "react";
import { fetchGeminiSuggestions } from "../services/GeminiService";
import { useGeminiStore } from "./useGeminiStore";
import { usePianoRoll } from "./usePianoRoll";
import { useSong } from "./useSong";

export const useGeminiGenerator = () => {
  const { setSuggestions, clearSuggestions, isGenerating, setIsGenerating, setErrorMessage } = useGeminiStore()

  const { tracks, getTrack } = useSong()

  const { selectedTrackId } = usePianoRoll()

  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const generateMusic = useCallback(async () => {
    if (isGenerating || cooldown > 0) {
      console.warn("Already generating or on cooldown")
      return
    }

    setIsGenerating(true)
    setErrorMessage(null)
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
          programNumber: t.programNumber ?? 0, 
          isRhythm: t.isRhythmTrack, // Help it identify drums
          notes: t.events.filter(e => e.type === "channel" && e.subtype === "note") || []
        }))
        .filter(t => t.notes.length > 0)
      
      console.log(`Sending Notes (${currentNotes.length} notes) + Context (${contextTracks.length} tracks)`)

      const { notes, explanation } = await fetchGeminiSuggestions(currentNotes as any, contextTracks as any, currentTrack.programNumber ?? 0)
      // Expects two arguments the current notes on the track and the context from other tracks

      if (notes.length > 0) {
        console.log("Received from Gemini: ", notes, explanation)
      }

      if (notes.length > 0) {
        setSuggestions(notes, explanation)
      } else {
        console.warn("Gemini returned no suggestions.")
      }
      
    } catch (e) {
      console.error(e)

      if (e instanceof Error) {
        setErrorMessage(e.message)
      }
      else {
        setErrorMessage("An unknown error occurred while generating music.")
      }
      
    } finally {
      setIsGenerating(false)
      setCooldown(5) // 5 second cooldown after each generation
    }
  }, [tracks, getTrack, selectedTrackId, setSuggestions, clearSuggestions, isGenerating, cooldown, setIsGenerating, setErrorMessage])

  return { generateMusic, isGenerating, cooldown}
}