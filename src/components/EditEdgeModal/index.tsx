import React, { useState, useEffect } from "react"
import { Modal, Input, List, notification } from "antd"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"
import { removeEdgesFromNodeBatch } from "src/handles/nodes"
import { useParams } from "react-router-dom"

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
  nodeId,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<GraphNode[]>([])
  const { searchTerm, handleSearchTermChange, filteredNodes } = useNodeModal({
    isOpen,
  })

  const graphId = useParams<{ graphId: string }>().graphId
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
      await removeEdgesFromNodeBatch(graphId, nodeId, targetNodeIds) // Call your new batch deletion function
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
