import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ForceGraph from "src/components/ForceGraph"
import LoadingSpinner from "src/components/LoadingSpinner"
import GraphHeader from "src/components/UI/Headers/GraphHeader"
import useGraphs from "src/hooks/useGraphs"
import { useNodes } from "src/hooks/useNodes"
import { Graph } from "src/types"
import { findGraph } from "src/utils"

const GraphPage = () => {
  const { graphId } = useParams<{ graphId: string }>()
  const { nodes, loading } = useNodes(graphId)
  const { graphs } = useGraphs()
  const [graph, setGraph] = useState<Graph | null>(null)

  useEffect(() => {
    const foundGraph = findGraph(graphs, graphId)
    if (!foundGraph) return
    setGraph(foundGraph)
  }, [graphId, graphs])
  if (!graphId) return <></>
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <GraphHeader title={graph?.name} />
          <ForceGraph graphId={graphId} nodes={nodes} />
        </>
      )}
    </>
  )
}

export default GraphPage
