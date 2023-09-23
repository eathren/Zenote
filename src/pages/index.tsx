import { useEffect } from "react"
import { AddButton } from "src/components/AddButton"
import { TreeView } from "src/components/Tree"
import { useGraphStore } from "src/stores/graphStore"

export const HomePage = () => {
  const { nodes, edges, fetchGraph } = useGraphStore()

  useEffect(() => {
    if (!nodes || !edges) {
      fetchGraph()
    }
  }, [edges, fetchGraph, nodes])

  return (
    <>
      <TreeView nodes={nodes} edges={edges} />
      <AddButton />
    </>
  )
}
