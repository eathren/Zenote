import React, { useState } from "react"
import ExpansionIcon from "../ExpansionIcon"
import Dot from "../Dot"
import { Row } from "antd"
export const NoteBlock: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState("")
  const [id, setId] = useState("1")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value)
  }

  return (
    <>
      <Row justify="start" align="middle">
        <ExpansionIcon expanded={expanded} setExpanded={setExpanded} />{" "}
        <Dot id={id} expanded={expanded} hasChildren={true} />
        {note}
      </Row>
    </>
  )
}
