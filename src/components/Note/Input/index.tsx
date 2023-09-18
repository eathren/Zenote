import React, { useCallback, useEffect, useState } from "react"
import { Input } from "antd"
import { v4 as uuidv4 } from "uuid"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import styles from "./index.module.css"

export const NoteInput: React.FC = () => {
  // Initialize local state for the input value
  const [value, setValue] = useState<string>("")
  const [timeoutId, setTimeoutId] = useState<number | null>(null) // State to keep track of the timer

  const db = getFirestore()

  const docId = localStorage.getItem("docId") || uuidv4()
  localStorage.setItem("docId", docId)

  const noteRef = doc(db, "notes", docId)

  // Function to update the Firestore document
  const updateNote = async () => {
    await setDoc(noteRef, { content: value })
    console.log("updating")
  }

  const fetchNote = useCallback(async () => {
    const docSnapshot = await getDoc(noteRef)
    if (docSnapshot.exists()) {
      setValue(docSnapshot.data().content)
    }
  }, [noteRef])

  // Handler for the onChange event of the Input element
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)

    // Clear the existing timer, if any
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Start a new timer
    const newTimeoutId = setTimeout(() => {
      updateNote()
    }, 1000) // 1000 ms delay

    // Save the new timer ID
    setTimeoutId(newTimeoutId)
  }

  useEffect(() => {
    fetchNote()
  }, [fetchNote])

  return (
    <span className={styles.input__body}>
      <Input allowClear={false} value={value} onChange={onChange} />
    </span>
  )
}
