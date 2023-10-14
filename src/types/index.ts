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
  date_created: number

  // Optional Properties
  markdownUrl?: string
  tags?: string[]
  groups?: string[]
  edges: GraphEdge[]
}

export interface GraphEdge extends d3.SimulationLinkDatum<GraphNode> {
  id: string
  graphId: string
  date_created: number
  label?: string
  // source and target are already included in d3.SimulationLinkDatum
}
