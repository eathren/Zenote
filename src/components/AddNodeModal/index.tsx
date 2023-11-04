import React, { useEffect, useRef } from "react"
import { Modal, Input, List, InputRef } from "antd"
import { useNavigate } from "react-router-dom"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"
import { addNode } from "src/handles/nodes"

type AddNodeModalProps = {
  isOpen: boolean
  onClose: () => void
  graphId: string | undefined
}

const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  onClose,
  graphId,
}) => {
  const navigate = useNavigate()
  const { searchTerm, handleSearchTermChange, filteredNodes, resetSearchTerm } =
    useNodeModal({
      isOpen,
    })

  // Function to add new node
  const confirmAddNode = async () => {
    if (graphId && searchTerm.trim() !== "") {
      const nodeNames = searchTerm.split(",") // Split the search term by spaces
      const nodeIds = await addNode(graphId, nodeNames) // Pass the array of node names

      resetSearchTerm()
      onClose()
      // Navigate to the last created node. Alternatively, you can handle navigation differently
      if (nodeIds && nodeIds?.length === 1) {
        navigate(`/graphs/${graphId}/node/${nodeIds[0]}`)
      }
    }
  }

  // Function to navigate to existing node
  const confirmClickNode = (node: GraphNode) => {
    if (graphId) {
      onClose()
      resetSearchTerm()
      navigate(`/graphs/${graphId}/node/${node.id}`)
    }
  }

  // Function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirmAddNode()
    }
  }

  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  return (
    <Modal
      title="Find or Add New Node"
      open={isOpen}
      onOk={confirmAddNode}
      onCancel={onClose}
      bodyStyle={{ height: "65vh", maxHeight: "65vh" }}
    >
      <Input
        ref={inputRef}
        placeholder="Node Name..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <List
        dataSource={filteredNodes}
        style={{ overflowY: "scroll", height: "inherit" }}
        renderItem={(node) => (
          <List.Item
            onClick={() => confirmClickNode(node)}
            style={{
              cursor: "pointer",
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor: "transparent",
            }}
          >
            {node.name}
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default AddNodeModal
