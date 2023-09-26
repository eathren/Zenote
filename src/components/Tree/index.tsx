import { TreeNodeInput } from "src/components/Tree/Input"
import { useGraphStore } from "src/stores/graphStore"
import { createTree } from "src/utils"
import { TreeNode } from "src/types/Tree"
import { useState, useEffect } from "react"

export const TreeView = () => {
  const { nodes, edges } = useGraphStore()
  const [tree, setTree] = useState<TreeNode[]>([])

  useEffect(() => {
    const calculatedTree = createTree(nodes, edges)
    setTree(calculatedTree)
  }, [nodes, edges])

  return (
    <div>
      <div>
        {tree.map((node) => (
          <TreeNodeInput key={node.id} node={node} />
        ))}
      </div>
    </div>
  )
}
