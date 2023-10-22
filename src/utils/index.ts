import { notification } from "antd"
import { GraphNode } from "src/types"

export const findNodeId = (nodes: GraphNode[], name: string): string | null => {
  const node = nodes.find((node) => node.name === name)
  return node ? node.id! : null
}

export const findNode = (nodes: GraphNode[], id: string) => {
  return nodes.find((node) => node.id === id)
}
/**
 * Check if a node name is unique within a specific graph.
 *
 * @param nodes - Array of existing GraphNodes in the graph.
 * @param newName - The new name to check for uniqueness.
 * @returns A boolean value indicating whether the new name is unique.
 */
export const isNodeNameUnique = (
  nodes: GraphNode[],
  newName: string,
  graphId?: string
): boolean => {
  return !nodes.some(
    (node) => node.name === newName && node.graphId === graphId
  )
}

/**
 * Generate a unique node name based on a proposed name.
 * This function appends a number to the name to make it unique.
 *
 * @param nodes - Array of existing GraphNodes in the graph.
 * @param baseName - The base name for the new node.
 * @returns A unique node name.
 */
export const generateUniqueNodeName = (
  nodes: GraphNode[],
  baseName: string
): string => {
  let uniqueName = baseName
  let counter = 1

  while (!isNodeNameUnique(nodes, uniqueName)) {
    uniqueName = `${baseName}-${counter}`
    counter++
  }

  return uniqueName
}

export const openNotification = (
  type: "success" | "error",
  message: string,
  description: string
) => {
  notification[type]({
    message: message,
    description: description,
  })
}

export const calculateIncomingAndOutgoingEdges = (
  nodeId: string | undefined,
  allNodes: GraphNode[]
): { incomingNodes: GraphNode[]; outgoingNodes: GraphNode[] } => {
  if (!nodeId) return { incomingNodes: [], outgoingNodes: [] }

  // Using Set to ensure uniqueness
  const incomingNodeSet: Set<GraphNode> = new Set()
  const outgoingNodeSet: Set<GraphNode> = new Set()

  allNodes.forEach((node) => {
    node?.edges?.forEach((edge) => {
      if (edge.source === nodeId) {
        const targetNode = findNode(allNodes, edge.target as string)
        if (targetNode) outgoingNodeSet.add(targetNode)
      }
      if (edge.target === nodeId) {
        const sourceNode = findNode(allNodes, edge.source as string)
        if (sourceNode) incomingNodeSet.add(sourceNode)
      }
    })
  })

  // Convert Set back to Array
  const incomingNodes = Array.from(incomingNodeSet)
  const outgoingNodes = Array.from(outgoingNodeSet)

  return { incomingNodes, outgoingNodes }
}
