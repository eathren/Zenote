import { create } from "zustand"
import { fetchAllDocuments, updateDocumentInDB } from "src/handles/fetchNotes"
import { createTree } from "src/utils"
import { TreeNode } from "src/types/TreeNode"
import { findTreeNodeById } from "./treeStore"
import { v4 as uuidv4 } from "uuid"

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
      let notes = get().notes

      const newBlock: TreeNode = {
        id: uuidv4(),
        content: "",
        index: 0,
      }

      const updater = (node: TreeNode) => {
        if (node.expanded && node.children?.length) {
          // Node is expanded and has children, insert at the top of children list
          newBlock.parent = node.id
          node.children = [newBlock, ...node.children]
        } else {
          // Find the parent node to insert the new node as its sibling
          const parentNode: TreeNode | null = node.parent
            ? findTreeNodeById(node.parent, notes)
            : null

          if (parentNode) {
            // It's a child node; we insert it as the last child of its parent
            newBlock.parent = parentNode.id
            newBlock.index = (parentNode.children?.length || 0) + 1
            parentNode.children = [...(parentNode.children || []), newBlock]
          } else {
            // It's a root node
            newBlock.index = node.index + 1
            newBlock.parent = node.parent

            // Update indices for existing nodes
            notes = notes.map((note) => {
              if (note.parent === node.parent && note.index >= newBlock.index) {
                return { ...note, index: note.index + 1 }
              }
              return note
            })

            notes.push(newBlock)
          }
        }
      }

      updateNodeById(currentNodeId, notes, updater)

      console.log(newBlock, notes)
      // Sort the notes by index for easier rendering later
      set({
        notes: notes.sort((a, b) => a.index - b.index),
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

const updateNodeById = (
  id: string,
  nodes: TreeNode[],
  updater: (node: TreeNode) => void
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      updater(node)
      return node
    }
    if (node.children) {
      node.children = updateNodeById(id, node.children, updater)
    }
    return node
  })
}
