import { useMemo, useState } from "react"
import { collection, query, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { Graph, GraphObj } from "../types"
/**
 * Custom hook for listening to changes in graphs stored in Firestore.
 *
 * @returns {Object} Object containing the array of graphs.
 */
export const useGraphs = () => {
  const [graphs, setGraphs] = useState<GraphObj[]>([])

  useMemo(() => {
    const graphsCollection = collection(db, "graphs")
    const q = query(graphsCollection)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedGraphs: GraphObj[] = []

      snapshot.forEach((doc) => {
        //@ts-ignore
        const graph: GraphObj = {
          id: doc.id,
          data: doc.data() as Graph,
        }
        console.log(graph)
        updatedGraphs.push(graph)
      })

      setGraphs(updatedGraphs)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { graphs }
}
