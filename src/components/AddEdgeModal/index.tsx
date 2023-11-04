import React, { useState, useEffect } from "react"
import { Modal, Input, List } from "antd"
import { GraphNode } from "src/types"
import { useNodeModal } from "src/hooks/useNodeModal"
import { batchUpdateNodeEdges } from "src/handles/edges"
import { useNodes } from "src/hooks/useNodes"
import { findNode } from "src/utils"
import { addNodeAndReturn } from "src/handles/nodes"

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
  const { searchTerm, handleSearchTermChange, filteredNodes, resetSearchTerm } =
    useNodeModal({
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

  const confirmCreateEdgesAndNodes = async () => {
    if (!graphId || !nodeId) return

    // Split the searchTerm into individual names, trimming whitespace.
    const potentialNewNodeNames = searchTerm
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name) // Ensure no empty names

    // Determine which of the entered names do not match existing nodes.
    const nodesToCreate = potentialNewNodeNames.filter(
      (name) => !nodes.some((node) => node.name === name)
    )

    // IDs of existing nodes that were selected.
    const existingSelectedNodeIds = selectedNodes.map((node) => node.id)

    // Create the nodes and then create the edges.
    const createNodesAndEdges = async () => {
      let newNodes: GraphNode[] = []

      if (nodesToCreate.length > 0) {
        // Attempt to create the new nodes and capture the new node objects.
        newNodes = (await addNodeAndReturn(graphId, nodesToCreate)) || []
      }

      // Extract the IDs from the new node objects.
      const newNodesIds = newNodes.map((node) => node.id)

      // Combine the IDs of the newly created nodes with the existing selected nodes.
      const allTargetNodeIds = [...existingSelectedNodeIds, ...newNodesIds]

      // Now create the edges.
      await createEdges(allTargetNodeIds, newNodes)
    }

    // If there are new nodes to be created, show a confirmation dialog.
    if (nodesToCreate.length > 0) {
      Modal.confirm({
        title: "Confirm Node Creation",
        content: `You are about to create new node(s): ${nodesToCreate.join(
          ", "
        )}. Continue?`,
        onOk: createNodesAndEdges,
      })
    } else {
      // If no new nodes are being created, just create the edges.
      await createEdges(existingSelectedNodeIds, [])
    }
  }

  const createEdges = async (
    targetNodeIds: string[],
    newNodes: GraphNode[]
  ) => {
    console.log("Creating edges with node IDs: ", targetNodeIds)
    if (!graphId || !nodeId) return

    // Proceed with creating edges between the current node and the target node IDs.
    await batchUpdateNodeEdges(graphId, nodeId, targetNodeIds, [])
    resetSearchTerm()

    // Map the new nodes to their names, assuming that new nodes are not yet in the nodes state.

    const newNodesMap: { [key: string]: string } = {}
    for (const node of newNodes) {
      newNodesMap[node.id] = node.name
    }

    // Prepare the return object with node IDs and names.
    const returnObj = targetNodeIds.map((targetNodeId: string) => {
      // Use the name from the new nodes map if the node is new, otherwise find it in the existing nodes.
      return {
        targetNodeId,
        name: newNodesMap[targetNodeId] || findNode(nodes, targetNodeId)?.name,
      }
    })

    console.log("returnObj", returnObj)

    // If there is a callback function provided, call it with the return object.
    if (onConfirm) {
      onConfirm(returnObj)
    }

    // Close the modal.
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirmCreateEdgesAndNodes()
    }
  }
  return (
    <Modal
      title="Select Nodes to Create Edge(s)"
      open={isOpen}
      onOk={confirmCreateEdgesAndNodes}
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
