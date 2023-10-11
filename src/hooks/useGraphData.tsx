import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, query, where, onSnapshot } from "firebase/firestore"

export const useGraphData = <T extends { id: string }>(
  collectionName: string,
  graphId: string | undefined
) => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    if (!graphId) {
      setLoading(false)
      return
    }

    const q = query(
      collection(db, collectionName),
      where("graphId", "==", graphId)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setLoading(false)
        setError(null)

        // Initialize an array to collect the new state
        let updatedData: T[] = []

        snapshot.forEach((doc) => {
          const newData: T = {
            id: doc.id,
            ...doc.data(),
          } as T

          updatedData.push(newData)
        })

        // Update the state only once per snapshot
        setData(updatedData)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    // Clean up the subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [collectionName, graphId])

  return { data, loading, error }
}
