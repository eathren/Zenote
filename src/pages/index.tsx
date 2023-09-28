import { TreeView } from "src/components/Tree"
import { useTree } from "src/hooks/useTree"

export const HomePage = () => {
  const { tree } = useTree()
  return (
    <>
      <TreeView tree={tree} />
    </>
  )
}
