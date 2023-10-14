import React, { useState } from "react"
import {
  Input,
  Button,
  Typography,
  notification,
  Space,
  Card,
  Divider,
} from "antd"
import { GraphNode } from "src/types"
import { deleteNode } from "src/handles"
import { useNavigate } from "react-router-dom"
import styles from "./index.module.css"

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

const DataTab: React.FC<DataTabProps> = ({
  currentNode,
  nodes,
  graphId,
  nodeId,
  addEdgeToNode,
}) => {
  const [nodeNameInput, setNodeNameInput] = useState<string>("")
  const navigate = useNavigate()

  const showSuccessNotification = () => {
    notification.success({
      message: "Edge Added Successfully",
      duration: 3,
    })
    setNodeNameInput("")
  }

  const showErrorNotification = () => {
    notification.error({
      message: "Failed to Add Edge",
      duration: 3,
    })
  }

  const handleDeleteNode = async () => {
    if (!currentNode) return
    deleteNode(currentNode.id).then(() => {
      navigate(`/graph/${graphId}`)
    })
  }

  const handleAddEdge = async () => {
    const targetNode = nodes.find((node) => node.name === nodeNameInput)
    if (targetNode && nodeId && graphId) {
      try {
        await addEdgeToNode(graphId, nodeId, targetNode.id)
        showSuccessNotification()
      } catch (error) {
        console.error(error)
        showErrorNotification()
      }
    }
  }

  if (!currentNode) return <></>

  return (
    <div className={styles.data__tab__container}>
      <Space direction="vertical" size="large">
        <Card title="Node Details" bordered={true}>
          <Text strong>Node Title: </Text>
          <Text>{currentNode.name}</Text>
          <Divider />
          <Text strong>Node ID: </Text>
          <Text>{currentNode.id}</Text>
          <Divider />
          <Text strong>Edges: </Text>
          {Array.isArray(currentNode.edges) ? (
            currentNode.edges.map((edge) => (
              <Text key={edge.id}>{edge.id}, </Text>
            ))
          ) : (
            <Text>No Edges</Text>
          )}
        </Card>
        <Card title="Node Actions" bordered={true}>
          <Input
            placeholder="Enter Node Name"
            value={nodeNameInput}
            onChange={(e) => setNodeNameInput(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleAddEdge}
            style={{ margin: "10px 0" }}
          >
            Create Edge
          </Button>
          <Button danger onClick={handleDeleteNode}>
            Delete Node
          </Button>
        </Card>
      </Space>
    </div>
  )
}

export default DataTab
