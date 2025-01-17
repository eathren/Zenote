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

        if (graphIds.length === 0) {
          setGraphs([])
          setLoading(false)
          return
        }
        // Fetch individual graphs since "in" query may not work as expected with doc IDs
        const graphFetchPromises = graphIds.map((graphId) =>
          getDoc(doc(db, "graphs", graphId))
        )
        const graphDocs = await Promise.all(graphFetchPromises)

        const updatedGraphs: Graph[] = graphDocs
          .map((graphDoc) => {
            if (graphDoc.exists()) {
              return graphDoc.data() as Graph
            }
            return null
          })
          .filter((graph) => graph !== null) as Graph[]

        setGraphs(updatedGraphs)
        setLoading(false)
      },
      (membershipErr) => {
        console.error("Membership error: ", membershipErr)
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
