import { create } from "zustand"
import { GraphNodeObj, GraphEdgeObj } from "src/types/Graph"
import { TreeNode } from "src/types/Tree"
import { createTree } from "src/utils"

type TreeState = {
  tree: TreeNode[]
  regenerateTree: (nodes: GraphNodeObj, edges: GraphEdgeObj) => void
}

export const useTreeStore = create<TreeState>((set) => ({
  tree: [],

  regenerateTree: (nodes, edges) => {
    set(() => {
      return { tree: createTree(nodes, edges) }
    })
  },
}))
