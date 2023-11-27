import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, query, onSnapshot } from "firebase/firestore"
import { Block } from "src/types/blocks"
import { getCurrentUserId, getBlocksCollectionPath } from "src/handles/utils"

export const useBlocks = (
  graphId: string | undefined,
  nodeId: string | undefined
) => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    setBlocks([])
  }, [graphId, nodeId])

  useEffect(() => {
    let initialLoad = true

    if (!graphId || !nodeId) {
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

    const blocksCollectionPath = getBlocksCollectionPath(graphId, nodeId)
    const blocksCollection = collection(db, blocksCollectionPath)
    const q = query(blocksCollection) // Add any other query conditions if needed

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setLoading(false)
        setError(null)

        snapshot.docChanges().forEach((change) => {
          const blockData = {
            id: change.doc.id,
            ...change.doc.data(),
          } as Block

          setBlocks((prevBlocks) => {
            let newBlocks = initialLoad ? [] : [...prevBlocks]

            if (change.type === "added") {
              newBlocks.push(blockData)
            } else if (change.type === "modified") {
              const index = newBlocks.findIndex(
                (block) => block.id === blockData.id
              )
              newBlocks[index] = blockData
            } else if (change.type === "removed") {
              newBlocks = newBlocks.filter((block) => block.id !== blockData.id)
            }

            return newBlocks
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
  }, [graphId, nodeId])
  return { blocks, loading, error }
}
