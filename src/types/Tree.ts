import { GraphNode } from "src/types/Graph"

export interface TreeNode extends GraphNode {
  children: TreeNode[]
  expanded: boolean
}
