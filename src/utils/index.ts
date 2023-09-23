import { GraphEdgeObj, GraphNodeObj } from "src/types/Graph"

export const findNodeById = (nodes: GraphNodeObj, id: string) => nodes[id]
export const findEdgeById = (edges: GraphEdgeObj, id: string) => edges[id]
