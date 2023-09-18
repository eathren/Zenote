import { getFirestore, collection, getDocs } from "firebase/firestore"
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
