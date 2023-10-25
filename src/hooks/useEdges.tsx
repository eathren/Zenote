import { useEffect, useState } from "react"
import { GraphEdge } from "src/types"
import { useNodes } from "./useNodes"
import { addEdgeToNode, deleteEdgeInDB } from "src/handles/edges"

export const useEdges = (
  graphId: string | undefined,
  nodeId: string | undefined
) => {
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const { nodes } = useNodes(graphId)

  const addEdge = async (targetNodeId: string) => {
    if (!graphId || !nodeId) return
    await addEdgeToNode(graphId, nodeId, targetNodeId)
  }

  const deleteEdge = async (targetNodeId: string) => {
    if (!graphId || !nodeId) return
    await deleteEdgeInDB(graphId, nodeId, targetNodeId)
  }

  useEffect(() => {
    if (!nodeId) return
    const n = nodes.find((node) => node.id === nodeId)
    const e = n?.edges ?? []
    setEdges(e)
  }, [nodeId, nodes])

  return {
    edges,
    addEdge,
    deleteEdge,
  }
}
