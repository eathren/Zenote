import { useEffect, useState } from "react"
import {
  onSnapshot,
  query,
  where,
  collection,
  doc,
  getDoc,
} from "firebase/firestore"
import { db } from "../firebase"
import { Graph, GraphMembership } from "src/types"
import { getCurrentUserId } from "src/handles/utils"

export const useGraphs = () => {
  const [graphs, setGraphs] = useState<Graph[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const userId = getCurrentUserId()
    if (!userId) {
      setError(new Error("User not authenticated"))
      setLoading(false)
      return
    }

    const membershipQuery = query(
      collection(db, "memberships"),
      where("userId", "==", userId)
    )

    const unsubscribeMembership = onSnapshot(
      membershipQuery,
      async (membershipSnapshot) => {
        setLoading(true)
        const graphIds = membershipSnapshot.docs.map((doc) => {
          const data = doc.data() as GraphMembership
          return data.graphId
        })

        console.log("Fetched graphIds: ", graphIds) // Debugging line

        if (graphIds.length === 0) {
          setGraphs([])
          setLoading(false)
          console.log("No graphs found") // Debugging line
          return
        }
        console.log("1  ")
        // Fetch individual graphs since "in" query may not work as expected with doc IDs
        const graphFetchPromises = graphIds.map((graphId) =>
          getDoc(doc(db, "graphs", graphId))
        )
        const graphDocs = await Promise.all(graphFetchPromises)
        console.log("2  ")

        const updatedGraphs: Graph[] = graphDocs
          .map((graphDoc) => {
            if (graphDoc.exists()) {
              return graphDoc.data() as Graph
            }
            return null
          })
          .filter((graph) => graph !== null) as Graph[]

        console.log("Updated graphs: ", updatedGraphs) // Debugging line
        setGraphs(updatedGraphs)
        setLoading(false)
      },
      (membershipErr) => {
        console.error("Membership error: ", membershipErr) // Debugging line
        setError(membershipErr)
        setLoading(false)
      }
    )
    return () => unsubscribeMembership()
  }, [])

  return {
    graphs,
    loading,
    error,
  }
}

export default useGraphs
