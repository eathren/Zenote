import { useParams } from "react-router-dom"
import { useEdges } from "src/hooks/useEdges"
import { useNodes } from "src/hooks/useNodes"

const PlaygroundPage = () => {
  const { graphId } = useParams()
  const { data: nodes } = useNodes(graphId)
  const { data: edges } = useEdges(graphId)
  return (
    <div>
      {nodes.forEach((node) => {
        return <p>{node.name}</p>
      })}
    </div>
  )
}

export default PlaygroundPage
