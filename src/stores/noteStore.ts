import { create } from "zustand"
import { fetchAllDocuments, updateDocumentInDB } from "src/handles/fetchNotes"
import { nanoid } from "nanoid"
import { createTree } from "src/utils"
import { TreeNode } from "src/types/TreeNode"
import { findTreeNodeById } from "./treeStore"
type NoteState = {
  notes: TreeNode[]
  fetchNotes: () => Promise<void>
  addNote: (currentNodeId: string) => void
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
    addNote: (currentNodeId: string) => {
      const notes = get().notes
      const currentNode = findTreeNodeById(currentNodeId, notes)

      if (!currentNode) {
        console.error("Node with the given ID not found.")
        return
      }
      const parent = currentNode.parent
      let newBlockIndex = currentNode.index + 1 // Default behavior

      // If the current node has children and is expanded
      if (currentNode.expanded && currentNode.children?.length) {
        newBlockIndex = 1 // The index for the new block becomes 1
      }

      // Increment indices for all sibling notes that have an index greater than the new index
      const updatedNotes = notes.map((note) => {
        if (note.parent === parent && note.index >= newBlockIndex) {
          return { ...note, index: note.index + 1 }
        }
        return note
      })

      const newBlock: TreeNode = {
        id: nanoid(),
        content: "",
        parent: parent ? parent : undefined,
        index: newBlockIndex,
      }

      console.log(newBlock)

      set({
        notes: [...updatedNotes, newBlock].sort((a, b) => a.index - b.index),
      })
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
