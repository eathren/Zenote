import { useEffect } from "react"
import { useGraphStore } from "src/stores/graphStore"
import { useTreeStore } from "src/stores/treeStore"

export const useTree = () => {
  const { tree, regenerateTree } = useTreeStore()
  const { nodes, edges } = useGraphStore()

  useEffect(() => {
    regenerateTree(nodes, edges)
  }, [nodes, edges, regenerateTree])

  return { tree, regenerateTree }
}
