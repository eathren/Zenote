import { fetchAllDocuments } from "src/handles/fetchNotes"
import { TreeNode } from "src/types/TreeNode"
import { createTree } from "src/utils"
import { create } from "zustand"

type GraphState = {
  nodes: TreeNode[]
  fetchNodes: () => Promise<void>
  addNode: () => void
  updateNode: (nodeId: string, updatedFields: Partial<TreeNode>) => void
  deleteNode: (nodeId: string) => void
}

// UTIL FUNCTIONS NEEDED
// Update node with new information
const initializeStore = async (set: (partial: Partial<GraphState>) => void) => {
  // Fetch all documents and create the initial tree structure
  const fetchedNotes = await fetchAllDocuments()
  const tree = createTree(fetchedNotes)
  set({ nodes: tree })
}
