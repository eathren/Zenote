import { useEffect, useState } from "react"
import { onSnapshot } from "firebase/firestore"
import { db } from "../firebase" // replace with your actual Firebase config import
import { useGraphStore } from "src/stores/graphStore"
import { Graph } from "src/types"
import { getGraphsCollectionRef } from "src/handles/utils"

export const useGraphs = () => {
  const { graphs, setGraphs, updateGraph } = useGraphStore()
  // Initialize loading state and error state
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    // Firebase subscription to listen for changes to the 'graphs' collection
    const unsubscribe = onSnapshot(
      getGraphsCollectionRef(db),
      (snapshot) => {
        const updatedGraphs: Graph[] = []

        snapshot.docChanges().forEach((change) => {
          const graphData = {
            ...change.doc.data(),
            id: change.doc.id,
          } as Graph

          if (change.type === "added") {
            updatedGraphs.push(graphData)
          }

          if (change.type === "modified") {
            updateGraph(graphData)
          }

          if (change.type === "removed") {
            // Handle removal logic if needed
          }
        })

        setGraphs(updatedGraphs)
        setLoading(false) // Set loading state to false after fetching data
      },
      (err) => {
        setError(err) // Set error state if an error occurs
        setLoading(false)
      }
    )

    // Cleanup: Unsubscribe from Firestore updates
    return () => unsubscribe()
  }, [setGraphs, updateGraph])

  return {
    graphs,
    setGraphs,
    loading, // Return the loading state
    error, // Return the error state
  }
}
