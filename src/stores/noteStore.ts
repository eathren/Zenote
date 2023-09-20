import { create } from "zustand"
import { fetchAllDocuments, updateDocumentInDB } from "src/handles/fetchNotes"
import { nanoid } from "nanoid"
import { createTree } from "src/utils"
import { TreeNode } from "src/types/TreeNode"

type NoteState = {
  notes: TreeNode[]
  fetchNotes: () => Promise<void>
  addNote: (index: number, parentId?: string) => void
  updateNote: (noteId: string, updatedFields: Partial<TreeNode>) => void
  deleteNote: (noteId: string) => void
}

const initializeStore = async (set: (partial: Partial<NoteState>) => void) => {
  // Fetch all documents and create the initial tree structure
  const fetchedNotes = await fetchAllDocuments()
  const tree = createTree(fetchedNotes)
  set({ notes: tree })
}

export const useNoteStore = create<NoteState>((set, get) => {
  // Initialize the store with fetched notes without awaiting
  // Handle loading state within your application if necessary
  initializeStore(set).catch((error) => {
    // Handle initialization error here
    console.error("Failed to initialize store:", error)
  })

  return {
    notes: [],
    fetchNotes: async () => {
      const fetchedNotes = await fetchAllDocuments()
      const tree = createTree(fetchedNotes)
      set({ notes: tree })
    },
    addNote: (index: number, parent?: string) => {
      const notes = get().notes
      const newNote: TreeNode = {
        id: nanoid(),
        content: "",
        parent,
        index: index + 1,
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
    updateNote: async (noteId: string, updatedFields: Partial<TreeNode>) => {
      const notes = get().notes
      const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, ...updatedFields } : note
      )
      await updateDocumentInDB(noteId, updatedFields)
      set({ notes: updatedNotes })
    },
    deleteNote: (noteId: string) => {
      let notes = get().notes
      const removeNoteAndChildren = (id: string) => {
        notes = notes.filter((note) => note.id !== id)
        notes.forEach((note) => {
          if (note.parent === id) {
            removeNoteAndChildren(note.id)
          }
        })
      }
      removeNoteAndChildren(noteId)

      let indexCounter = 0
      notes = notes.map((note) => {
        note.index = indexCounter++
        return note
      })

      set({ notes })
    },
  }
})
