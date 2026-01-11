import React, { createContext, ReactNode, useCallback, useContext, useState } from "react"

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
  setSuggestions: (notes: GeminiNote[]) => void
  clearSuggestions: () => void
  hasSuggestions: boolean
}

const GeminiStoreContext = createContext<GeminiStoreContextType | null>(null)

export const GeminiStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestionsState] = useState<GeminiNote[]>([])

  const setSuggestions = useCallback((notes: GeminiNote[]) => {
    setSuggestionsState(notes)
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestionsState([])
  }, [])

  const value = {
    suggestions,
    setSuggestions,
    clearSuggestions,
    hasSuggestions: suggestions.length > 0,
  }

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