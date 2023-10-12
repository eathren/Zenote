import { useState } from "react"
import { Input, Button, Typography } from "antd" // Import Typography from Ant Design
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

const DataTab = ({
  currentNode,
  nodes,
  graphId,
  nodeId,
  addEdgeToNode,
}: DataTabProps) => {
  const [nodeNameInput, setNodeNameInput] = useState<string>("")

  const handleAddEdge = async () => {
    // Fetch the target node's ID based on its name
    const targetNode = nodes.find(
      (node: GraphNode) => node.name === nodeNameInput
    )
    if (targetNode && nodeId && graphId) {
      // Create an edge between the current node and the target node
      await addEdgeToNode(graphId, nodeId, targetNode.id)
    }
  }

  return (
    <div>
      {/* Here you can display the loaded node details if it exists */}
      {currentNode && (
        <div>
          {/* Display node details here */}
          <Typography>Node Title:</Typography>{" "}
          <Typography>{currentNode.name}</Typography>
          <br />
          <Typography>Node ID:</Typography>{" "}
          <Typography>{currentNode.id}</Typography>
          <br />
          <Typography>Edges:</Typography>{" "}
          {Array.isArray(currentNode.edges) ? (
            currentNode.edges.map((edge) => (
              <Typography key={edge.id}>{edge.id}, </Typography>
            ))
          ) : (
            <Typography>No Edges</Typography>
          )}
          <br />
          {/* Add an input field for entering node name */}
          <Input
            placeholder="Enter Node Name"
            value={nodeNameInput}
            onChange={(e) => setNodeNameInput(e.target.value)}
          />
          {/* Add a button to create an edge */}
          <Button onClick={handleAddEdge}>Create Edge</Button>
        </div>
      )}
    </div>
  )
}

export default DataTab
