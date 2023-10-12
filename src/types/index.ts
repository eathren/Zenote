import * as d3 from "d3"

export interface Graph {
  id: string
  name: string
  date_created: number
}

export interface GraphNode extends d3.SimulationNodeDatum {
  // Required Properties
  id: string
  name: string
  graphId: string
  markdownUrl?: string
  tags?: string[]
}

export interface GraphEdge extends d3.SimulationLinkDatum<GraphNode> {
  id: string
  label?: string
  source: string | GraphNode
  target: string | GraphNode
}

export interface GraphData {
  id: string
  name: string
  date_created: number
  nodes: GraphNode[]
  edges: GraphEdge[]
}
