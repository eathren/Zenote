import React, { useState, useEffect, useRef } from "react"
import { Modal, Input, List } from "antd"
import { useNavigate } from "react-router-dom"
import { addNode } from "src/handles"
import type { InputRef } from "antd"
import { GraphNode } from "src/types"

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
  const [nodeName, setNodeName] = useState<string>("")
  const [filteredNodes, setFilteredNodes] = useState<GraphNode[]>(nodes)
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(
    null
  )

  const navigate = useNavigate()
  const searchInputRef = useRef<InputRef | null>(null)

  useEffect(() => {
    let relevantNodes = nodes

    // Filter by graphId
    if (graphId) {
      relevantNodes = nodes.filter((node) => node.graphId === graphId)
    }

    // Search filter
    if (nodeName) {
      setFilteredNodes(
        relevantNodes.filter((node) =>
          node.name.toLowerCase().includes(nodeName.toLowerCase())
        )
      )
    } else {
      setFilteredNodes(relevantNodes)
    }
  }, [nodeName, nodes, graphId])
  const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value)
    setSelectedNodeIndex(null)
  }

  const confirmAddNode = async () => {
    if (graphId) {
      const id = await addNode(graphId, nodeName)
      onClose()
      navigate(`/graphs/${graphId}/node/${id}`)
      setNodeName("")
    }
  }

  const navigateToNode = (nodeId: string) => {
    if (graphId) {
      navigate(`/graphs/${graphId}/node/${nodeId}`)
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedNodeIndex((prevIndex) => {
        if (prevIndex === null || prevIndex >= filteredNodes.length - 1) {
          return 0
        }
        return prevIndex + 1
      })
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedNodeIndex((prevIndex) => {
        if (prevIndex === null || prevIndex <= 0) {
          return filteredNodes.length - 1
        }
        return prevIndex - 1
      })
    } else if (e.key === "Enter") {
      if (selectedNodeIndex !== null) {
        const selectedNode = filteredNodes[selectedNodeIndex]
        navigateToNode(selectedNode.id)
      } else {
        confirmAddNode()
      }
    }
  }

  useEffect(() => {
    if (searchInputRef.current && isOpen) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  return (
    <Modal
      title="Find or Add New Node"
      open={isOpen}
      onOk={confirmAddNode}
      onCancel={onClose}
      bodyStyle={{ height: "50vh" }}
    >
      <Input
        ref={searchInputRef}
        placeholder="Node Name..."
        value={nodeName}
        onChange={handleNodeNameChange}
        onKeyDown={handleKeyDown}
      />
      <List
        dataSource={filteredNodes}
        style={{ overflowY: "scroll", height: "inherit" }}
        renderItem={(node, index) => (
          <List.Item
            onClick={() => navigateToNode(node.id)}
            style={{
              cursor: "pointer",
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor:
                selectedNodeIndex === index ? "#3b3b3b" : "transparent",
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
