import { ThemeProvider } from "@emotion/react"
import { ToastProvider } from "dialog-hooks"
import { FC } from "react"
import { HelmetProvider } from "react-helmet-async"
import { Toast } from "../components/Toast.js"
import { StoreContext } from "../hooks/useStores.js"
import RootStore from "../stores/RootStore.js"
import { defaultTheme } from "../theme/Theme.js"
import { GlobalCSS } from "./GlobalCSS.js"
import { RootView } from "./RootView.js"

const rootStore = new RootStore()

export const App: FC = () => {
  return (
    <StoreContext.Provider value={rootStore}>
      <ThemeProvider theme={defaultTheme}>
        <HelmetProvider>
          <ToastProvider component={Toast}>
            <GlobalCSS />
            <RootView />
          </ToastProvider>
        </HelmetProvider>
      </ThemeProvider>
    </StoreContext.Provider>
  )
}
