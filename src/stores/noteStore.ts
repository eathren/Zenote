import { create } from "zustand"
import { Note } from "src/types/Note"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { fetchAllDocuments } from "src/handles/fetchNotes"
import { v4 as uuid } from "uuid"
type NoteState = {
  notes: Note[]
  fetchNotes: () => void
  addNoteBlock: (note: Note) => void
  addEmptyNoteBlock: () => void
  updateNoteContent: (noteId: string, content: string) => void
  setParent: (noteId: string, parentId: string) => void
  removeParent: (noteId: string) => void
}

const db = getFirestore()

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  fetchNotes: async () => {
    const fetchedNotes = await fetchAllDocuments()
    set({ notes: fetchedNotes })
  },
  addNoteBlock: (note) => {
    set((state) => ({ notes: [...state.notes, note] }))
  },
  addEmptyNoteBlock: () => {
    set((state) => ({
      notes: [
        ...state.notes,
        { id: uuid(), content: "", timestamp: Date.now() },
      ],
    }))
  },
  updateNoteContent: async (noteId, content) => {
    await setDoc(doc(db, "notes", noteId), { content })
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === noteId ? { ...note, note: content } : note
      )
      return { notes: updatedNotes }
    })
  },
  setParent: (noteId, parentId) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === noteId ? { ...note, parent: parentId } : note
      )
      return { notes: updatedNotes }
    })
  },
  removeParent: (noteId) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === noteId ? { ...note, parent: undefined } : note
      )
      return { notes: updatedNotes }
    })
  },
}))