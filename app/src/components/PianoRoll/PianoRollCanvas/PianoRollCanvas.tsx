import { useTheme } from "@emotion/react"
import { GLCanvas, Transform } from "@ryohey/webgl-react"
import { NoteEvent } from "@signal-app/core"
import { FC, MouseEventHandler, useCallback, useEffect, useMemo } from "react"
import { matrixFromTranslation } from "../../../helpers/matrix"
import { useBeats } from "../../../hooks/useBeats"
import { useContextMenu } from "../../../hooks/useContextMenu"
import { useGeminiStore } from "../../../hooks/useGeminiStore"
import { useKeyScroll } from "../../../hooks/useKeyScroll"
import { usePianoRoll } from "../../../hooks/usePianoRoll"
import { useTickScroll } from "../../../hooks/useTickScroll"
import { useTrack } from "../../../hooks/useTrack"
import { Beats } from "../../GLNodes/Beats"
import { Cursor } from "../../GLNodes/Cursor"
import { useNoteMouseGesture } from "../MouseHandler/useNoteMouseGesture"
import { PianoSelectionContextMenu } from "../PianoSelectionContextMenu"
import { GeminiSuggestions } from "./GeminiSuggestions"
import { GhostNotes } from "./GhostNotes"
import { Lines } from "./Lines"
import { Notes } from "./Notes"
import { NoteSelection } from "./NoteSelection"


export interface PianoRollCanvasProps {
  width: number
  height: number
}

export const PianoRollCanvas: FC<PianoRollCanvasProps> = ({
  width,
  height,
}) => {
  const { suggestions, clearSuggestions } = useGeminiStore()
  const { selectedTrackId } = usePianoRoll()
  const { addEvent } = useTrack(selectedTrackId)
  // console.log("Current Gemini Suggestions:", suggestions);

  const { ghostTrackIds, mouseMode } = usePianoRoll()
  const beats = useBeats()
  const { cursorX, setCanvasWidth, scrollLeft } = useTickScroll()
  const { scrollTop, setCanvasHeight } = useKeyScroll()

  const mouseHandler = useNoteMouseGesture()

  const { onContextMenu, menuProps } = useContextMenu()

  const theme = useTheme()

  const handleContextMenu: MouseEventHandler = useCallback(
    (e) => {
      // Ctrl + Click is used to copy the selected notes
      if (e.ctrlKey) {
        return
      }

      if (mouseMode === "selection") {
        e.stopPropagation()
        onContextMenu(e)
        return
      }
    },
    [mouseMode, onContextMenu],
  )

  useEffect(() => {
    setCanvasWidth(width)
  }, [width, setCanvasWidth])

  useEffect(() => {
    setCanvasHeight(height)
  }, [height, setCanvasHeight])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Tab" && suggestions.length > 0) {
        e.preventDefault()
        console.log("Tab pressed - inserting Gemini suggestion")

        try {
          suggestions.forEach((ghost: any) => {
            const noteNumber = Math.floor(Number(ghost.noteNumber))
            const tick = Math.floor(Number(ghost.tick))
            const duration = Math.floor(Number(ghost.duration))
            const velocity = ghost.velocity ?? 127

            addEvent({
              type: "channel",
              subtype: "note",
              noteNumber: noteNumber,
              tick: tick,
              duration: duration,
              velocity: velocity,
            } as NoteEvent)
          })
        }
        finally {
          setTimeout(() => {
            console.log("Clearing Gemini suggestions after insertion")
            clearSuggestions()
          }, 0)
        }
      }

      if (e.code === "Escape" && suggestions.length > 0) {
          e.preventDefault()
          console.log("Escape pressed - clearing Gemini suggestions")
          clearSuggestions()  
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [suggestions, addEvent, clearSuggestions])

  const scrollXMatrix = useMemo(
    () => matrixFromTranslation(-scrollLeft, 0),
    [scrollLeft],
  )

  const scrollYMatrix = useMemo(
    () => matrixFromTranslation(0, -scrollTop),
    [scrollTop],
  )

  const scrollXYMatrix = useMemo(
    () => matrixFromTranslation(-scrollLeft, -scrollTop),
    [scrollLeft, scrollTop],
  )

  const style = useMemo(
    () => ({
      backgroundColor: theme.editorBackgroundColor,
    }),
    [theme],
  )

  return (
    <div style={{ position: "relative", width: width, height: height, overflow: "hidden" }}>
      <GLCanvas
        width={width}
        height={height}
        cursor={mouseMode === "pencil" ? "auto" : "crosshair"}
        style={style}
        onContextMenu={handleContextMenu}
        onMouseDown={(e) => {
          if (suggestions.length > 0) {
            clearSuggestions()
          }
          mouseHandler.onMouseDown(e)
        }}
        onMouseMove={mouseHandler.onMouseMove}
        onMouseUp={mouseHandler.onMouseUp}

      >
        <Transform matrix={scrollYMatrix}>
          <Lines zIndex={0} />
        </Transform>
        <Transform matrix={scrollXMatrix}>
          <Beats height={height} beats={beats} zIndex={1} />
          <Cursor x={cursorX} height={height} zIndex={5} />
        </Transform>
        <Transform matrix={scrollXYMatrix}>
          {ghostTrackIds.map((trackId) => (
            <GhostNotes key={trackId} trackId={trackId} zIndex={2} />
          ))}
          <Notes zIndex={3} />
          <NoteSelection zIndex={4} />
        </Transform>
      </GLCanvas>
      <GeminiSuggestions />
      <PianoSelectionContextMenu {...menuProps} />
    </div>
  )
}
