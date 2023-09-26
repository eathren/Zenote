// SubPage.tsx
import React from "react"
import { useGraphStore } from "src/stores/graphStore"

export const SubPage: React.FC = () => {
  const { nodes } = useGraphStore()

  return (
    <div>
      {Object.values(nodes).map((node) => (
        <div key={node.id}>{node.content}</div>
      ))}
    </div>
  )
}
