import { useParams } from "react-router-dom"
import ForceGraph from "src/components/ForceGraph"
import { useGraphEdges } from "src/hooks/edges"
import { useGraphNodes } from "src/hooks/nodes"

const GraphPage = () => {
  const { graphId } = useParams()
  const { nodes } = useGraphNodes(graphId)
  const { edges } = useGraphEdges(graphId)
  return (
    <>
      <ForceGraph nodes={nodes} edges={edges} />
    </>
  )
}

export default GraphPage
