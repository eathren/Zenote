import React from "react"
import { Modal, Input, List } from "antd"
import { useNavigate } from "react-router-dom"
import { addNode } from "src/handles"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"

type AddNodeModalProps = {
  isOpen: boolean
  onClose: () => void
  nodes: GraphNode[]
  graphId: string | undefined
}

const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  onClose,
  nodes,
  graphId,
}) => {
  const navigate = useNavigate()
  const { searchTerm, handleSearchTermChange, filteredNodes } = useNodeModal({
    isOpen,
    nodes,
  })

  const confirmAddNode = async () => {
    if (graphId) {
      const id = await addNode(graphId, searchTerm)
      onClose()
      navigate(`/graphs/${graphId}/node/${id}`)
    }
  }

  return (
    <Modal
      title="Find or Add New Node"
      open={isOpen}
      onOk={confirmAddNode}
      onCancel={onClose}
      bodyStyle={{ height: "50vh" }}
    >
      <Input
        placeholder="Node Name..."
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <List
        dataSource={filteredNodes}
        style={{ overflowY: "scroll", height: "inherit" }}
        renderItem={(node) => (
          <List.Item
            onClick={() => navigate(`/graphs/${graphId}/node/${node.id}`)}
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
