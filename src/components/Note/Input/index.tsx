import React, { useState } from "react"
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
  const { updateNote } = useNoteStore()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    const newTimeoutId = setTimeout(() => {
      updateNote(noteId, { content: e.target.value })
    }, 300)
    setTimeoutId(newTimeoutId)
  }

  return (
    <span className={styles.input__body}>
      <Input allowClear={false} value={value} onChange={onChange} />
    </span>
  )
}
