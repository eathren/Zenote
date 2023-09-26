import { AddButton } from "src/components/AddButton"
import { TreeView } from "src/components/Tree"
import { useGraphStore } from "src/stores/graphStore"

export const HomePage = () => {
  const { nodes, edges } = useGraphStore()

  return (
    <>
      <TreeView nodes={nodes} edges={edges} />
      <AddButton />
    </>
  )
}
