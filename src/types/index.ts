export type GraphElement = GraphNode | GraphEdge;

export type GraphNodeObj = Record<string, GraphNode>;
export type GraphEdgeObj = Record<string, GraphEdge>;

export interface Graph {
  id?: string;
  name: string;
  date_created: number;
}

export interface GraphObj {
  id: string;
  data: Graph;
}

export interface GraphNode extends d3.SimulationNodeDatum {
  // Required Properties
  id: string;
  name: string;
  graphId: string;
}

export interface GraphEdge extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  label?: string;
}
