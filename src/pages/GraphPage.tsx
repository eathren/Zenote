import { Spin } from "antd"
import { useParams } from "react-router-dom"
import ForceGraph from "src/components/ForceGraph"
import { useNodes } from "src/hooks/useNodes"

const GraphPage = () => {
  const { graphId } = useParams()
  const { nodes, loading } = useNodes(graphId)

  if (!graphId) return <></>
  return (
    <>
      {loading ? (
        <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
      ) : (
        <ForceGraph graphId={graphId} nodes={nodes} />
      )}
    </>
  )
}

export default GraphPage
