import React, { useState, useEffect } from "react"
import { Modal, Input, List, notification } from "antd"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"

type EditEdgeModalProps = {
  isOpen: boolean
  onClose: () => void
  nodes: GraphNode[]
  graphId: string | undefined
  nodeId: string | undefined
  removeEdgeFromNode: (nodeId: string, targetNodeId: string) => Promise<void>
}

const EditEdgeModal: React.FC<EditEdgeModalProps> = ({
  isOpen,
  onClose,
  nodes,
  nodeId,
  removeEdgeFromNode,
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

  const confirmDeleteEdges = async () => {
    if (!nodeId) return

    const edgeDeletionPromises = selectedNodes.map((targetNode) =>
      removeEdgeFromNode(nodeId, targetNode.id).catch((error) => {
        console.error(error)
        notification.error({
          message: `Failed to Delete Edge to ${targetNode.name}`,
          duration: 3,
        })
      })
    )

    await Promise.all(edgeDeletionPromises)
    notification.success({
      message: "Edges Deleted Successfully",
      duration: 3,
    })
    onClose()
  }

  return (
    <Modal
      title="Select Nodes to Delete Edge(s)"
      open={isOpen}
      onOk={confirmDeleteEdges}
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
                ? "#f5222d"
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

export default EditEdgeModal
