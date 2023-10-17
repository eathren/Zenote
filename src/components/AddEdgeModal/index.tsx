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
  ) => Promise<boolean>
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

    // Create an array of promises for adding edges
    const edgeCreationPromises = selectedNodes.map((targetNode) => {
      return addEdgeToNode(graphId, nodeId, targetNode.id!).catch((error) => {
        console.error(error)
        notification.error({
          message: `Failed to Add Edge to ${targetNode.name}`,
          duration: 3,
        })
      })
    })

    // Wait for all edge creation promises to complete
    await Promise.all(edgeCreationPromises)

    notification.success({
      message: "Edges Added Successfully",
      duration: 3,
    })

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
