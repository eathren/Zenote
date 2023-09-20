import React, { useCallback, useEffect, useState } from "react"
import { Row } from "antd"
import { Note } from "src/types/Note"
import ExpansionIcon from "../../ExpansionIcon"
import Dot from "../../Dot"
import { NoteInput } from "../Input"

export const Block = (props: Note & { onAddBlock: () => void }) => {
  const [expanded, setExpanded] = useState(false)

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        props.onAddBlock()
      }
    },
    [props]
  )

  // Add event listener for Enter key press
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <Row justify="start" align="middle">
      <ExpansionIcon expanded={expanded} setExpanded={setExpanded} />
      <Dot id={props.id} expanded={expanded} hasChildren={true} />
      <NoteInput noteId={props.id} content={props.content} />
    </Row>
  )
}

export default Block
