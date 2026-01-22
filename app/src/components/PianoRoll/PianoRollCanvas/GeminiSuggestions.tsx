import { NoteEvent } from "@signal-app/core"
import { FC } from "react"
import { useGeminiStore } from "../../../hooks/useGeminiStore"
import { usePianoRoll } from "../../../hooks/usePianoRoll"

export const GeminiSuggestions: FC = () => {
  const { suggestions } = useGeminiStore()
  const { transform } = usePianoRoll()

  if (suggestions.length === 0) return null

  return (
    // Render a container with z-index to ensure it sits ON TOP of the grid
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 999, pointerEvents: "none" }}>
      {suggestions.map((note, i) => {
        // Calculate position
        const rect = transform.getRect({
          tick: note.tick,
          noteNumber: note.noteNumber,
          duration: note.duration,
          // Dummy values to satisfy TypeScript
          id: -1, velocity: 100, type: "channel", subtype: "note"
        } as NoteEvent)

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rect.x,
              top: rect.y,
              width: rect.width,
              height: rect.height,
              backgroundColor: "rgba(136, 96, 208, 0.6)", // Ghost Purple
              border: "2px solid #8860D0",
              borderRadius: 4,
              boxSizing: "border-box"
            }}
          />
        )
      })}
    </div>
  )
}