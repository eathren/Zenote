import { GraphNode, InitialGraphNode } from "src/types/GraphNode"

/**
 * Function to create a graph based on an array of initial graph nodes.
 * @param data - Array of initial graph nodes.
 * @returns Array of root graph nodes populated with their child nodes.
 */
export const createGraph = (data: InitialGraphNode[]): GraphNode[] => {
  const graph: GraphNode[] = []
  const nodeMap: { [id: string]: GraphNode } = {} // Map to quickly find nodes based on their ID

  // Create root nodes and populate nodeMap
  for (const item of data) {
    if (!item.parent) {
      const newNode: GraphNode = { ...item, children: [] }
      graph.push(newNode)
      nodeMap[item.id] = newNode
    }
  }

  // Create a map from parent ID to child nodes to eliminate repetitive array iterations
  const parentChildMap: { [id: string]: InitialGraphNode[] } = {}
  for (const item of data) {
    if (item.parent) {
      if (!parentChildMap[item.parent]) {
        parentChildMap[item.parent] = []
      }
      parentChildMap[item.parent].push(item)
    }
  }

  // Recursive function to add child nodes
  const addChildNodes = (node: GraphNode) => {
    const children = parentChildMap[node.id]
    if (children) {
      for (const child of children) {
        const childNode: GraphNode = { ...child, children: [] }
        node.children.push(childNode)
        nodeMap[child.id] = childNode
        addChildNodes(childNode)
      }
    }
  }

  // Populate child nodes for each root node
  for (const rootNode of graph) {
    addChildNodes(rootNode)
  }

  return graph
}

/**
 * Utility function to find a node by its ID in a graph structure.
 * @param id - The ID of the node to find.
 * @param graph - Array of root graph nodes to search through.
 * @returns The found node or undefined.
 */
export const findNodeById = (
  id: string,
  graph: GraphNode[]
): GraphNode | undefined => {
  // Helper function to search recursively through the graph
  const search = (node: GraphNode): GraphNode | undefined => {
    if (node.id === id) {
      return node
    }

    for (const child of node.children) {
      const result = search(child)
      if (result) {
        return result
      }
    }
    return undefined
  }

  for (const rootNode of graph) {
    const result = search(rootNode)
    if (result) {
      return result
    }
  }

  return undefined
}

/**
 * Utility function to find nodes by their parent ID in a graph structure.
 * @param parentId - The parent ID to find child nodes for.
 * @param graph - Array of root graph nodes to search through.
 * @returns Array of child nodes or undefined.
 */
export const findNodesByParentId = (
  parentId: string,
  graph: GraphNode[]
): GraphNode[] | undefined => {
  // Helper function to search recursively through the graph
  const search = (node: GraphNode, childrenList: GraphNode[]): void => {
    if (node.id === parentId) {
      childrenList.push(...node.children)
    }

    for (const child of node.children) {
      search(child, childrenList)
    }
  }

  const children: GraphNode[] = []
  for (const rootNode of graph) {
    search(rootNode, children)
  }

  return children.length > 0 ? children : undefined
}
