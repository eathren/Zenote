import { Spin } from "antd"
import { useParams } from "react-router-dom"
import ForceGraph from "src/components/ForceGraph"
import { useEdges } from "src/hooks/useEdges"
import { useNodes } from "src/hooks/useNodes"

const GraphPage = () => {
  const { graphId } = useParams()
  const { nodes, loading: nodesLoading } = useNodes(graphId)
  const { edges, loading: edgesLoading } = useEdges(graphId)

  if (nodesLoading || edgesLoading) {
    return <Spin style={{ color: "white" }}></Spin>
  }
  return (
    <>
      <ForceGraph nodes={nodes} edges={edges} />
    </>
  )
}

export default GraphPage
