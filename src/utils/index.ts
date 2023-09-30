import { GraphEdgeObj, GraphNodeObj } from "src/types/Graph"

import { TreeNode } from "src/types/Tree"

export const findNodeById = (nodes: GraphNodeObj, id: string) => nodes[id]
export const findEdgeById = (edges: GraphEdgeObj, id: string) => edges[id]

export const createTree = (nodes: GraphNodeObj, edges: GraphEdgeObj) => {
  const seenNodes = new Set<string>()
  const tree: TreeNode[] = []

  // Pre-filter edges
  const edgeMap: { [src: string]: string[] } = {}
  Object.values(edges).forEach((edge) => {
    if (!edgeMap[edge.src]) {
      edgeMap[edge.src] = []
    }
    edgeMap[edge.src].push(edge.dest)
  })

  const findChildren = (
    nodeId: string,
    nodes: GraphNodeObj,
    edgeMap: { [src: string]: string[] },
    seenNodes: Set<string>
  ): TreeNode[] => {
    const children: TreeNode[] = []
    const childIds = edgeMap[nodeId] || []
    childIds.forEach((childId) => {
      const child = findNodeById(nodes, childId)
      if (child && child.id && !seenNodes.has(child.id)) {
        seenNodes.add(child.id)
        children.push({
          ...child,
          expanded: true,
          children: findChildren(child.id, nodes, edgeMap, seenNodes),
        })
      }
    })

    return children
  }

  Object.keys(nodes).forEach((nodeId) => {
    if (seenNodes.has(nodeId)) return

    const node = nodes[nodeId]
    const children = findChildren(nodeId, nodes, edgeMap, seenNodes)
    tree.push({
      ...node,
      expanded: true,
      children,
    })
  })

  // Sort the root level nodes as well
  tree.sort(
    (a, b) =>
      new Date(a.date_created).getTime() - new Date(b.date_created).getTime()
  )

  return tree
}

export const findSubtreeById = (
  id: string,
  tree: TreeNode[]
): TreeNode | null => {
  for (const node of tree) {
    if (node.id === id) {
      return node
    }

    const childResult = findSubtreeById(id, node.children)
    if (childResult) {
      return childResult
    }
  }

  return null
}
