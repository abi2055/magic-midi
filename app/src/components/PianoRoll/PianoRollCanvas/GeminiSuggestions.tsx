import { NoteEvent } from "@signal-app/core";
import { FC } from "react";
import { useGeminiStore } from "../../../hooks/useGeminiStore";
import { useKeyScroll } from "../../../hooks/useKeyScroll";
import { usePianoRoll } from "../../../hooks/usePianoRoll";
import { useTickScroll } from "../../../hooks/useTickScroll";

export const GeminiSuggestions: FC = () => {
  const { suggestions } = useGeminiStore()
  const { transform } = usePianoRoll()
  
  const { scrollLeft } = useTickScroll()
  const { scrollTop } = useKeyScroll()

  if (suggestions.length === 0) return null

  return (
    // makes the HTML overlay match the WebGL Canvas exactly.
    <div 
      style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        pointerEvents: "none", 
        zIndex: 999,           
        transform: `translate(${-scrollLeft}px, ${-scrollTop}px)` 
      }}
    >
      {suggestions.map((note, i) => {
        // Calculate World Coordinates
        const rect = transform.getRect({
          tick: note.tick,
          noteNumber: note.noteNumber,
          duration: note.duration,
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
              backgroundColor: "rgba(136, 96, 208, 0.5)", // Gemini Purple
              border: "1px solid #8860D0",
              borderRadius: 2,
              boxSizing: "border-box"
            }}
          />
        )
      })}
    </div>
  )
}