import React, { useEffect } from "react"
import { Row, Col, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useNoteStore } from "../../../stores/noteStore" // Update the path accordingly
import Block from "../Block"

export const BlockList: React.FC = () => {
  const { notes, fetchNotes, addEmptyNoteBlock } = useNoteStore()

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return (
    <div>
      {notes.map((block) => (
        <Row key={block.id} justify="start" align="middle">
          <Col>
            <Block {...block} />
          </Col>
        </Row>
      ))}
      <Button
        shape="circle"
        icon={<PlusOutlined />}
        onClick={addEmptyNoteBlock}
      />
    </div>
  )
}
