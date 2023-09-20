import { TreeNode } from "src/types/TreeNode"

// Recursive component to render TreeNode and its children
const TreeNodeComponent = ({ node }: { node: TreeNode }) => {
  console.log(node)
  return (
    <div style={{ marginLeft: "20px" }}>
      <div>
        {node.content} (Index: {node.index})
      </div>{" "}
      {node.children?.map((child) => (
        <TreeNodeComponent key={child.id} node={child} />
      ))}
    </div>
  )
}

// Your main component
export const TreeView = ({ notes }: { notes: TreeNode[] }) => {
  // Assume "notes" contains only root nodes and each root node has its children properly nested
  return (
    <div>
      {notes.map((node) => (
        <TreeNodeComponent key={node.id} node={node} />
      ))}
    </div>
  )
}
