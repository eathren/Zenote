import { useParams } from "react-router-dom"
import { Spin } from "antd"
import Playground from "src/components/Playground"

const PlaygroundPage = () => {
  const { graphId } = useParams<{ graphId?: string }>()

  if (!graphId) {
    return <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
  }

  return <Playground graphId={graphId} />
}

export default PlaygroundPage
