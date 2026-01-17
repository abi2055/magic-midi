import {
  DialogProvider,
  ProgressProvider,
  PromptProvider,
  ToastProvider,
} from "dialog-hooks"
import React from "react"
import { HelmetProvider } from "react-helmet-async"
import { ActionDialog } from "../../components/Dialog/ActionDialog"
import { isRunningInElectron } from "../../helpers/platform"
import { ArrangeViewProvider } from "../../hooks/useArrangeView"
import { AuthProvider } from "../../hooks/useAuth"
import { GeminiStoreProvider, useGeminiStore } from "../../hooks/useGeminiStore"
import { PianoRollProvider } from "../../hooks/usePianoRoll"
import { StoreContext } from "../../hooks/useStores"
import { TempoEditorProvider } from "../../hooks/useTempoEditor"
import RootStore from "../../stores/RootStore"
import { ThemeProvider } from "../../theme/ThemeProvider"
import { ProgressDialog } from "../Dialog/ProgressDialog"
import { PromptDialog } from "../Dialog/PromptDialog"
import { RootView } from "../RootView/RootView"
import { GlobalCSS } from "../Theme/GlobalCSS"
import { Toast } from "../ui/Toast"
import { ElectronCallbackHandler } from "./ElectronCallbackHandler"
import { LocalizationProvider } from "./LocalizationProvider"

const rootStore = new RootStore()

const GeminiTestSpy = () => {
  const { setSuggestions } = useGeminiStore()
  
  React.useEffect(() => {
    console.log("Spy is active. Waiting 1 second...")

    const timer = setTimeout(() => {
      console.log("Spy Injecting Test Note")
      setSuggestions([{
        noteNumber: 64,
        tick: 0,
        duration: 200,
        velocity: 100
      }])
    }, 1000)

    return () => clearTimeout(timer)
  }, [setSuggestions])
  
  return null
}

export function App() {
  return (
    <React.StrictMode>
      <StoreContext.Provider value={rootStore}>
        <ThemeProvider>
          <HelmetProvider>
            <ToastProvider component={Toast}>
              <PromptProvider component={PromptDialog}>
                <DialogProvider component={ActionDialog}>
                  <ProgressProvider component={ProgressDialog}>
                    <LocalizationProvider>
                      <AuthProvider>
                        <PianoRollProvider>
                          <ArrangeViewProvider>
                            <TempoEditorProvider>
                              <GlobalCSS />
                              {isRunningInElectron() && (
                                <ElectronCallbackHandler />
                              )}
                              <GeminiStoreProvider>
                                <GeminiTestSpy />
                                <RootView />
                              </GeminiStoreProvider>
                            </TempoEditorProvider>
                          </ArrangeViewProvider>
                        </PianoRollProvider>
                      </AuthProvider>
                    </LocalizationProvider>
                  </ProgressProvider>
                </DialogProvider>
              </PromptProvider>
            </ToastProvider>
          </HelmetProvider>
        </ThemeProvider>
      </StoreContext.Provider>
    </React.StrictMode>
  )
}
