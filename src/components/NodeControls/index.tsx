import { useEffect, useState } from "react"
import { Button, Divider, Drawer, Modal } from "antd"
import {
  EllipsisOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileWordOutlined,
  LinkOutlined,
  StarOutlined,
} from "@ant-design/icons"
import { GraphNode } from "src/types"
import { useNavigate, useParams } from "react-router-dom"
import { useNodes } from "src/hooks/useNodes"
import { calculateIncomingAndOutgoingEdges } from "src/utils"
import { deleteNode } from "src/handles/nodes"
import AddEdgeModal from "../AddEdgeModal"
import EditEdgeModal from "../EditEdgeModal"

const NodeControls = () => {
  const { graphId, nodeId } = useParams()
  const [currentNode, setCurrentNode] = useState<GraphNode | undefined>(
    undefined
  )

  const { nodes } = useNodes(graphId)

  useEffect(() => {
    if (!nodes) return
    const node = nodes.find((node) => node.id === nodeId)
    setCurrentNode(node)
  }, [nodeId, nodes])

  const { incomingNodes, outgoingNodes } = calculateIncomingAndOutgoingEdges(
    nodeId,
    nodes
  )

  const [open, setOpen] = useState(false)
  const [isAddEdgeModalOpen, setIsAddEdgeModalOpen] = useState<boolean>(false)
  const [isEditEdgeModalOpen, setIsEditEdgeModalOpen] = useState<boolean>(false)

  const showDeleteConfirm = (nodeId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this graph?",
      content: "Once deleted, the graph cannot be recovered.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteNode(nodeId)
        navigate(`/graphs/${graphId}`)
      },
    })
  }

  const openAddEdgeModal = () => {
    setIsAddEdgeModalOpen(true)
  }

  const closeAddEdgeModal = () => {
    setIsAddEdgeModalOpen(false)
  }

  const closeEditEdgeModal = () => {
    setIsEditEdgeModalOpen(false)
  }

  const navigate = useNavigate()

  return (
    <>
      <Drawer
        title="Node Controls"
        placement="right"
        onClose={() => setOpen(false)}
        visible={open}
        width={300}
        closeIcon={<CloseOutlined />}
      >
        <div style={{ textAlign: "left" }}>
          <Button type="text" icon={<StarOutlined />}>
            Favorite
          </Button>
          <Divider />

          <Button type="text" icon={<CopyOutlined />}>
            Copy Link
          </Button>
          <Divider />
          <Button type="text" icon={<ExportOutlined />}>
            Export
          </Button>
          <Divider />
          <Button
            type="text"
            icon={<LinkOutlined />}
            onClick={openAddEdgeModal}
          >
            Add Connections
          </Button>
          <Divider />
          <Button type="text" icon={<FileWordOutlined />}>
            Word Count
          </Button>
          <Divider />

          <EditEdgeModal
            isOpen={isEditEdgeModalOpen}
            onClose={closeEditEdgeModal}
            nodes={[...incomingNodes, ...outgoingNodes]}
            graphId={graphId}
            nodeId={nodeId}
          />
          <AddEdgeModal
            isOpen={isAddEdgeModalOpen}
            onClose={closeAddEdgeModal}
            graphId={graphId}
            nodeId={nodeId}
          />
        </div>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            if (currentNode && currentNode.id) {
              showDeleteConfirm(currentNode.id)
            }
          }}
        >
          Delete Node
        </Button>
        <Divider />
      </Drawer>
      <Button
        type="text"
        icon={<EllipsisOutlined />}
        onClick={() => setOpen(true)}
      />
    </>
  )
}

export default NodeControls
