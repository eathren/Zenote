import React, { useState, useEffect } from "react"
import { Modal, Input, List, notification } from "antd"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"

type AddEdgeModalProps = {
  isOpen: boolean
  onClose: () => void
  nodes: GraphNode[]
  graphId: string | undefined
  nodeId: string | undefined
  addEdgeToNode: (
    graphId: string,
    nodeId: string,
    targetNodeId: string
  ) => Promise<void>
}

const AddEdgeModal: React.FC<AddEdgeModalProps> = ({
  isOpen,
  onClose,
  nodes,
  graphId,
  nodeId,
  addEdgeToNode,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<GraphNode[]>([])
  const { searchTerm, handleSearchTermChange, filteredNodes } = useNodeModal({
    isOpen,
    nodes,
  })

  useEffect(() => {
    setSelectedNodes([])
  }, [isOpen])

  const toggleNodeSelection = (node: GraphNode) => {
    setSelectedNodes((prevSelectedNodes) =>
      prevSelectedNodes.includes(node)
        ? prevSelectedNodes.filter((n) => n !== node)
        : [...prevSelectedNodes, node]
    )
  }

  const confirmCreateEdges = async () => {
    if (!graphId || !nodeId) return

    const edgeCreationPromises = selectedNodes.map((targetNode) =>
      addEdgeToNode(graphId, nodeId, targetNode.id).catch((error) => {
        console.error(error)
        notification.error({
          message: `Failed to Add Edge to ${targetNode.name}`,
          duration: 3,
        })
      })
    )

    await Promise.all(edgeCreationPromises)
    notification.success({
      message: "Edges Added Successfully",
      duration: 3,
    })
    onClose()
  }

  return (
    <Modal
      title="Select Nodes to Create Edge(s)"
      open={isOpen}
      onOk={confirmCreateEdges}
      onCancel={onClose}
    >
      <Input
        placeholder="Search Node..."
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <List
        dataSource={filteredNodes}
        renderItem={(node) => (
          <List.Item
            onClick={() => toggleNodeSelection(node)}
            style={{
              cursor: "pointer",
              backgroundColor: selectedNodes.includes(node)
                ? "red"
                : "transparent",
            }}
          >
            {node.name}
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default AddEdgeModal
