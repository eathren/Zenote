export type GraphElement = GraphNode | GraphEdge

export type GraphNodeObj = Record<string, GraphNode>
export type GraphEdgeObj = Record<string, GraphEdge>

export interface GraphNode {
  // Required Properties
  id: string
  content: string
  date_created: number
  date_modified?: number
  // Optional Properties
  expanded?: boolean
  completed?: false
}

export type GraphEdge = {
  id: string
  src: string
  dest: string
  label?: string
}
