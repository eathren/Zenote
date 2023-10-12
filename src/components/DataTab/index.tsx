import { useState } from "react"
import { Input, Button, Typography, notification } from "antd" // Import Typography and notification from Ant Design
import { GraphNode } from "src/types" // Assuming you have a GraphNode type definition

type DataTabProps = {
  currentNode: GraphNode | null
  nodes: GraphNode[]
  graphId: string | undefined
  nodeId: string | undefined
  addEdgeToNode: (
    graphId: string,
    nodeId: string,
    targetNodeId: string
  ) => Promise<void>
}

const { Text } = Typography

const DataTab = ({
  currentNode,
  nodes,
  graphId,
  nodeId,
  addEdgeToNode,
}: DataTabProps) => {
  const [nodeNameInput, setNodeNameInput] = useState<string>("")

  // Notification function for edge add success
  const showSuccessNotification = () => {
    notification.success({
      message: "Edge Added Successfully",
      duration: 3,
    })
    setNodeNameInput("") // Clear the input field on success
  }

  // Notification function for edge add failure
  const showErrorNotification = () => {
    notification.error({
      message: "Failed to Add Edge",
      duration: 3,
    })
  }

  const handleAddEdge = async () => {
    // Fetch the target node's ID based on its name
    const targetNode = nodes.find(
      (node: GraphNode) => node.name === nodeNameInput
    )
    if (targetNode && nodeId && graphId) {
      try {
        // Create an edge between the current node and the target node
        await addEdgeToNode(graphId, nodeId, targetNode.id)
        showSuccessNotification() // Show success notification
      } catch (error) {
        console.error(error)
        showErrorNotification() // Show error notification on failure
      }
    }
  }

  return (
    <div>
      {currentNode && (
        <div>
          <Text strong>Node Title:</Text> <Text>{currentNode.name}</Text>
          <br />
          <Text strong>Node ID:</Text> <Text>{currentNode.id}</Text>
          <br />
          <Text strong>Edges:</Text>{" "}
          {Array.isArray(currentNode.edges) ? (
            currentNode.edges.map((edge) => (
              <Text key={edge.id}>{edge.id}, </Text>
            ))
          ) : (
            <Text>No Edges</Text>
          )}
          <br />
          <Input
            placeholder="Enter Node Name"
            value={nodeNameInput}
            onChange={(e) => setNodeNameInput(e.target.value)}
          />
          <Button onClick={handleAddEdge}>Create Edge</Button>
        </div>
      )}
    </div>
  )
}

export default DataTab
