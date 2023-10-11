import { Typography } from "antd"
import { useParams } from "react-router-dom"
import { useNodes } from "src/hooks/useNodes"

const { Text } = Typography

const PlaygroundPage = () => {
  const { graphId } = useParams<{ graphId: string }>()
  const { data: nodes } = useNodes(graphId)

  return (
    <div>
      {nodes && nodes.length > 0 ? (
        nodes.map((node) => {
          console.log(node.name) // Logging to the console
          return (
            <>
              <Text key={node.name} style={{ color: "white" }}>
                {node.name}
              </Text>
              <br />
            </>
          )
        })
      ) : (
        <Text>No nodes available</Text>
      )}
    </div>
  )
}

export default PlaygroundPage
