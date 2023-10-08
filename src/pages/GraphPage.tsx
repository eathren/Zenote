import { Spin } from "antd"
import { useParams } from "react-router-dom"
import ForceGraph from "src/components/ForceGraph"
import { useEdges } from "src/hooks/useEdges"
import { useNodes } from "src/hooks/useNodes"

const GraphPage = () => {
  const { graphId } = useParams()
  const { loading: nodesLoading } = useNodes(graphId)
  const { loading: edgesLoading } = useEdges(graphId)

  return (
    <>
      {nodesLoading || edgesLoading ? (
        <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
      ) : (
        <ForceGraph />
      )}
    </>
  )
}

export default GraphPage
