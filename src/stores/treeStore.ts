// treeStore.ts
import { create } from "zustand"
import { useNoteStore } from "./noteStore" // Import noteStore
import { TreeNode } from "src/types/TreeNode"

type TreeState = {
  selectedParentId: string | null
  setSelectedParentId: (id: string) => void
  selectedTreeNodes: TreeNode[] // Now an array
}

export const useTreeStore = create<TreeState>((set) => ({
  selectedParentId: null,
  setSelectedParentId: (id) => set({ selectedParentId: id }),
  selectedTreeNodes: [], // Initialize the selectedTreeNodes to an empty array
}))

// Function to update the selectedTreeNodes based on selectedParentId
export const updateSelectedTreeNodes = () => {
  const { selectedParentId } = useTreeStore.getState()
  const { notes } = useNoteStore.getState() // Get notes from noteStore

  // Find the TreeNode with the correct ID
  const selectedTreeNode = notes.filter((note) => note.id === selectedParentId)

  // Update the selectedTreeNodes in the useTreeStore
  if (selectedTreeNode) {
    useTreeStore.setState({ selectedTreeNodes: selectedTreeNode }) // Wrap it in an array
  } else {
    useTreeStore.setState({ selectedTreeNodes: [] }) // If not found, set to empty array
  }
}
