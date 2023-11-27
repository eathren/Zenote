import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LoadingSpinner from "src/components/LoadingSpinner"
import PageBlock from "src/components/Blocks/PageBlock"
import { useBlocks } from "src/hooks/useBlocks"
import { fetchNode } from "src/handles/nodes"
import { GraphNode } from "src/types"
import NodeHeader from "src/components/UI/Headers/NodeHeader"

const NodePage: React.FC = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const { blocks, loading } = useBlocks(graphId, nodeId)
  const [node, setNode] = useState<GraphNode | null>(null)

  useEffect(() => {
    const loadNode = async () => {
      if (!graphId || !nodeId) return
      try {
        const n = await fetchNode(graphId, nodeId)
        setNode(n)
      } catch (error) {
        console.error("Error fetching node:", error)
      }
    }
    loadNode()
  }, [graphId, nodeId])

  if (loading) return <LoadingSpinner />
  if (!node?.id || !graphId) return <div>Node not found</div>
  console.log("blocks", blocks)
  return (
    <>
      <NodeHeader node={node} />
      <PageBlock
        graphId={graphId}
        nodeId={node?.id}
        initialBlocks={blocks.filter((block) => block.id !== node.id)}
      />
    </>
  )
}

export default NodePage
