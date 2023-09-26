import { useState } from "react"
import { Input } from "antd"
import { useGraphStore } from "src/stores/graphStore"
import styles from "./index.module.css"
import { GraphNode } from "src/types/Graph"

export const TreeNodeInput = ({ node }: { node: GraphNode }) => {
  const [content, setContent] = useState(node.content)
  const { debouncedUpdateNode } = useGraphStore()

  const onChange = (e: { target: { value: any } }) => {
    const newContent = e.target.value
    setContent(newContent)
    debouncedUpdateNode(node.id, { content: newContent })
  }
  return (
    <span className={styles.input__body}>
      <Input allowClear={false} value={content} onChange={onChange} />
    </span>
  )
}
