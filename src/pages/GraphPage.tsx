import { useParams } from "react-router-dom"
import ForceGraph from "src/components/ForceGraph"
import { useGraphNodes } from "src/hooks/nodes"
import { GraphEdge } from "src/types"

const GraphPage = () => {
  const edges: GraphEdge[] = []
  const { graphId } = useParams()
  const { nodes } = useGraphNodes(graphId)
  return (
    <>
      <ForceGraph nodes={nodes} edges={edges} width={800} height={600} />
    </>
  )
}

export default GraphPage
