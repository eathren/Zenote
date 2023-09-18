import { useState } from "react"
import ExpansionIcon from "../../ExpansionIcon"
import Dot from "../../Dot"
import { Row } from "antd"
import { NoteInput } from "../Input"
import { Note } from "src/types/Note"

export const Block = (props: Note) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <Row justify="start" align="middle">
        <ExpansionIcon expanded={expanded} setExpanded={setExpanded} />{" "}
        <Dot id={props.id} expanded={expanded} hasChildren={true} />
        <NoteInput />
      </Row>
    </>
  )
}
