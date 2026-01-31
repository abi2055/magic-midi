import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react"

// The structure of a Gemini note
export interface GeminiNote {
  noteNumber: number
  tick: number
  duration: number
  velocity: number
}

// The context type for the Gemini store
interface GeminiStoreContextType {
  suggestions: GeminiNote[]
  reasoning: string | null
  setSuggestions: (notes: GeminiNote[], reasoning: string) => void
  clearSuggestions: () => void
  hasSuggestions: boolean
}

const GeminiStoreContext = createContext<GeminiStoreContextType | null>(null)

export const GeminiStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestionsState] = useState<GeminiNote[]>([])
  const [reasoning, setReasoningState] = useState<string | null>(null)

  const setSuggestions = useCallback((notes: GeminiNote[], newReasoning: string) => {
    setSuggestionsState(notes)
    setReasoningState(newReasoning)
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestionsState([])
    setReasoningState(null)
  }, [])

  const value = useMemo(() => ({
    suggestions,
    reasoning,
    setSuggestions,
    clearSuggestions,
    hasSuggestions: suggestions.length > 0,
  }), [suggestions, setSuggestions, clearSuggestions, reasoning])

  return (
    <GeminiStoreContext.Provider value={value}>
      {children}
    </GeminiStoreContext.Provider>
  )
}

export const useGeminiStore = () => {
  const context = useContext(GeminiStoreContext)
  if (!context) {
    throw new Error("useGeminiStore must be used within a GeminiStoreProvider")
  }
  return context
}