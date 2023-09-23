import React, { useState } from "react"
import { Input } from "antd"
import { useGraphStore } from "src/stores/graphStore"
import styles from "./index.module.css"
import { GraphNode } from "src/types/Graph"

export const TreeNodeInput = ({ node }: { node: GraphNode }) => {
  const [content, setContent] = useState(node.content)
  const { updateNode } = useGraphStore()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    updateNode(node.id, { content: newContent })
  }

  return (
    <span className={styles.input__body}>
      <Input allowClear={false} value={content} onChange={onChange} />
    </span>
  )
}
