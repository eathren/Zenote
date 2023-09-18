import React, { useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { Row, Col, Button } from "antd"
import { Block } from "../Block"
import { PlusOutlined } from "@ant-design/icons"
import { Note } from "src/types/Note"
import { fetchAllDocuments } from "../../../handles/fetchNotes"

export const BlockList: React.FC = () => {
  // State for the notes fetched from database
  const [noteBlocks, setNoteBlocks] = useState<Note[]>([])

  // Fetch notes from database
  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await fetchAllDocuments()
      setNoteBlocks(notes)
    }

    // Fetch documents initially
    fetchNotes()
  }, [])

  // Function to add new note block
  const addNoteBlock = useCallback(() => {
    const emptyNoteBlock: Note = {
      id: uuidv4(),
      note: "",
      expanded: false,
      parent: "",
      timestamp: Date.now(),
    }

    if (noteBlocks) setNoteBlocks([...noteBlocks, emptyNoteBlock])
    else setNoteBlocks([emptyNoteBlock])
  }, [noteBlocks])

  // Function to handle Enter key press
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        addNoteBlock()
      }
    },
    [addNoteBlock]
  )

  // Add event listener for Enter key press
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <div>
      {noteBlocks.map((block) => (
        <Row key={block.id} justify="start" align="middle">
          <Col>
            <Block id={block.id} note={block.note} expanded={block.expanded} />
          </Col>
        </Row>
      ))}
      <Button shape="circle" icon={<PlusOutlined />} onClick={addNoteBlock} />
    </div>
  )
}
