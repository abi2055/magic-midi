import { NoteEvent } from "@signal-app/core";
import { FC } from "react";
import { useGeminiStore } from "../../../hooks/useGeminiStore";
import { useKeyScroll } from "../../../hooks/useKeyScroll";
import { usePianoRoll } from "../../../hooks/usePianoRoll";
import { useTickScroll } from "../../../hooks/useTickScroll";

export const GeminiSuggestions: FC = () => {
  const { suggestions, reasoning } = useGeminiStore()
  const { transform } = usePianoRoll()
  
  const { scrollLeft } = useTickScroll()
  const { scrollTop } = useKeyScroll()

  if (suggestions.length === 0) return null

  const firstNote = suggestions[0]
  const firstRect = transform.getRect({
    tick: firstNote.tick,
    noteNumber: firstNote.noteNumber,
    duration: firstNote.duration,
    velocity: 100,
    type: "channel",
    subtype: "note",
  } as NoteEvent)

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
          id: -1, 
          velocity: 100, 
          type: "channel", 
          subtype: "note"
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
      {reasoning && (
        <div
          style={{
            position: "absolute",
            left: firstRect.x, 
            top: firstRect.y - 80, // Float 80px above the first note
            width: "280px",
            backgroundColor: "rgba(20, 20, 30, 0.95)", // Dark background
            border: "1px solid #8860D0", // Purple Border
            borderRadius: "8px",
            padding: "12px",
            color: "#E0E0E0",
            fontSize: "13px",
            lineHeight: "1.4",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 20px rgba(136, 96, 208, 0.3)", // Glow effect
            backdropFilter: "blur(4px)",
            pointerEvents: "auto", // Allow selecting the text
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
              color: "#c0a0ff",
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            <span>✨ Insight</span>
          </div>

          {/* The AI's Text */}
          <div>{reasoning}</div>

          {/* Footer Instructions */}
          <div
            style={{
              marginTop: "10px",
              paddingTop: "8px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: "10px",
              color: "#888",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>[TAB] Accept</span>
            <span>[ESC] Reject</span>
          </div>
        </div>
      )}
    </div>
  )
}