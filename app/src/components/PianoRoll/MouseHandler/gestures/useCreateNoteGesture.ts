import { NoteEvent } from "@signal-app/core"
import { useCallback } from "react"
import { MouseGesture } from "../../../../gesture/MouseGesture"
import { usePianoRoll } from "../../../../hooks/usePianoRoll"
import { useTrack } from "../../../../hooks/useTrack"

export const useCreateNoteGesture = (): MouseGesture => {
  const {
    // transform,
    selectedTrackId,
    // newNoteVelocity,
    // lastNoteDuration,
    // getLocal,
  } = usePianoRoll()
  // const { quantizeRound, quantizeFloor, quantizeUnit } = useQuantizer()
  const { addEvent } = useTrack(selectedTrackId)
  // const { channel, isRhythmTrack, addEvent } = useTrack(selectedTrackId)
  // const { timebase } = useSong()
  // const { pushHistory } = useHistory()
  // const dragNoteCenterAction = useDragNoteCenterGesture()

  return {
    onMouseDown: useCallback(
      (e) => {
        console.log(e)
        // if (e.shiftKey) {
        //   return
        // }

        // const local = getLocal(e)
        // const { tick, noteNumber } = transform.getNotePoint(local)

        // if (channel == undefined || !NoteNumber.isValid(noteNumber)) {
        //   return
        // }

        // pushHistory()

        // const quantizedTick = isRhythmTrack
        //   ? quantizeRound(tick)
        //   : quantizeFloor(tick)

        // const duration = isRhythmTrack
        //   ? timebase / 8 // 32th note in the rhythm track
        //   : (lastNoteDuration ?? quantizeUnit)

        // This hardcoding gives you middle c on click
        addEvent({
          type: "channel",
          subtype: "note",
          noteNumber: 60, // noteNumber
          tick: 0, // quantizedTick
          velocity: 100, // newNoteVelocity
          duration: 480,
        } as NoteEvent)

        return null

        // if (note === undefined) {
        //   return
        // }

        // dragNoteCenterAction.onMouseDown(e, note.id)
      },
      [addEvent],
      // [
      //   transform,
      //   getLocal,
      //   channel,
      //   isRhythmTrack,
      //   quantizeRound,
      //   quantizeFloor,
      //   quantizeUnit,
      //   timebase,
      //   newNoteVelocity,
      //   lastNoteDuration,
      //   addEvent,
      //   pushHistory,
      //   dragNoteCenterAction,
      // ],
    ),
  }
}
