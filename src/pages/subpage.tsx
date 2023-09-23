// SubPage.tsx
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useGraphStore } from "src/stores/graphStore"

export const SubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { nodes, edges, fetchGraph } = useGraphStore()

  useEffect(() => {
    if (!nodes || !edges) {
      fetchGraph()
    }
  }, [edges, fetchGraph, nodes])

  return (
    <div>
      {Object.values(nodes).map((node) => (
        <div key={node.id}>{node.content}</div>
      ))}
    </div>
  )
}
