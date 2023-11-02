import { useParams } from "react-router-dom"
import LoadingSpinner from "src/components/LoadingSpinner"
import Playground from "src/components/Playground"

const PlaygroundPage = () => {
  const { graphId } = useParams<{ graphId?: string }>()

  if (!graphId) {
    return <LoadingSpinner />
  }

  return <Playground graphId={graphId} />
}

export default PlaygroundPage
