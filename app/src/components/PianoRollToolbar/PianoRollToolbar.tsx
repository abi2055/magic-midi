import styled from "@emotion/styled"
import { FC } from "react"
import { useGeminiGenerator } from "../../hooks/useGeminiGenerator"
import { InstrumentBrowser } from "../InstrumentBrowser/InstrumentBrowser"
import { AutoScrollButton } from "../Toolbar/AutoScrollButton"
import { QuantizeSelector } from "../Toolbar/QuantizeSelector/QuantizeSelector"
import { Toolbar } from "../Toolbar/Toolbar"
import { TrackListMenuButton } from "../TrackList/TrackListMenuButton"
import { EventListButton } from "./EventListButton"
import { InstrumentButton } from "./InstrumentButton"
import { PanSlider } from "./PanSlider"
import { PianoRollToolSelector } from "./PianoRollToolSelector"
import { TrackNameInput } from "./TrackNameInput"
import { VolumeSlider } from "./VolumeSlider"

const Spacer = styled.div`
  width: 1rem;
`

const FlexibleSpacer = styled.div`
  flex-grow: 1;
`

const GeminiButton = styled.button<{ isLoading: boolean }>`
  background-color: #8860D0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 12px;
  margin-right: 1rem;
  height: 2rem;
  font-weight: bold;
  cursor: ${props => props.isLoading ? "wait" : "pointer"};
  opacity: ${props => props.isLoading ? 0.7 : 1};
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #704CB0;
  }
`

export const PianoRollToolbar: FC = () => {
  const { generateMusic, isGenerating } = useGeminiGenerator()
  return (
    <Toolbar>
      <TrackListMenuButton />

      <TrackNameInput />

      <EventListButton />

      <Spacer />

      <InstrumentButton />
      <InstrumentBrowser />

      <VolumeSlider />
      <PanSlider />

      <FlexibleSpacer />

      <GeminiButton onClick={generateMusic} isLoading={isGenerating}>
        {isGenerating ? "Thinking..." : "✨ Ask Gemini"}
      </GeminiButton>

      <PianoRollToolSelector />

      <QuantizeSelector />

      <AutoScrollButton />
    </Toolbar>
  )
}
