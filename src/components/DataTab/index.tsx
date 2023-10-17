import React, { useState } from "react"
import { Button, Typography, Space, Card, Divider } from "antd"
import { GraphNode } from "src/types"
import { useNavigate } from "react-router-dom"
import styles from "./index.module.css"
import AddEdgeModal from "../AddEdgeModal"
import { calculateIncomingAndOutgoingEdges } from "src/utils"
import EditEdgeModal from "../EditEdgeModal"
import { deleteNode, removeEdgeFromNode } from "src/handles/nodes"

type DataTabProps = {
  currentNode: GraphNode | null
  nodes: GraphNode[]
  graphId: string | undefined
  nodeId: string | undefined
  addEdgeToNode: (
    graphId: string,
    nodeId: string,
    targetNodeId: string
  ) => Promise<boolean>
}

const { Text } = Typography

const DataTab: React.FC<DataTabProps> = ({
  currentNode,
  nodes,
  graphId,
  nodeId,
  addEdgeToNode,
}) => {
  const navigate = useNavigate()
  const [isAddEdgeModalOpen, setIsAddEdgeModalOpen] = useState<boolean>(false)
  const [isEditEdgeModalOpen, setIsEditEdgeModalOpen] = useState<boolean>(false)
  const { incomingNodes, outgoingNodes } = calculateIncomingAndOutgoingEdges(
    nodeId,
    nodes
  )

  const openAddEdgeModal = () => {
    setIsAddEdgeModalOpen(true)
  }

  const closeAddEdgeModal = () => {
    setIsAddEdgeModalOpen(false)
  }

  const handleDeleteNode = async () => {
    if (!currentNode || !currentNode.id) return
    await deleteNode(currentNode.id)
    navigate(`/graphs/${graphId}`)
  }

  const openEditEdgeModal = () => {
    setIsEditEdgeModalOpen(true)
  }

  const closeEditEdgeModal = () => {
    setIsEditEdgeModalOpen(false)
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
          <Text strong>Incoming Edges: </Text>
          {incomingNodes.length > 0 ? (
            incomingNodes.map((edge: GraphNode, idx: number) => (
              <span key={edge.id}>
                <Text>
                  {edge.name || edge.id}
                  {incomingNodes.length > 1 &&
                    idx !== incomingNodes.length - 1 &&
                    ","}
                </Text>
              </span>
            ))
          ) : (
            <></>
          )}
          <Divider />
          <Text strong>Outgoing Edges: </Text>
          {outgoingNodes.length > 0 ? (
            outgoingNodes.map((edge: GraphNode, idx: number) => (
              <span key={edge.id}>
                <Text>
                  {edge.name || edge.id}{" "}
                  {incomingNodes.length > 1 &&
                    idx !== incomingNodes.length - 1 &&
                    ","}{" "}
                </Text>
              </span>
            ))
          ) : (
            <></>
          )}
        </Card>
        <Card title="Edge Actions" bordered={true}>
          <Button onClick={openAddEdgeModal}>Add Edge</Button>
          <Button onClick={openEditEdgeModal}>Edit Edges</Button>
          <EditEdgeModal
            isOpen={isEditEdgeModalOpen}
            onClose={closeEditEdgeModal}
            nodes={[...incomingNodes, ...outgoingNodes]}
            graphId={graphId}
            nodeId={nodeId}
            removeEdgeFromNode={removeEdgeFromNode}
          />
          <AddEdgeModal
            isOpen={isAddEdgeModalOpen}
            onClose={closeAddEdgeModal}
            nodes={nodes}
            graphId={graphId}
            nodeId={nodeId}
            addEdgeToNode={addEdgeToNode}
          />
        </Card>
        <Card title="Destructive Actions" bordered={true}>
          <Button danger onClick={handleDeleteNode}>
            Delete Node
          </Button>
        </Card>
      </Space>
    </div>
  )
}

export default DataTab
