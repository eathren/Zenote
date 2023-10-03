import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ForceGraph from "src/components/ForceGraph"
import { getNodes } from "src/handles"
import { useLoadingStore } from "src/stores/loadingStore"
import { GraphNode } from "src/types"

const GraphPage = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([])

  const { graphId } = useParams()
  const { setLoadingNodes } = useLoadingStore()
  useEffect(() => {
    if (!graphId) return
    const getNodesAsync = async (graphId: string) => {
      setLoadingNodes(true)
      const n = await getNodes(graphId)
      if (n) setNodes(n)
      setLoadingNodes(false)
    }
    getNodesAsync(graphId)
    console.log(nodes)
  }, [graphId, setLoadingNodes])

  return (
    <>
      <ForceGraph nodes={nodes} />
    </>
  )
}

export default GraphPage
