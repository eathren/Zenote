import React, { useState } from "react"
import { Modal, Input, notification } from "antd"
import { addNode } from "src/handles"
import { isNodeNameUnique } from "src/utils"

type AddNodeModalProps = {
  isOpen: boolean
  onClose: () => void
  nodes: any // Replace 'any' with the correct type
  graphId: string | undefined
}

const AddNodeModal = ({
  isOpen,
  onClose,
  nodes,
  graphId,
}: AddNodeModalProps) => {
  const [nodeName, setNodeName] = useState("")

  const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value)
  }

  const confirmAddNode = () => {
    const unique = isNodeNameUnique(nodes, nodeName, graphId)
    if (unique) {
      if (graphId) addNode(graphId, nodeName)
      onClose()
      setNodeName("")
    } else {
      notification.error({
        message: "Node Name Error",
        description:
          "This node name already exists. Please choose another name.",
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmAddNode()
    }
  }

  return (
    <Modal
      title="Add a new node"
      open={isOpen}
      onOk={confirmAddNode}
      onCancel={onClose}
    >
      <Input
        placeholder="Node Name..."
        value={nodeName}
        onChange={handleNodeNameChange}
        onKeyDown={handleKeyDown}
      />
    </Modal>
  )
}

export default AddNodeModal
