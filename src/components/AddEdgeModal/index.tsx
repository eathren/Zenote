import React, { useState, useEffect } from "react"
import { Modal, Input, List, notification } from "antd"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"
import { batchUpdateNodeEdges } from "src/handles/edges"
import { useNodes } from "src/hooks/useNodes"
import { findNode } from "src/utils"

type AddEdgeModalProps = {
  isOpen: boolean
  onClose: () => void
  graphId: string | undefined
  nodeId: string | undefined
  onConfirm?: (result: any) => void
}

const AddEdgeModal: React.FC<AddEdgeModalProps> = ({
  isOpen,
  onClose,
  graphId,
  nodeId,
  onConfirm,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<GraphNode[]>([])
  const { searchTerm, handleSearchTermChange, filteredNodes } = useNodeModal({
    isOpen,
  })
  const { nodes } = useNodes(graphId)
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
    const returnObj = targetNodeIds.map((targetNodeId) => {
      return {
        targetNodeId: targetNodeId,
        name: findNode(nodes, targetNodeId)?.name,
      }
    })
    let message = ""

    try {
      // Attempt to add edges in a batch
      const result = await batchUpdateNodeEdges(
        graphId,
        nodeId,
        targetNodeIds,
        []
      )
      if (!result) {
        message = "Failed to add edges"
        notification.error({
          message: message,
          duration: 3,
        })
      } else {
        message = "Edges added successfully"
        notification.success({
          message: message,
          duration: 3,
        })
      }
    } catch (error) {
      console.error(error)
      message = "Error occurred"
      notification.error({
        message: message,
        duration: 3,
      })
    }
    console.log(returnObj)
    if (onConfirm) {
      onConfirm(returnObj)
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
      bodyStyle={{ height: "65vh", maxHeight: "65vh" }}
    >
      <Input
        placeholder="Search Node..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        onKeyDown={handleKeyDown}
      />
      <List
        dataSource={filteredNodes}
        style={{ height: "inherit", overflowY: "scroll" }}
        renderItem={(node) => (
          <List.Item
            onClick={() => toggleNodeSelection(node)}
            style={{
              cursor: "pointer",
              paddingLeft: "5px",
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
