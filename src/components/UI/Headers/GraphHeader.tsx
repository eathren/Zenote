import NodeMenu from "../../NodeMenu"
import GraphControls from "../../GraphControls"
import BasicHeader from "./BasicHeader"
import { useParams } from "react-router-dom"

const GraphHeader = () => {
  const { graphId } = useParams<{ graphId: string }>()

  if (!graphId) return <></>
  return (
    <>
      <BasicHeader>
        <NodeMenu />
        <GraphControls />
      </BasicHeader>
    </>
  )
}

export default GraphHeader
