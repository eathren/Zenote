import { useEffect, useState } from "react"
import { Row } from "antd"
import ExpansionIcon from "../../ExpansionIcon"
import Dot from "../../Dot"
import { NoteInput } from "../Input"
import { TreeNode } from "src/types/TreeNode"
import { useNoteStore } from "src/stores/noteStore"

export const Block = (props: TreeNode) => {
  const [expanded, setExpanded] = useState(false)
  const { updateNote } = useNoteStore()

  useEffect(() => {
    if (props.expanded) setExpanded(props.expanded)
    else setExpanded(false)
  }, [props.expanded])

  const toggleExpansion = () => {
    setExpanded(!expanded)
    updateNote(props.id, { expanded: !expanded })
  }

  return (
    <Row justify="start" align="middle">
      <ExpansionIcon expanded={expanded} setExpanded={toggleExpansion} />
      <Dot id={props.id} expanded={expanded} hasChildren={true} />
      <NoteInput noteId={props.id} content={props.content} />
    </Row>
  )
}

export default Block
