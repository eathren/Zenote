import { TreeNode } from "src/types/Tree"
import { GraphEdgeObj, GraphNodeObj } from "src/types/Graph"
import { create } from "zustand"
import { createTree } from "src/utils"

type TreeState = {
  tree: TreeNode[]
  regenerateTree: (nodes: GraphNodeObj, edges: GraphEdgeObj) => void
}

export const useTreeStore = create<TreeState>((set) => ({
  tree: [],

  regenerateTree: (nodes: GraphNodeObj, edges: GraphEdgeObj) => {
    set(() => {
      return { tree: createTree(nodes, edges) }
    })
  },
}))
