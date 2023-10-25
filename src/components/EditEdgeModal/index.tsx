import React, { useState, useEffect } from "react"
import { Modal, Input, List, notification } from "antd"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"
import { removeEdgesFromNodeBatch } from "src/handles/nodes"

type EditEdgeModalProps = {
  isOpen: boolean
  onClose: () => void
  nodes: GraphNode[]
  graphId: string | undefined
  nodeId: string | undefined
}

const EditEdgeModal: React.FC<EditEdgeModalProps> = ({
  isOpen,
  onClose,
  graphId,
  nodeId,
  nodes,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<GraphNode[]>([])
  const { searchTerm, handleSearchTermChange, filteredNodes } = useNodeModal({
    isOpen,
  })

  // Assuming findNode function returns a node by its ID from the nodes array
  const currentNode = nodes?.find((node) => node.id === nodeId)
  const existingEdges = currentNode?.edges || []

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

    const targetNodeIds = selectedNodes.map((targetNode) => targetNode.id!)

    try {
      if (!graphId) return
      await removeEdgesFromNodeBatch(graphId, nodeId, targetNodeIds)
      notification.success({
        message: "Edges Deleted Successfully",
        duration: 3,
      })
    } catch (error) {
      console.error(error)
      notification.error({
        message: `Failed to Delete Edges`,
        duration: 3,
      })
    }

    onClose()
  }

  const existingEdgeNodeIds = existingEdges.map((edge) => edge.target as string)

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
        dataSource={filteredNodes.filter((node) =>
          existingEdgeNodeIds.includes(node.id!)
        )}
        renderItem={(node) => (
          <List.Item
            onClick={() => toggleNodeSelection(node)}
            style={{
              cursor: "pointer",
              backgroundColor: selectedNodes.includes(node)
                ? "#f5222d"
                : existingEdgeNodeIds.includes(node.id!)
                ? "#d9d9d9"
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
