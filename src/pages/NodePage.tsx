import React from "react"
import { useParams } from "react-router-dom"

import LoadingSpinner from "src/components/LoadingSpinner"
import PageBlock from "src/components/Blocks/PageBlock"
import { useBlocks } from "src/hooks/useBlocks"

const NodePage: React.FC = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const { blocks, loading, error } = useBlocks(graphId, nodeId)

  if (loading) return <LoadingSpinner />
  if (!nodeId) return <div>Node not found</div>
  return (
    <>
      <PageBlock nodeId={nodeId} blocks={blocks} />
    </>
  )
}

export default NodePage
