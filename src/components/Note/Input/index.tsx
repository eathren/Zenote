import React, { useCallback, useState } from "react"
import { Input } from "antd"
import { useNoteStore } from "../../../stores/noteStore" // Update the path accordingly
import styles from "./index.module.css"

interface NoteInputProps {
  noteId: string
  content: string
}

export const NoteInput: React.FC<NoteInputProps> = ({ noteId, content }) => {
  const [value, setValue] = useState<string>(content)
  const [timeoutId, setTimeoutId] = useState<number | null>(null)
  const { updateNote, addNoteBlock } = useNoteStore()

  const createNewNote = useCallback(() => {
    if (value.trim().length > 0) {
      addNoteBlock({
        id: noteId,
        content: "",
        expanded: false,
        parent: "",
        timestamp: Date.now(),
      })
    }
  }, [noteId, value, addNoteBlock])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      createNewNote()
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    const newTimeoutId = setTimeout(() => {
      updateNote()
    }, 3000)
    setTimeoutId(newTimeoutId)
  }

  return (
    <span className={styles.input__body}>
      <Input
        allowClear={false}
        value={value}
        onChange={onChange}
        onPressEnter={handleKeyPress}
      />
    </span>
  )
}
