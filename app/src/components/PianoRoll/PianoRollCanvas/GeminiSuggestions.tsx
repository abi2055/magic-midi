import { NoteEvent } from "@signal-app/core";
import { FC, useEffect, useState } from "react";
import { useGeminiStore } from "../../../hooks/useGeminiStore";
import { useKeyScroll } from "../../../hooks/useKeyScroll";
import { usePianoRoll } from "../../../hooks/usePianoRoll";
import { useTickScroll } from "../../../hooks/useTickScroll";

export const GeminiSuggestions: FC = () => {
  const { suggestions, reasoning } = useGeminiStore()
  const { transform } = usePianoRoll()
  const { scrollLeft } = useTickScroll()
  const { scrollTop } = useKeyScroll()

  const [showInsight, setShowInsight] = useState(true);

  useEffect(() => {
    if (reasoning) {
      setShowInsight(true);
    }
  }, [reasoning]);

  if (suggestions.length === 0) return null

  const firstNote = suggestions[suggestions.length - 1];
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
      {reasoning && showInsight && (
        <div
          style={{
            position: "absolute",
            // Moved to the Right (+200px) and Up (-50px) to clear the notes
            left: firstRect.x + 200, 
            top: firstRect.y - 50, 
            width: "280px",
            backgroundColor: "rgba(20, 20, 30, 0.95)",
            border: "1px solid #8860D0",
            borderRadius: "8px",
            padding: "12px",
            color: "#E0E0E0",
            fontSize: "13px",
            lineHeight: "1.4",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            pointerEvents: "auto", // Enable clicking the X
            zIndex: 1000,
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Pushes X to the right
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                color: "#c0a0ff",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>✨ Insight</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation() // Prevent triggering other clicks
                setShowInsight(false) // Hide box only
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#888",
                cursor: "pointer",
                padding: "4px",
                lineHeight: 1,
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{ marginBottom: "8px" }}>{reasoning}</div>

          {/* Footer */}
          <div
            style={{
              paddingTop: "8px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: "10px",
              color: "#666",
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