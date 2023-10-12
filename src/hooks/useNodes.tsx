import { useEffect, useState } from "react"
import { db } from "../firebase"
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore"
import { GraphNode } from "src/types/index"

export const useNodes = (graphId: string | undefined) => {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    let initialLoad = true

    if (!graphId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const nodesCollection = collection(db, "nodes")
    const q = query(
      nodesCollection,
      where("graphId", "==", graphId),
      orderBy("date_created")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setLoading(false)
        setError(null)

        snapshot.docChanges().forEach((change) => {
          const nodeData = {
            id: change.doc.id,
            ...change.doc.data(),
          } as GraphNode

          setNodes((prevNodes) => {
            if (initialLoad) {
              return [...prevNodes, nodeData]
            }

            let newNodes = [...prevNodes]

            if (change.type === "added") {
              newNodes.push(nodeData)
            }
            if (change.type === "modified") {
              const index = newNodes.findIndex(
                (node) => node.id === nodeData.id
              )
              newNodes[index] = nodeData
            }
            if (change.type === "removed") {
              newNodes = newNodes.filter((node) => node.id !== nodeData.id)
            }

            return newNodes
          })
        })

        initialLoad = false
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [graphId])
  return { nodes, loading, error }
}
