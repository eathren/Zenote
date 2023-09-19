import React, { useState } from "react"
import { Row } from "antd"
import { Note } from "src/types/Note"
import ExpansionIcon from "../../ExpansionIcon"
import Dot from "../../Dot"
import { NoteInput } from "../Input"

interface BlockProps extends Note {}

const Block: React.FC<BlockProps> = (props) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Row justify="start" align="middle">
      <ExpansionIcon expanded={expanded} setExpanded={setExpanded} />
      <Dot id={props.id} expanded={expanded} hasChildren={true} />
      <NoteInput noteId={props.id} content={props.content} />
    </Row>
  )
}

export default Block
