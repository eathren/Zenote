import { useState } from "react"
import { Input } from "antd"
import { useGraphStore } from "src/stores/graphStore"
import styles from "./index.module.css"
import { GraphNode } from "src/types/Graph"

type TreeNodeInputProps = {
  node: GraphNode
}

export const TreeNodeInput = (props: TreeNodeInputProps) => {
  const node = props.node
  const [content, setContent] = useState(node.content)
  const { debouncedUpdateNode, deleteNode, addNode } = useGraphStore()

  const onChange = (e: { target: { value: any } }) => {
    const newContent = e.target.value
    setContent(newContent)
    debouncedUpdateNode(node.id, { content: newContent })
  }

  const handleKeyDown = async (e: any) => {
    console.log("here")
    if (e.key === "Backspace" && content === "") {
      console.log("triggered delete")
      if (node.id) {
        await deleteNode(node.id)
      }
    } else if (e.key === "Enter") {
      addNode()
    }
  }

  return (
    <span className={styles.input__body}>
      <Input
        allowClear={false}
        value={content}
        onChange={onChange}
        id={props.node.id}
        onKeyDown={handleKeyDown}
      />
    </span>
  )
}
