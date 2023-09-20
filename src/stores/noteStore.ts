import { create } from "zustand"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { fetchAllDocuments } from "src/handles/fetchNotes"
import { nanoid } from "nanoid"
import { createTree } from "src/utils"
import { TreeNode } from "src/types/TreeNode"
type NoteState = {
  notes: TreeNode[]
  fetchNotes: () => void
  addNote: (index: number, parentId?: string) => void
  updateNote: (noteId: string, content: string, parent: string) => void
  deleteNote: (noteId: string) => void
}

const initializeStore = async (set: any, get: any) => {
  const fetchedNotes = await fetchAllDocuments()
  const tree = createTree(fetchedNotes)
  set({ notes: tree })
}

export const useNoteStore = create<NoteState>(async (set, get) => {
  // Initialize store with fetched notes
  await initializeStore(set, get)

  return {
    notes: [],
    fetchNotes: async () => {
      const fetchedNotes = await fetchAllDocuments()
      const tree = createTree(fetchedNotes)
      console.log("1", fetchedNotes, tree)
      set({ notes: tree })
    },
    addNote: (index: number, parent?: string) => {
      const notes = get().notes
      const newNote = {
        id: nanoid(),
        content: "",
        parent,
        index: index + 1, // New note takes index one higher than the position it's inserted
      }

      const updatedNotes = [
        ...notes.slice(0, index + 1),
        newNote,
        ...notes
          .slice(index + 1)
          .map((note) => ({ ...note, index: note.index! + 1 })),
      ]

      set({ notes: updatedNotes })
    },
    updateNote: (noteId: string, content: string, parent: string) => {
      const notes = get().notes

      // Update content and parent only, keep existing index
      const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, content, parent } : note
      )

      set({ notes: updatedNotes })
    },
    deleteNote: (noteId: string) => {
      let notes = get().notes

      // Identify and remove the note and all its child nodes
      const removeNoteAndChildren = (id: string) => {
        notes = notes.filter((note) => note.id !== id)
        notes.forEach((note) => {
          if (note.parent === id) {
            removeNoteAndChildren(note.id)
          }
        })
      }

      removeNoteAndChildren(noteId)

      // Re-index remaining notes. This could be made more efficient if needed.
      let indexCounter = 0
      notes = notes.map((note) => {
        note.index = indexCounter++
        return note
      })

      set({ notes })
    },
  }
})
