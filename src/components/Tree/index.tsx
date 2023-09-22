import { TreeNode } from "src/types/TreeNode"
import Block from "src/components/Note/Block"
import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useNoteStore } from "src/stores/noteStore"

// Recursive component to render TreeNode and its children
const TreeNodeComponent = ({ node }: { node: TreeNode }) => {
  const { addNote } = useNoteStore()

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.stopPropagation()
      addNote(node.id)
    }
  }
  return (
    <div style={{ marginLeft: "20px" }} onKeyDown={handleEnter}>
      <Block {...node} />
      {node.expanded &&
        node.children?.map((child) => (
          <TreeNodeComponent key={child.id} node={child} />
        ))}
    </div>
  )
}

// Your main component
const TreeView = ({ notes }: { notes: TreeNode[] }) => {
  // Assume "notes" contains only root nodes and each root node has its children properly nested
  return (
    <div>
      {notes &&
        notes.map((node) => <TreeNodeComponent key={node.id} node={node} />)}
      <Button shape="circle" icon={<PlusOutlined />} />
    </div>
  )
}

export default TreeView
