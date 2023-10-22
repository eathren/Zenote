import React, { useState, useEffect } from "react"
import { Modal, Input, List, notification } from "antd"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"
import { addEdgesToNodeBatch } from "src/handles/edges"

type AddEdgeModalProps = {
  isOpen: boolean
  onClose: () => void
  graphId: string | undefined
  nodeId: string | undefined
}

const AddEdgeModal: React.FC<AddEdgeModalProps> = ({
  isOpen,
  onClose,
  graphId,
  nodeId,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<GraphNode[]>([])
  const { searchTerm, handleSearchTermChange, filteredNodes } = useNodeModal({
    isOpen,
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

    // Collect all target node IDs into an array
    const targetNodeIds = selectedNodes.map((targetNode) => targetNode.id!)

    try {
      // Attempt to add edges in a batch
      const result = await addEdgesToNodeBatch(graphId, nodeId, targetNodeIds)
      if (!result) {
        notification.error({
          message: `Failed to Add Edges`,
          duration: 3,
        })
      } else {
        notification.success({
          message: "Edges Added Successfully",
          duration: 3,
        })
      }
    } catch (error) {
      console.error(error)
      notification.error({
        message: `Failed to Add Edges`,
        duration: 3,
      })
    }

    onClose()
  }

  // Function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirmCreateEdges()
    }
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
        onKeyDown={handleKeyDown}
      />
      <List
        dataSource={filteredNodes}
        renderItem={(node) => (
          <List.Item
            onClick={() => toggleNodeSelection(node)}
            style={{
              cursor: "pointer",
              backgroundColor: selectedNodes.includes(node)
                ? "grey"
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
