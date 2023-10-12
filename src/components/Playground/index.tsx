import { Spin, Typography } from "antd"
import { Link } from "react-router-dom"
import { useNodes } from "src/hooks/useNodes"

const { Text } = Typography

interface PlaygroundProps {
  graphId: string
}

const Playground = ({ graphId }: PlaygroundProps) => {
  const { nodes, loading } = useNodes(graphId)

  if (loading) {
    return <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
  }

  return (
    <div>
      {nodes && nodes.length > 0 ? (
        nodes.map((node) => {
          const nodeLink = `/graphs/${graphId}/node/${node.id}`
          return (
            <div key={node.id}>
              <Link to={nodeLink}>
                <Text style={{ color: "white" }}>{node.name}</Text>
              </Link>
              <br />
            </div>
          )
        })
      ) : (
        <Text>No nodes available</Text>
      )}
    </div>
  )
}

export default Playground
