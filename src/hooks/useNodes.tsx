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
import { getCurrentUserId, getNodeCollectionPath } from "src/handles/utils" // replace 'yourUtilityFile' with the actual path to your utility file

export const useNodes = (graphId: string | undefined) => {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    setNodes([])
  }, [graphId])

  useEffect(() => {
    let initialLoad = true

    if (!graphId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const ownerId = getCurrentUserId()
    if (!ownerId) {
      setError("No owner ID found")
      setLoading(false)
      return
    }

    const nodeCollectionPath = getNodeCollectionPath(graphId)
    const nodesCollection = collection(db, nodeCollectionPath)
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

            // Create a new array to store updated nodes
            let newNodes = [...prevNodes]

            if (change.type === "added") {
              // Check if the node already exists to avoid duplicates
              if (!newNodes.some((node) => node.id === nodeData.id)) {
                newNodes.push(nodeData)
              }
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
