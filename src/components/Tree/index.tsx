import { TreeNodeInput } from "src/components/Tree/Input"
import { useGraphStore } from "src/stores/graphStore"
import { TreeNode } from "src/types/Tree"
import { useEffect } from "react"
import { useTreeStore } from "src/stores/treeStore"

const renderTreeNodes = (node: TreeNode) => {
  return (
    <div key={node.id}>
      <TreeNodeInput node={node} />
      {node.children && node.children.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          {node.children.map((child) => renderTreeNodes(child))}
        </div>
      )}
    </div>
  )
}

export const TreeView = () => {
  const { nodes, edges } = useGraphStore()
  const { tree, regenerateTree } = useTreeStore()

  useEffect(() => {
    regenerateTree(nodes, edges)
  }, [nodes, edges, regenerateTree])

  return <div>{tree.map((root) => renderTreeNodes(root))}</div>
}
