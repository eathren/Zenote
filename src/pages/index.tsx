import { TreeView } from "src/components/Tree"
import { useTree } from "src/components/hooks/useTree"

export const HomePage = () => {
  const { tree } = useTree()
  return (
    <>
      <TreeView tree={tree} />
    </>
  )
}
