import { useParams } from "react-router-dom"
import ForceGraph from "src/components/ForceGraph"
import { useEdges } from "src/hooks/useEdges"
import { useNodes } from "src/hooks/useNodes"

const GraphPage = () => {
  const { graphId } = useParams()
  const { nodes } = useNodes(graphId)
  const { edges } = useEdges(graphId)
  return (
    <>
      <ForceGraph nodes={nodes} edges={edges} />
    </>
  )
}

export default GraphPage
