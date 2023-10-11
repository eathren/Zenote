import { GraphEdge } from "src/types"
import { useGraphData } from "./useGraphData"

export const useEdges = (graphId: string | undefined) => {
  return useGraphData<GraphEdge>("edges", graphId)
}
