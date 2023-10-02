import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getNodes } from "src/handles"
import { GraphNode } from "src/types"

const GraphPage = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([])

  const { graphId } = useParams()

  useEffect(() => {
    if (!graphId) return
    const getNodesAsync = async (graphId: string) => {
      const n = await getNodes(graphId)
      if (n) setNodes(n)
    }
    getNodesAsync(graphId)
    console.log(nodes)
  }, [graphId])

  return (
    <>
      {nodes.map((node: GraphNode) => {
        return (
          <div key={node.id}>
            <Link to={`${node.id}`}>{node.id}</Link>
            <br />
          </div>
        )
      })}
    </>
  )
}

export default GraphPage
