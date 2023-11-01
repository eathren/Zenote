import { useEffect, useState } from "react"
import { Button, Divider, Drawer, Modal, notification } from "antd"
import {
  EllipsisOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExportOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons"
import { GraphNode } from "src/types"
import { useNavigate, useParams } from "react-router-dom"
import { useNodes } from "src/hooks/useNodes"
import { deleteNodeInDB, updateNodeFavoriteStatus } from "src/handles/nodes"
import { fetchMarkdown } from "src/handles/markdown"

const NodeControls = () => {
  const { graphId, nodeId } = useParams()
  const [currentNode, setCurrentNode] = useState<GraphNode | undefined>(
    undefined
  )
  const { nodes } = useNodes(graphId)
  const navigate = useNavigate()

  useEffect(() => {
    if (!nodes) return
    const node = nodes.find((node) => node.id === nodeId)
    setCurrentNode(node)
  }, [nodeId, nodes])

  const [open, setOpen] = useState(false)
  if (!graphId || !nodeId) return <></>
  const showDeleteConfirm = (nodeId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Node?",
      content: "Once deleted, the Node cannot be recovered.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        await deleteNodeInDB(graphId, nodeId)
        navigate(`/graphs/${graphId}`)
      },
    })
  }

  const handleUpdateFavoriteStatus = async () => {
    if (!currentNode) return

    try {
      // Update the favorite status in the backend or state management system
      await updateNodeFavoriteStatus(graphId, nodeId)
    } catch (error) {
      // Handle any errors here
      console.error("Could not update favorite status", error)
    }
  }

  const fetchAndExportMarkdown = async (nodeId?: string) => {
    if (!nodeId) return
    if (!currentNode) return
    const md = await fetchMarkdown(nodeId)
    if (md) {
      const mdWithNodeTitle = `# ${currentNode.name}\n\n${md}`
      const blob = new Blob([mdWithNodeTitle], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentNode.name}_${nodeId}.md`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        notification.success({
          message: "Copied!",
          description: "Link copied to clipboard.",
          duration: 2,
        })
        console.log("Link copied to clipboard")
      },
      (err) => {
        console.error("Could not copy link", err)
      }
    )
  }

  return (
    <>
      <Drawer
        title="Node Controls"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={300}
        closeIcon={<CloseOutlined />}
      >
        <div style={{ textAlign: "left" }}>
          <Button
            type="text"
            icon={currentNode?.isFavorite ? <StarFilled /> : <StarOutlined />}
            onClick={() => handleUpdateFavoriteStatus()}
          >
            Favorite
          </Button>
          <Divider />

          <Button type="text" icon={<CopyOutlined />} onClick={copyLink}>
            Copy Link
          </Button>
          <Divider />
          <Button
            type="text"
            icon={<ExportOutlined />}
            onClick={() => fetchAndExportMarkdown(nodeId)}
          >
            Export
          </Button>
          <Divider />
        </div>
        <div style={{ flexGrow: 1 }}>
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
        </div>
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
