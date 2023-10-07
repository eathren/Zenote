import { GraphNode } from "src/types"

export const findNodeId = (nodes: GraphNode[], name: string): string | null => {
  const node = nodes.find((node) => node.name === name)
  return node ? node.id : null
}
