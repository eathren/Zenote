import { GraphNode } from "src/types"
import { useGraphData } from "./useGraphData"

export const useNodes = (graphId: string | undefined) => {
  return useGraphData<GraphNode>("nodes", graphId)
}
