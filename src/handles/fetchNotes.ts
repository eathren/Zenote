import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore"
import { Note } from "src/types/Note"

export const fetchAllDocuments = async (): Promise<Note[]> => {
  // Initialize Firestore
  const db = getFirestore()

  // Reference to Firestore collection
  const notesCollection = collection(db, "notes")

  // Fetch all documents
  const querySnapshot = await getDocs(notesCollection)

  // Initialize an empty array to store fetched data
  const allNotes: Note[] = []

  // Loop through each document and get data
  querySnapshot.forEach((doc) => {
    allNotes.push({
      id: doc.id,
      ...doc.data(),
    } as Note)
  })

  return allNotes
}

export const updateDocumentInDB = async (
  noteId: string,
  updatedFields: Partial<Note>
): Promise<void> => {
  // Initialize Firestore
  const db = getFirestore()

  // Reference to Firestore collection and specific document
  const notesCollection = collection(db, "notes")
  const noteDoc = doc(notesCollection, noteId)

  // Update document with new fields
  await updateDoc(noteDoc, updatedFields)
}
