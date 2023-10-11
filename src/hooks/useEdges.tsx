import { GraphEdge } from "src/types"
import { useGraphData } from "./useGraphData"

export const useEdges = (graphId: string | undefined) => {
  return useGraphData<GraphEdge>("edges", graphId)
}

// export const useEdges = (graphId: string | undefined) => {
//   const { edges, addEdge, updateEdge, removeEdge } = useEdgeStore()
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {}, [])

//   return { edges, addEdge, updateEdge, removeEdge, loading, error }
// }
