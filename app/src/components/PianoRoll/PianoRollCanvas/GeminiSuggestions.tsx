import { GLFallback } from "@ryohey/webgl-react"
import { FC, useMemo } from "react"
import { useGeminiStore } from "../../../hooks/useGeminiStore"
import { NoteRectangles } from "./NoteRectangles"

// const PURPLE_COLOR: any = [0.53, 0.37, 0.81, 0.8] 

const Layout = {
  keyHeight: 16,
  pixelsPerTick: 0.1,
}
const maxNoteNumber = 127

// const WHITE_COLOR: any = [1, 1, 1, 1]
const GHOST_COLOR: any = [0.53, 0.37, 0.81, 0.6] // Purple with 60% opacity

export interface GeminiSuggestionsProps {
  zIndex: number
}

export const GeminiSuggestions: FC<GeminiSuggestionsProps> = (props) => {
  return (
    <GLFallback
      component={_GeminiSuggestions}
      fallback={() => null}
      {...props}
    />
  )
}

const _GeminiSuggestions: FC<GeminiSuggestionsProps> = ({ zIndex }) => {
  const { suggestions } = useGeminiStore()

  console.log("Gemini Suggestions is Drawing: ", suggestions.length, "rects")

  const rects = useMemo(() => {
    return suggestions.map((note, index) => ({
      id: index,
      x: note.tick,
      y: (maxNoteNumber - note.noteNumber) * Layout.keyHeight,
      width: note.duration,
      height: Layout.keyHeight,
      velocity: note.velocity ?? 100,
      isSelected: false
    }))
  }, [suggestions])

  return (
    <NoteRectangles 
      rects={rects} 
      zIndex={zIndex} 
      strokeColor={GHOST_COLOR}
      inactiveColor={GHOST_COLOR}
      activeColor={GHOST_COLOR}
      selectedColor={GHOST_COLOR} 
    />
  )
}