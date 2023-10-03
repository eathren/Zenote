export type GraphElement = GraphNode | GraphEdge

export type GraphNodeObj = Record<string, GraphNode>
export type GraphEdgeObj = Record<string, GraphEdge>

export interface Graph {
  id?: string
  name: string
  date_created: number
}

export interface GraphObj extends Graph {
  id: string
  data: Graph
}

export interface GraphNode {
  // Required Properties
  id: string
  name: string
  graphId: string
  date_created: number
  date_modified?: number
}

export type GraphEdge = {
  id: string
  src: string
  dest: string
  label?: string
}
