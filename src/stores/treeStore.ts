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

// Utility function to find a TreeNode by id
export const findTreeNodeById = (
  id: string,
  nodes: TreeNode[]
): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node

    if (node.children) {
      const foundNode = findTreeNodeById(id, node.children)
      if (foundNode) return foundNode
    }
  }

  return null
}

// Function to update the selectedTreeNodes based on selectedParentId
export const updateSelectedTreeNodes = () => {
  const { selectedParentId } = useTreeStore.getState()
  const { notes } = useNoteStore.getState() // Get notes from noteStore

  // Find the TreeNode with the correct ID
  const selectedTreeNode = findTreeNodeById(selectedParentId || "", notes)
  // Update the selectedTreeNodes in the useTreeStore
  if (selectedTreeNode) {
    useTreeStore.setState({ selectedTreeNodes: [selectedTreeNode] })
  } else {
    useTreeStore.setState({ selectedTreeNodes: [] })
  }
}
